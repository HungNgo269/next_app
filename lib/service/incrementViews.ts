import { ViewResult } from "@/app/interface/chapter";
import { ViewMetadata } from "@/app/interface/view";
import { hashIP } from "@/lib/utils/ipUtils";

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
    const batchKey = "views:batch:pending";
    const UNIQUE_VIEW_TTL = 24 * 60 * 60;
    let isNewUniqueView = false; //key check view trùng lặp
    let viewerIdentifier: string;
    const hashedIP = ipAddress ? hashIP(ipAddress) : null;

    if (userId) {
      viewerIdentifier = `user:${userId}`;
      const viewerKey = `${viewerIdentifier}:viewed:${chapterId}`;
      const hasViewed = await redis.exists(viewerKey);
      if (!hasViewed) {
        pipeline.set(viewerKey, "1", { ex: UNIQUE_VIEW_TTL }); //upsert key - value, thời gian hết hạn => check nếu quá ex => ok to have
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

      //  Đảm bảo stringify object thành JSON string
      const viewDataString = JSON.stringify(viewData);
      pipeline.lpush(batchKey, viewDataString); // push vô views:batch:pending viewData đoạn này ok

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
