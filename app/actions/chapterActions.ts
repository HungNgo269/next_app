"use server";

import { fetchChapterDataCard, fetchChapterOfBook } from "../data/chapterData";

export async function fetchChapterCardAction(chapterId: string) {
  try {
    return await fetchChapterDataCard(chapterId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch chapter");
  }
}
export async function fetchChapterOfBookAction(bookId: string) {
  try {
    return await fetchChapterOfBook(bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch chapter");
  }
}
