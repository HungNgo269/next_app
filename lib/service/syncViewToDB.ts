"use server";
import {
  syncChapterViews,
  updateBooksAggregatedStats,
} from "@/app/data/viewData";
import { ViewMetadata } from "@/app/interface/view";
import { sql } from "@/lib/db";
import { redis } from "@/lib/redis";

const VIEW_BATCH_KEY = "views:batch:pending";

async function updateChapterAggregatedStats(): Promise<void> {
  try {
    const pattern = "chapter:*:views";
    const keys: string[] = [];
    let cursor = "0";
    // Scan for keys
    do {
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

    // Process in batches
    const batchSize = 50;
    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);
      try {
        // Sử dụng approach không dùng pipeline để tránh format issues(claude)
        await processBatchDirect(redis, batch);
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

async function processBatchDirect(redis: any, batch: string[]): Promise<void> {
  const dbUpdates: Array<{ chapterId: number; count: number; key: string }> =
    [];
  const keysToDelete: string[] = [];

  const valuePromises = batch.map(async (key) => {
    try {
      const value = await redis.get(key);
      return { key, value };
    } catch (error) {
      console.error(`Failed to get value for ${key}:`, error);
      return { key, value: null };
    }
  });

  const results = await Promise.all(valuePromises);

  for (const { key, value } of results) {
    // Parse chapterId from key
    const keyParts = key.split(":");
    if (
      keyParts.length !== 3 ||
      keyParts[0] !== "chapter" ||
      keyParts[2] !== "views"
    ) {
      console.warn(`Invalid key format: ${key}`);
      keysToDelete.push(key);
      continue;
    }

    const chapterId = parseInt(keyParts[1], 10);
    if (!Number.isFinite(chapterId) || chapterId <= 0) {
      console.warn(`Invalid chapter ID in key: ${key}`);
      keysToDelete.push(key);
      continue;
    }

    // Check value
    if (value === null || value === undefined || value === "") {
      console.log(`Key ${key} has no value - will delete`);
      keysToDelete.push(key);
      continue;
    }

    const count = parseInt(String(value), 10);
    if (Number.isFinite(count) && count > 0) {
      console.log(`Found ${key} with count ${count}`);
      dbUpdates.push({ chapterId, count, key });
    } else {
      console.warn(`Key ${key} has invalid count: ${value} - will delete`);
      keysToDelete.push(key);
    }
  }

  // Update database
  if (dbUpdates.length > 0) {
    const successfulKeys: string[] = [];

    // Use Promise.all for parallel updates
    const updatePromises = dbUpdates.map(async ({ chapterId, count, key }) => {
      try {
        await sql`
          UPDATE chapters
          SET view_count = COALESCE(view_count, 0) + ${count},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${chapterId};
        `;
        console.log(`Updated chapter ${chapterId} with ${count} views`);
        return { success: true, key };
      } catch (error) {
        console.error(`Database error for chapter ${chapterId}:`, error);
        return { success: false, key };
      }
    });

    const updateResults = await Promise.all(updatePromises);

    // Only delete keys that were successfully updated
    for (const result of updateResults) {
      if (result.success) {
        successfulKeys.push(result.key);
      }
    }

    keysToDelete.push(...successfulKeys);
  }

  // Delete processed/invalid keys
  if (keysToDelete.length > 0) {
    try {
      // Use Promise.all for parallel deletes
      const deletePromises = keysToDelete.map((key) => redis.del(key));
      await Promise.all(deletePromises);
      console.log(`Deleted ${keysToDelete.length} Redis keys`);
    } catch (error) {
      console.error("Error deleting Redis keys:", error);
    }
  }
}

export async function syncViewsToDatabase(): Promise<{
  success: boolean;
  processed: number;
  errors: string[];
}> {
  let processed = 0;
  const errors: string[] = [];
  try {
    try {
      await redis.ping();
      console.log("Redis connection successful");
    } catch (error) {
      console.error("Redis connection failed:", error);
      errors.push("Redis connection failed");
      return { success: false, processed: 0, errors };
    }

    const batchSize = 50;
    let viewsData = await redis.lrange(VIEW_BATCH_KEY, 0, batchSize - 1);

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
          console.error("Error parsing view data:", parseError);
          errors.push(`Failed to parse view data: ${parseError}`);
        }
      }

      if (views.length === 0) {
        await redis.ltrim(VIEW_BATCH_KEY, batchSize, -1);
        viewsData = await redis.lrange(VIEW_BATCH_KEY, 0, batchSize - 1);
        continue;
      }

      // chapterID, [batch]
      const chapterGroups = new Map<number, ViewMetadata[]>();
      for (const view of views) {
        if (!chapterGroups.has(view.chapterId)) {
          chapterGroups.set(view.chapterId, []);
        }
        chapterGroups.get(view.chapterId)!.push(view);
      }

      // Process each chapter group
      for (const [chapterId, chapterViews] of Array.from(
        chapterGroups.entries()
      )) {
        try {
          await syncChapterViews(chapterId, chapterViews);
          processed += chapterViews.length;
        } catch (error) {
          const errorMsg = `Chapter ${chapterId}: ${error}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }

      // Bỏ 50 batch cũ, => đặt lại 50 batch mới
      await redis.ltrim(VIEW_BATCH_KEY, batchSize, -1);
      viewsData = await redis.lrange(VIEW_BATCH_KEY, 0, batchSize - 1);
    }

    // Update aggregated stats if we processed any views
    if (processed > 0) {
      try {
        await updateChapterAggregatedStats();
        console.log("Chapter aggregated stats updated");
      } catch (error) {
        console.error("Failed to update chapter aggregated stats:", error);
        errors.push(`Chapter stats update failed: ${error}`);
      }

      try {
        await updateBooksAggregatedStats();
        console.log("Book aggregated stats updated");
      } catch (error) {
        console.error("Failed to update book aggregated stats:", error);
        errors.push(`Book stats update failed: ${error}`);
      }
    }

    return {
      success: errors.length === 0,
      processed,
      errors: errors.length > 0 ? errors : [],
    };
  } catch (error) {
    console.error("Error syncing views to database:", error);
    errors.push(`General sync error: ${error}`);
    return {
      success: false,
      processed,
      errors,
    };
  }
}
