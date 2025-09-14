// app/actions/books.ts
"use server";

import {
  fetchAllCategory,
  fetchBookByCategory,
  fetchCategory,
  fetchCategoryOfBook,
} from "@/app/data/categoryData";

export async function fetchCategoryAction(categoryId: number) {
  try {
    return await fetchCategory(categoryId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category ");
  }
}
export async function fetchAllCategoryAction() {
  try {
    return await fetchAllCategory();
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category ");
  }
}

export async function fetchBookByCategoryAction(categoryId: number) {
  try {
    return await fetchBookByCategory(categoryId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category ");
  }
}

export async function fetchCategoryOfBookAction(bookId: number) {
  try {
    return await fetchCategoryOfBook(bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category ");
  }
}
