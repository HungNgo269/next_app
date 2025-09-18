"use server";

import {
  checkNextChapter,
  checkPrevChapter,
  fetchChapter,
} from "@/app/book/[bookId]/chapter/[chapterId]/data";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { defaultSettings, ReaderSettings } from "@/lib/readerSetting";
import {
  getChapterStatsService,
  getClientIP,
  incrementViewService,
} from "@/lib/chapterViewService";

export async function incrementChapterView(
  chapterId: number,
  bookId: number,
  userId?: string,
  request?: Request
) {
  try {
    const ipAddress = request ? getClientIP(request) : "unknown";

    const result = await incrementViewService(
      chapterId,
      bookId,
      userId,
      ipAddress
    );

    if (result.success) {
      return {
        success: true,
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

export async function getChapterStats(chapterId: number) {
  try {
    const stats = await getChapterStatsService(chapterId);

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
export async function fetchChapterActions(chapterId: number) {
  try {
    return await fetchChapter(chapterId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function updateReaderSettings(settings: Partial<ReaderSettings>) {
  const cookieStore = await cookies();
  const currentSettingsString = cookieStore.get("reader-settings")?.value;
  const currentSettings = currentSettingsString
    ? JSON.parse(currentSettingsString)
    : defaultSettings;
  const newSettings = { ...currentSettings, ...settings };

  cookieStore.set("reader-settings", JSON.stringify(newSettings), {
    httpOnly: false, // thông tin cùi chắc là ko cần bảo mật
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", //strict >lax:samesite request top-level navigation , X dif domain>none
    path: "/",
  });
  revalidatePath("/");
}
export async function checkPrevChapterAction(currentChapterNumber: number) {
  try {
    return await checkPrevChapter(currentChapterNumber);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function checkNextChapterAction(currentChapterNumber: number) {
  try {
    return await checkNextChapter(currentChapterNumber);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}
