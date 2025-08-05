"use server";

import ChapterViewService from "@/lib/chapterViewService";
import { headers } from "next/headers";

export async function incrementChapterView(chapterId: string, userId?: string) {
  try {
    const headersList = await headers();

    // Get client IP from headers
    const getClientIP = (): string => {
      const forwardedFor = headersList.get("x-forwarded-for");
      const realIP = headersList.get("x-real-ip");
      const cfConnectingIP = headersList.get("cf-connecting-ip");

      if (cfConnectingIP) return cfConnectingIP;
      if (realIP) return realIP;
      if (forwardedFor) return forwardedFor.split(",")[0].trim();

      return "127.0.0.1"; // fallback for development
    };

    const chapterService = new ChapterViewService();
    const ipAddress = getClientIP();

    const result = await chapterService.incrementView(
      chapterId,
      userId,
      ipAddress
    );

    if (result.success) {
      return {
        success: true,
        totalViews: result.totalViews,
        dailyViews: result.dailyViews,
      };
    } else {
      console.error("Failed to increment view:", result.error);
      return {
        success: false,
        error: result.error,
      };
    }
  } catch (error) {
    console.error("Server Action Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getChapterStats(chapterId: string) {
  try {
    const chapterService = new ChapterViewService();
    const stats = await chapterService.getChapterStats(chapterId);

    return (
      stats || {
        totalViews: 0,
        uniqueViews: 0,
        todayViews: 0,
      }
    );
  } catch (error) {
    console.error("Error getting chapter stats:", error);
    return {
      totalViews: 0,
      uniqueViews: 0,
      todayViews: 0,
    };
  }
}
