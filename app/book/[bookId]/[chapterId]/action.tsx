"use server";

import ChapterViewService from "@/lib/chapterViewService";
import { headers } from "next/headers";
import fetchChapter from "./data";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { defaultSettings, ReaderSettings } from "@/lib/readerSetting";

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
export async function fetchChapterActions(chapterId: string) {
  try {
    return await fetchChapter(chapterId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function updateReaderSettings(settings: Partial<ReaderSettings>) {
  const cookieStore = await cookies();

  // Get current settings
  const currentSettingsString = cookieStore.get("reader-settings")?.value;
  const currentSettings = currentSettingsString
    ? JSON.parse(currentSettingsString)
    : defaultSettings;

  const newSettings = { ...currentSettings, ...settings };
  console.log("newSettings", newSettings);
  cookieStore.set("reader-settings", JSON.stringify(newSettings), {
    httpOnly: false, // thông tin cùi chắc là ko cần bảo mật
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  // Optional: Sync to database for logged users
  // const session = await auth();
  // if (session?.user?.id) {
  //   await saveUserSettingsToDb(session.user.id, newSettings);
  // }

  revalidatePath("/");
}
