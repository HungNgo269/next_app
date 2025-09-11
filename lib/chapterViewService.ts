import redis from "./redis";
import { sql } from "./db";

interface ViewMetadata {
  chapterId: number;
  bookId: number;
  userId?: string;
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
    } else if (ipAddress && ipAddress !== "unknown") {
      viewerIdentifier = `ip:${hashedIP}`;
      const viewerKey = `${viewerIdentifier}:viewed:${chapterId}`;
      const hasViewed = await redis.exists(viewerKey);
      if (!hasViewed) {
        pipeline.set(viewerKey, "1", { ex: UNIQUE_VIEW_TTL });
        isNewUniqueView = true;
      }
    } else {
      return {
        success: false,
        error: `No user ID or valid IP address provided,userId :${userId},hashIP:${hashedIP}`,
      };
    }

    if (isNewUniqueView) {
      pipeline.incr(viewKey);
      pipeline.zincrby("chapters:ranking:views", 1, chapterId);
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
      pipeline.lpush(batchKey, JSON.stringify(viewData));
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

export async function syncViewsToDatabase(): Promise<{
  success: boolean;
  processed: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let processed = 0;
  try {
    const batchKey = VIEW_BATCH_KEY;
    const batchSize = 100;
    let viewsData = await redis.lrange(batchKey, 0, batchSize - 1);
    while (viewsData.length > 0) {
      const views: ViewMetadata[] = viewsData.map((v) => JSON.parse(v));
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
    await updateChapterAggregatedStats();
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

async function syncChapterViews(
  chapterId: number,
  views: ViewMetadata[]
): Promise<void> {
  const stats = await getChapterStatsService(chapterId);
  if (!stats) return;
  for (const view of views) {
    try {
      await sql`
        INSERT INTO chapter_views (
          chapter_id, 
          book_id, 
          user_id, 
          ip_address, 
          viewed_at
        )
        VALUES (
          ${chapterId},
          ${stats.bookId},
          ${view.userId || null},
          ${view.ipAddress || null},
          ${new Date(view.timestamp)}::timestamp
        )
        ON CONFLICT DO NOTHING;
      `;
    } catch (error) {
      console.error(`Database Error for chapter ${chapterId}:`, error);
      throw new Error(`Failed to sync view for chapter ${chapterId}`);
    }
  }
}

async function updateChapterAggregatedStats(): Promise<void> {
  const pattern = "chapter:*:views";
  const keys = (await redis.keys(pattern)) as unknown as string[];

  for (const key of keys) {
    const chapterId = parseInt(String(key).split(":")[1] || "0", 10);
    const raw = (await redis.get(key)) as unknown;
    const count = raw != null ? parseInt(String(raw), 10) : 0;

    if (Number.isFinite(count) && count > 0) {
      try {
        await sql`
          UPDATE chapters
          SET view_count = COALESCE(view_count, 0) + ${count},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${chapterId};
        `;
      } catch (error) {
        console.error("Database Error:", error);
        throw new Error(`Failed to update view count for chapter ${chapterId}`);
      }
    }
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
