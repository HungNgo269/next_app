// app/actions/books.ts
"use server";

import { fetchCategory, fetchCategoryOfBook } from "@/app/data/categoryData";

export async function fetchCategoryAction(categoryId: string) {
  try {
    return await fetchCategory(categoryId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category ");
  }
}

export async function fetchCategoryOfBookAction(bookId: string) {
  try {
    return await fetchCategoryOfBook(bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category ");
  }
}
