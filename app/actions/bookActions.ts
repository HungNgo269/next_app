"use server";

import { fetchBookById, fetchBookImageForChapter } from "../data/bookData";
import { fetchMostViewedBookByCategory } from "../data/categoryData";

export async function fetchBookByIdActions(id: string) {
  try {
    return await fetchBookById(id);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function fetchMostViewedBookByCategoryActions(categoryId: string) {
  try {
    return await fetchMostViewedBookByCategory(categoryId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function fetchBookImageForChapterAction(bookId: string) {
  try {
    return await fetchBookImageForChapter(bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}
