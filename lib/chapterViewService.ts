import redis from "./redis";
import { createHash } from "crypto";
import type {
  Chapter,
  ChapterStats,
  ChapterWithStats,
  ViewResult,
  ViewHistoryItem,
  TopChapter,
} from "@/app/interface/chapter";

export default class ChapterViewService {
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly DAILY_TTL = 86400 * 30; // 30 days
  private readonly USER_VIEW_TTL = 86400; // 1 day
  private readonly GUEST_VIEW_TTL = 3600;
  constructor() {}

  async incrementView(
    chapterId: string,
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

      pipeline.incr(viewKey); //+1

      pipeline.incr(dailyViewKey);
      pipeline.expire(dailyViewKey, this.DAILY_TTL);

      pipeline.zincrby("chapters:ranking:views", 1, chapterId); //tên sorted set -> tăng bao nhiêu -> tên phần tử được tăng

      // Track unique view - ưu tiên userId, fallback sang IP
      let isNewUniqueView = false;

      if (userId) {
        const viewerKey = `user:${userId}:viewed:${chapterId}`;
        const hasViewed = await redis.exists(viewerKey);
        if (!hasViewed) {
          pipeline.sadd(uniqueViewKey, userId);

          pipeline.setex(viewerKey, this.USER_VIEW_TTL, "1");

          isNewUniqueView = true;
        }
      } else {
        const viewerKey = `ip:${this.hashIP(ipAddress!)}:viewed:${chapterId}`;
        const hasViewed = await redis.exists(viewerKey);
        if (!hasViewed) {
          pipeline.sadd(uniqueViewKey, userId);

          pipeline.setex(viewerKey, this.GUEST_VIEW_TTL, "1");

          isNewUniqueView = true;
        }
      }
      // Thực thi pipeline
      const results = await pipeline.exec();
      return {
        success: true,
        totalViews: results[0] as number,
        dailyViews: results[1] as number,
      };
    } catch (error) {
      console.error("Error incrementing view:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
  async getChapterStats(chapterId: string): Promise<ChapterStats | null> {
    try {
      const pipeline = redis.pipeline();
      const viewKey = `chapter:${chapterId}:views`;
      const uniqueViewKey = `chapter:${chapterId}:unique_views`;
      const today = new Date().toISOString().split("T")[0];
      const dailyViewKey = `chapter:${chapterId}:views:${today}`;

      pipeline.get(viewKey);
      pipeline.scard(uniqueViewKey);
      pipeline.get(dailyViewKey);

      const [totalViews, uniqueViews, todayViews] = await pipeline.exec();

      return {
        totalViews: parseInt(totalViews as string) || 0,
        uniqueViews: parseInt(uniqueViews as string) || 0,
        todayViews: parseInt(todayViews as string) || 0,
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
    // nhót
    return "unknown";
  }
  static isValidIP(ip: string): boolean {
    const ipv4Regex =
      /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

    const ipv6Regex = /^(([0-9a-fA-F]{1,4}):){7}([0-9a-fA-F]{1,4})$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }
}
