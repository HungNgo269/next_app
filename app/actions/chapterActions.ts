"use server";

import {
  fetchChapterDataCard,
  fetchChapterOfBook,
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
