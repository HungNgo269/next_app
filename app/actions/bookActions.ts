"use server";

import {
  fetchBookById,
  fetchBookImage,
  fetchBooksByPage,
} from "../data/bookData";
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

export async function fetchBookImageAction(bookId: string) {
  try {
    return await fetchBookImage(bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}
export async function fetchBooksByPageActions(
  query: string,
  currentPage: number
) {
  try {
    return await fetchBooksByPage(query, currentPage);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}
