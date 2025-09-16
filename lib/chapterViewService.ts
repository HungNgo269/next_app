import { unknown } from "zod";
import { sql } from "./db";

interface ViewMetadata {
  chapterId: number;
  bookId: number;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp: string;
}

interface ViewResult {
  success: boolean;
  isNewView?: boolean;
  error?: string;
}

interface ChapterViewStats {
  totalViews: number;
  uniqueUsers: number;
  uniqueIPs: number;
  bookId: number;
}

const UNIQUE_VIEW_TTL = 24 * 60 * 60;
const VIEW_BATCH_KEY = "views:batch:pending";
export async function incrementViewService(
  chapterId: number,
  bookId: number,
  userId?: string,
  ipAddress?: string
): Promise<ViewResult> {
  try {
    const redisHold = await import("@/lib/redis");
    const redis = redisHold.redis;
    const pipeline = redis.pipeline();
    const timestamp = new Date().toISOString();
    const viewKey = `chapter:${chapterId}:views`;
    const metadataKey = `chapter:${chapterId}:metadata`;
    const batchKey = VIEW_BATCH_KEY;
    let isNewUniqueView = false;
    let viewerIdentifier: string;
    const hashedIP = ipAddress ? hashIP(ipAddress) : null;

    if (userId) {
      viewerIdentifier = `user:${userId}`;
      const viewerKey = `${viewerIdentifier}:viewed:${chapterId}`;
      const hasViewed = await redis.exists(viewerKey);
      if (!hasViewed) {
        pipeline.set(viewerKey, "1", { ex: UNIQUE_VIEW_TTL });
        isNewUniqueView = true;
      }
    } else if (hashedIP && hashedIP !== "unknown") {
      viewerIdentifier = `ip:${hashedIP}`;
      const viewerKey = `${viewerIdentifier}:viewed:${chapterId}`;
      const hasViewed = await redis.exists(viewerKey);
      if (!hasViewed) {
        pipeline.set(viewerKey, "1", { ex: UNIQUE_VIEW_TTL });
        isNewUniqueView = true;
      }
    }

    if (isNewUniqueView) {
      pipeline.incr(viewKey);
      pipeline.hset(metadataKey, {
        bookId: bookId.toString(),
        lastViewedAt: timestamp,
      });

      if (userId) {
        pipeline.sadd(`${metadataKey}:users`, userId);
        pipeline.hincrby(`${metadataKey}:user_stats`, userId, 1);
      }

      if (hashedIP) {
        pipeline.sadd(`${metadataKey}:ips`, hashedIP);
        pipeline.hincrby(`${metadataKey}:ip_stats`, hashedIP, 1);
      }

      const viewData: ViewMetadata = {
        chapterId,
        bookId,
        userId,
        ipAddress: hashedIP || undefined,
        timestamp,
      };

      // ✅ Đảm bảo stringify object thành JSON string
      const viewDataString = JSON.stringify(viewData);
      pipeline.lpush(batchKey, viewDataString);

      const results = await pipeline.exec();

      if (!results) {
        throw new Error("Pipeline execution failed");
      }

      return {
        success: true,
        isNewView: true,
      };
    }

    return {
      success: true,
      isNewView: false,
    };
  } catch (error) {
    console.error("Error incrementing view:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getChapterStatsService(
  chapterId: number
): Promise<ChapterViewStats | null> {
  try {
    const redisHold = await import("@/lib/redis");
    const redis = redisHold.redis;
    const pipeline = redis.pipeline();
    const viewKey = `chapter:${chapterId}:views`;
    const metadataKey = `chapter:${chapterId}:metadata`;

    pipeline.get(viewKey);
    pipeline.hget(metadataKey, "bookId");
    pipeline.scard(`${metadataKey}:users`);
    pipeline.scard(`${metadataKey}:ips`);

    const results = (await pipeline.exec()) as Array<[unknown, unknown]> | null;

    if (!results) return null;

    const viewCount = (results[0]?.[1] as string | null) ?? null;
    const bookId = (results[1]?.[1] as string | null) ?? null;
    const uniqueUsers = (results[2]?.[1] as number | null) ?? null;
    const uniqueIPs = (results[3]?.[1] as number | null) ?? null;

    return {
      totalViews: parseInt(viewCount || "0"),
      bookId: parseInt(bookId || "0"),
      uniqueUsers: uniqueUsers || 0,
      uniqueIPs: uniqueIPs || 0,
    };
  } catch (error) {
    console.error("Error getting chapter stats:", error);
    return null;
  }
}

async function syncChapterViews(
  chapterId: number,
  views: ViewMetadata[]
): Promise<void> {
  for (const view of views) {
    try {
      await sql`
        INSERT INTO chapter_views (
          chapter_id, 
          book_id, 
          user_id, 
          ip_address, 
          user_agent,
          viewed_at
        )
        VALUES (
          ${chapterId},
          ${view.bookId},
          ${view.userId || null},
          ${view.ipAddress || null},
          ${view.userAgent || null},

          ${new Date(view.timestamp)}::timestamp
        )
        ON CONFLICT DO NOTHING;
      `;
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Database Error for chapter ${chapterId}:`, err.message);
    }
  }
}

async function updateChapterAggregatedStats(): Promise<void> {
  const redisHold = await import("@/lib/redis");
  const redis = redisHold.redis;

  try {
    const pattern = "chapter:*:views";
    const keys: string[] = [];
    let cursor = "0";

    do {
      const result = await redis.scan(cursor, {
        match: pattern,
        count: 100,
      });
      cursor = result[0];
      keys.push(...(result[1] as string[]));
    } while (cursor !== "0");

    console.log(`Found ${keys.length} chapter view keys to process`);

    if (keys.length === 0) {
      console.log("No chapter view keys found");
      return;
    }

    // Process trong batches để tránh overwhelm
    const batchSize = 50;
    let totalProcessed = 0;
    let totalErrors = 0;

    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);

      try {
        await processBatch(redis, batch);
        totalProcessed += batch.length;
        console.log(
          `Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
            keys.length / batchSize
          )} (${batch.length} keys)`
        );
      } catch (error) {
        totalErrors += batch.length;
        console.error(`Failed to process batch starting at index ${i}:`, error);
        // Continue với batch tiếp theo thay vì throw
      }
    }

    console.log(
      `Chapter aggregated stats completed. Processed: ${totalProcessed}, Errors: ${totalErrors}`
    );
  } catch (error) {
    console.error("Error in updateChapterAggregatedStats:", error);
    throw error;
  }
}

async function processBatch(redis: any, batch: string[]): Promise<void> {
  // Lấy tất cả values trong một pipeline
  const pipeline = redis.pipeline();
  for (const key of batch) {
    pipeline.get(key);
  }

  const results = await pipeline.exec();
  if (!results) {
    throw new Error("Pipeline execution failed");
  }

  // Prepare data cho database update
  const dbUpdates: Array<{ chapterId: number; count: number; key: string }> =
    [];
  const keysToDelete: string[] = [];

  for (let j = 0; j < batch.length; j++) {
    const key = batch[j];
    const result = results[j];

    if (result[0] !== null) {
      console.error(`Redis error for key ${key}:`, result[0]);
      continue;
    }

    // Parse chapterId từ key (format: "chapter:123:views")
    const keyParts = key.split(":");
    if (
      keyParts.length !== 3 ||
      keyParts[0] !== "chapter" ||
      keyParts[2] !== "views"
    ) {
      console.warn(`Invalid key format: ${key}`);
      keysToDelete.push(key); // Xóa key có format sai
      continue;
    }

    const chapterId = parseInt(keyParts[1], 10);
    if (!Number.isFinite(chapterId) || chapterId <= 0) {
      console.warn(`Invalid chapter ID in key: ${key}`);
      keysToDelete.push(key);
      continue;
    }

    const raw = result[1];
    const count = raw != null ? parseInt(String(raw), 10) : 0;

    if (Number.isFinite(count) && count > 0) {
      dbUpdates.push({ chapterId, count, key });
    } else {
      // Count = 0 hoặc invalid, chỉ cần xóa key
      keysToDelete.push(key);
    }
  }

  // Batch database updates
  if (dbUpdates.length > 0) {
    try {
      // Có thể tối ưu hơn bằng cách dùng transaction hoặc bulk update
      const updatePromises = dbUpdates.map(
        async ({ chapterId, count, key }) => {
          try {
            await sql`
            UPDATE chapters
            SET view_count = COALESCE(view_count, 0) + ${count},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${chapterId};
          `;

            console.log(`Updated chapter ${chapterId} with ${count} views`);
            return key; // Return key để xóa sau
          } catch (error) {
            console.error(`Database error for chapter ${chapterId}:`, error);
            throw error; // Không xóa key nếu DB update fail
          }
        }
      );

      const successfulKeys = await Promise.all(updatePromises);
      keysToDelete.push(...successfulKeys);
    } catch (error) {
      // Nếu có lỗi DB, không xóa bất kỳ key nào
      throw new Error(`Database update failed: ${error}`);
    }
  }

  // Xóa tất cả keys thành công trong một pipeline
  if (keysToDelete.length > 0) {
    const deletePipeline = redis.pipeline();
    for (const key of keysToDelete) {
      deletePipeline.del(key);
    }

    try {
      await deletePipeline.exec();
      console.log(`Deleted ${keysToDelete.length} Redis keys`);
    } catch (error) {
      console.error("Error deleting Redis keys:", error);
      // Không throw vì DB đã update thành công
    }
  }
}

async function updateBooksAggregatedStats(): Promise<void> {
  try {
    console.log("Updating book aggregated stats...");

    // ✅ Fixed SQL syntax với proper alias
    const result = await sql`
      UPDATE books 
      SET views = (
        SELECT COALESCE(SUM(c.view_count), 0)
        FROM chapters c 
        WHERE c.book_id = books.id
      ),
      updated_at = CURRENT_TIMESTAMP
      returning *
    `;

    console.log(`Updated ${result.length} books with aggregated view counts`);
  } catch (error) {
    console.error("Database Error in updateBooksAggregatedStats:", error);
    throw new Error(
      `Failed to update view count for books: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
export async function syncViewsToDatabase(): Promise<{
  success: boolean;
  processed: number;
  errors: string[];
}> {
  const redisHold = await import("@/lib/redis");
  const redis = redisHold.redis;
  const errors: string[] = [];
  let processed = 0;

  try {
    const batchKey = VIEW_BATCH_KEY;
    const batchSize = 100;

    let viewsData = await redis.lrange(batchKey, 0, batchSize - 1);

    while (viewsData.length > 0) {
      const views: ViewMetadata[] = [];

      for (const rawView of viewsData) {
        try {
          let parsedView: any;

          if (typeof rawView === "string") {
            parsedView = JSON.parse(rawView);
          } else if (typeof rawView === "object" && rawView !== null) {
            parsedView = rawView;
          } else {
            console.error("Invalid view data format:", rawView);
            continue;
          }

          const validatedView: ViewMetadata = {
            chapterId: Number(parsedView.chapterId),
            bookId: Number(parsedView.bookId),
            userId: parsedView.userId,
            ipAddress: parsedView.ipAddress,
            timestamp: parsedView.timestamp,
          };

          if (isNaN(validatedView.chapterId) || isNaN(validatedView.bookId)) {
            console.error("Invalid chapterId or bookId:", parsedView);
            errors.push(`Invalid chapterId or bookId in view data`);
            continue;
          }

          views.push(validatedView);
        } catch (parseError) {
          console.error(
            "Error parsing view data:",
            parseError,
            "Raw data:",
            rawView
          );
          errors.push(`Failed to parse view data: ${parseError}`);
        }
      }

      if (views.length === 0) {
        await redis.ltrim(batchKey, batchSize, -1);
        viewsData = await redis.lrange(batchKey, 0, batchSize - 1);
        continue;
      }

      const chapterGroups = new Map<number, ViewMetadata[]>();
      for (const view of views) {
        if (!chapterGroups.has(view.chapterId)) {
          chapterGroups.set(view.chapterId, []);
        }
        chapterGroups.get(view.chapterId)!.push(view);
      }

      for (const [chapterId, chapterViews] of Array.from(
        chapterGroups.entries()
      )) {
        try {
          await syncChapterViews(chapterId, chapterViews);
          processed += chapterViews.length;
        } catch (error) {
          errors.push(`Chapter ${chapterId}: ${error}`);
        }
      }

      await redis.ltrim(batchKey, batchSize, -1);
      viewsData = await redis.lrange(batchKey, 0, batchSize - 1);
    }

    console.log(`Synced ${processed} individual views to database`);

    if (processed > 0) {
      console.log("Updating aggregated stats...");

      try {
        await updateChapterAggregatedStats();
        console.log("Chapter aggregated stats updated successfully");
      } catch (error) {
        console.error("Error updating chapter aggregated stats:", error);
        errors.push(`Failed to update chapter aggregated stats: ${error}`);
      }

      try {
        await updateBooksAggregatedStats();
        console.log("Book aggregated stats updated successfully");
      } catch (error) {
        console.error("Error updating book aggregated stats:", error);
        errors.push(`Failed to update book aggregated stats: ${error}`);
      }
    }

    return {
      success: errors.length === 0,
      processed,
      errors,
    };
  } catch (error) {
    console.error("Error syncing views to database:", error);
    return {
      success: false,
      processed,
      errors: [
        ...errors,
        error instanceof Error ? error.message : "Unknown error",
      ],
    };
  }
}

function hashIP(ip: string): string {
  const crypto = require("crypto");
  return crypto
    .createHash("sha256")
    .update(ip + (process.env.IP_SALT || "default-salt"))
    .digest("hex")
    .substring(0, 16); // Use first 16 chars for shorter storage
}

export function getClientIP(request: Request): string {
  const headers = [
    "cf-connecting-ip",
    "x-real-ip",
    "x-forwarded-for",
    "x-client-ip",
    "x-forwarded",
    "x-cluster-client-ip",
    "forwarded-for",
    "forwarded",
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      const ip = value.split(",")[0].trim();
      if (isValidIP(ip)) {
        return ip;
      }
    }
  }
  return "unknown";
}
export function isValidIP(ip: string): boolean {
  const ipv4Regex =
    /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}):){7}([0-9a-fA-F]{1,4})$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
