"use server";
import {
  syncChapterViews,
  updateBooksAggregatedStats,
} from "@/app/data/viewData";
import { ViewMetadata } from "@/app/interface/view";
import { sql } from "@/lib/db";
const VIEW_BATCH_KEY = "views:batch:pending";
import { redis } from "@/lib/redis";

async function updateChapterAggregatedStats(): Promise<void> {
  try {
    const pattern = "chapter:*:views";
    const keys: string[] = []; //mảng chứa pattern [chapter:*:views,chapter:*:views,...]
    let cursor = "0";
    do {
      //scan 50 items với pattern
      const result = await redis.scan(cursor, {
        match: pattern,
        count: 50,
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

    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);
      try {
        await processBatch(redis, batch);
      } catch (error) {
        console.error(`Failed to process batch starting at index ${i}:`, error);
      }
    }
  } catch (error) {
    console.error(
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
  let processed = 0;
  let errors = [""];
  try {
    const batchSize = 50;
    let viewsData = await redis.lrange(VIEW_BATCH_KEY, 0, batchSize - 1); //key start end

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

          views.push(validatedView);
        } catch (parseError) {
          console.error(
            "Error parsing view data:",
            parseError,
            "Raw data:",
            rawView
          );
          console.log(`Failed to parse view data: ${parseError}`);
        }
      }

      if (views.length === 0) {
        await redis.ltrim(VIEW_BATCH_KEY, batchSize, -1); //xóa phần từ thứ 50 về trước
        viewsData = await redis.lrange(VIEW_BATCH_KEY, 0, batchSize - 1); //set lại range từ 0 tới 50
        continue;
      }

      const chapterGroups = new Map<number, ViewMetadata[]>(); //chapterID, viewData
      for (const view of views) {
        if (!chapterGroups.has(view.chapterId)) {
          chapterGroups.set(view.chapterId, []); //{chapterID:[{viewData1},{viewData2}]}
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
          console.log(`Chapter ${chapterId}: ${error}`);
        }
      }

      await redis.ltrim(VIEW_BATCH_KEY, batchSize, -1);
      viewsData = await redis.lrange(VIEW_BATCH_KEY, 0, batchSize - 1);
    }
    if (processed > 0) {
      try {
        await updateChapterAggregatedStats();
      } catch (error) {
        console.error(`Failed to update chapter aggregated stats: ${error}`);
      }
      try {
        await updateBooksAggregatedStats();
      } catch (error) {
        console.error(`Failed to update book aggregated stats: ${error}`);
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
      errors,
    };
  }
}
//chạy batch processing với pipline, như kiểu thay vì tuần tự gọi sql tăng view => cho nó chạy song song với promise all
async function processBatch(redis: any, batch: string[]): Promise<void> {
  //bach =[chapter:*:views,chapter:*:views]
  // Lấy tất cả values trong một pipeline
  const pipeline = redis.pipeline();
  for (const key of batch) {
    pipeline.get(key);
    console.error("key", key);
  }

  const results = await pipeline.exec();
  if (!results) {
    throw new Error("Pipeline execution failed");
  }

  const dbUpdates: Array<{ chapterId: number; count: number; key: string }> =
    [];
  const keysToDelete: string[] = [];

  for (let i = 0; i < batch.length; i++) {
    const key = batch[i];
    const result = results[i];

    if (result[0] != null) {
      console.log("result", result);
      console.error(`Redis error for key ${key}:`, result[0]);
      continue;
    }

    // Parse chapterId từ key (format: "chapter:number:views")
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
    if (raw == null) {
      console.error(`Key ${key} not found or has null value - skipping`);
      keysToDelete.push(key);
      continue;
    }

    const count = parseInt(String(raw), 10);

    if (Number.isFinite(count) && count > 0) {
      dbUpdates.push({ chapterId, count, key });
    } else {
      console.error(`Key ${key} has invalid count: ${raw} - deleting`);
      keysToDelete.push(key);
    }
  }
  if (dbUpdates.length > 0) {
    try {
      //khá hay
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
