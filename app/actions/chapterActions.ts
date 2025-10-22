"use server";

import {
  fetchChapterByBookmark,
  fetchChapterDataCard,
  fetchChapterOfBook,
  fetchMultipleChapterDataCard,
  fetchNewestChapter,
  fetchTotalChapterPage,
} from "@/app/data/chapterData";

export async function fetchChapterCardAction(chapterId: number) {
  try {
    return await fetchChapterDataCard(chapterId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch chapter");
  }
}
export async function fetchMultipleChapterCardAction(chapterIds: number[]) {
  try {
    return await fetchMultipleChapterDataCard(chapterIds);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch chapter");
  }
}
export async function fetchChapterOfBookAction(bookId: number) {
  try {
    return await fetchChapterOfBook(bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch chapter");
  }
}
export async function fetchNewestChapterAction(currentPage: number) {
  try {
    return await fetchNewestChapter(currentPage);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch chapter");
  }
}
export async function fetchTotalChapterPageAction() {
  try {
    return await fetchTotalChapterPage();
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch chapter");
  }
}
export async function fetchChapterByBookmarkAction(userId: string) {
  try {
    return await fetchChapterByBookmark(userId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch chapter");
  }
}
