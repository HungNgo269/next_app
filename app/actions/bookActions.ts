"use server";

import { fetchMostViewedBookByCategory } from "../data";

export async function fetchMostViewedBookByCategoryActions(categoryId: string) {
  try {
    return await fetchMostViewedBookByCategory(categoryId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}
