"use server";

import {
  addReadedChapter,
  fetchChapterByBookmark,
  fetchChapterDataCard,
  fetchChapterOfBook,
  fetchNewestChapterForLoggedUser,
  fetchNewestChapter,
  fetchReadedChapter,
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
export async function fetchNewestChapterForLoggedUserAction(
  currentPage: number,
  userId: string
) {
  try {
    return await fetchNewestChapterForLoggedUser(currentPage, userId);
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
export async function fetchReadedChapterAction(bookId: number, userId: string) {
  try {
    return await fetchReadedChapter(bookId, userId);
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
export async function addReadedChapterAction(
  userId: string,
  bookId: number,
  chapter_id: number
) {
  try {
    return await addReadedChapter(userId, bookId, chapter_id);
  } catch (error) {
    console.error("Server Action Error:", error);
  }
}
