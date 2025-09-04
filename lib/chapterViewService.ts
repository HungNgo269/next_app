import redis from "./redis";
import { createHash } from "crypto";
import type { ChapterStats, ViewResult } from "@/app/interface/chapter";

export default class ChapterViewService {
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly DAILY_TTL = 86400 * 30; // 30 days
  private readonly USER_VIEW_TTL = 86400; // 1 day
  private readonly GUEST_VIEW_TTL = 3600;
  constructor() {}

  async incrementView(
    chapterId: number,
    userId?: string,
    ipAddress?: string
  ): Promise<ViewResult> {
    try {
      const pipeline = redis.pipeline();
      // Keys
      const viewKey = `chapter:${chapterId}:views`;
      const today = new Date().toISOString().split("T")[0];
      const dailyViewKey = `chapter:${chapterId}:views:${today}`;
      const uniqueViewKey = `chapter:${chapterId}:unique_views`;

      // Track unique view - ưu tiên userId, fallback sang IP
      let isNewUniqueView = false;
      let shouldExecutePipeline = false;

      console.log("userId", userId);

      if (userId) {
        const viewerKey = `user:${userId}:viewed:${chapterId}`;
        const hasViewed = await redis.exists(viewerKey);
        if (!hasViewed) {
          pipeline.sadd(uniqueViewKey, userId);
          pipeline.setex(viewerKey, this.USER_VIEW_TTL, 1);
          pipeline.incr(viewKey); //+1
          pipeline.incr(dailyViewKey);
          pipeline.expire(dailyViewKey, this.DAILY_TTL);
          pipeline.zincrby("chapters:ranking:views", 1, chapterId);

          isNewUniqueView = true;
          shouldExecutePipeline = true;
        }
      } else if (ipAddress && ipAddress !== "unknown") {
        const hashedIP = this.hashIP(ipAddress);
        const viewerKey = `ip:${hashedIP}:viewed:${chapterId}`;
        const hasViewed = await redis.exists(viewerKey);

        if (!hasViewed) {
          pipeline.sadd(uniqueViewKey, hashedIP);
          pipeline.setex(viewerKey, this.GUEST_VIEW_TTL, "1");
          pipeline.incr(viewKey); //+1
          pipeline.incr(dailyViewKey);
          pipeline.expire(dailyViewKey, this.DAILY_TTL);
          pipeline.zincrby("chapters:ranking:views", 1, chapterId);

          isNewUniqueView = true;
          shouldExecutePipeline = true;
        }
      }

      // Chỉ execute pipeline khi có operations
      if (shouldExecutePipeline) {
        const results = await pipeline.exec();
        // Redis pipeline exec() trả về array các [error, result] tuples
        const pipelineResults = results as [Error | null, any][] | null;

        if (!pipelineResults) {
          throw new Error("Pipeline execution failed");
        }

        const totalViewsResult = pipelineResults[2]; // incr(viewKey)
        const dailyViewsResult = pipelineResults[3]; // incr(dailyViewKey)

        const totalViews = (totalViewsResult?.[1] as number) || 0;
        const dailyViews = (dailyViewsResult?.[1] as number) || 0;
        console.log("checkResuilt", pipelineResults); // [ 0, 'OK', 2, 1, 1, 2 ]
        return {
          success: true,
          totalViews,
          dailyViews,
          isNewView: isNewUniqueView,
        };
      } else {
        // Trường hợp đã view rồi, trả về stats hiện tại
        const currentStats = await this.getChapterStats(chapterId);
        console.log("current", currentStats);
        return {
          success: true,
          totalViews: currentStats?.totalViews || 0,
          dailyViews: currentStats?.todayViews || 0,
          isNewView: false,
        };
      }
    } catch (error) {
      console.error("Error incrementing view:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getChapterStats(chapterId: number): Promise<ChapterStats | null> {
    try {
      const pipeline = redis.pipeline();
      const viewKey = `chapter:${chapterId}:views`;
      const uniqueViewKey = `chapter:${chapterId}:unique_views`;
      const today = new Date().toISOString().split("T")[0];
      const dailyViewKey = `chapter:${chapterId}:views:${today}`;

      pipeline.get(viewKey);
      pipeline.scard(uniqueViewKey);
      pipeline.get(dailyViewKey);

      const results = await pipeline.exec();
      // Redis pipeline exec() trả về array các [error, result] tuples
      const pipelineResults = results as [Error | null, any][] | null;

      // Kiểm tra results trước khi parse
      if (!pipelineResults || pipelineResults.length !== 3) {
        return null;
      }

      const [totalViewsResult, uniqueViewsResult, todayViewsResult] =
        pipelineResults;
      return {
        totalViews: parseInt(String(totalViewsResult?.[1] || "0")) || 0,
        uniqueViews: parseInt(String(uniqueViewsResult?.[1] || "0")) || 0,
        todayViews: parseInt(String(todayViewsResult?.[1] || "0")) || 0,
      };
    } catch (error) {
      console.error("Error getting chapter stats:", error);
      return null;
    }
  }

  private hashIP(ip: string): string {
    return createHash("sha256").update(ip).digest("hex");
  }

  static getClientIP(request: Request): string {
    const headers = [
      "cf-connecting-ip", // Cloudflare
      "x-real-ip", // Nginx
      "x-forwarded-for", // Most proxies
      "x-client-ip",
      "x-forwarded",
      "x-cluster-client-ip",
      "forwarded-for",
      "forwarded",
    ];

    for (const header of headers) {
      const value = request.headers.get(header);
      if (value) {
        // x-forwarded-for có thể có nhiều IP, lấy cái đầu tiên
        const ip = value.split(",")[0].trim();
        if (this.isValidIP(ip)) {
          return ip;
        }
      }
    }
    return "unknown";
  }

  static isValidIP(ip: string): boolean {
    const ipv4Regex =
      /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

    const ipv6Regex = /^(([0-9a-fA-F]{1,4}):){7}([0-9a-fA-F]{1,4})$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }
}
