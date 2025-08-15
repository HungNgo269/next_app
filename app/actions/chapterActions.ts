"use server";

import { fetchChapterDataCard } from "../data/chapterData";

export async function fetchChapterCardAction(chapterId: string) {
  try {
    return await fetchChapterDataCard(chapterId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch chapter");
  }
}
