"use server";

import {
  fetchChaptersByPage,
  fetchChapterPages,
} from "@/app/data/admin/chapterData";

export async function fetchChaptersByPageAction(
  query: string,
  currentPage: number
) {
  try {
    return await fetchChaptersByPage(query, currentPage);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch chapters");
  }
}

export async function fetchChapterPagesAction(query: string) {
  try {
    return await fetchChapterPages(query);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch chapter pages");
  }
}
