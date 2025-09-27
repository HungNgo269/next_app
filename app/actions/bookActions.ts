"use server";

import {
  fetchAllBookSort,
  fetchBookByCategorySort,
  fetchBookById,
  fetchBookImage,
  fetchBookNameByIdChapter,
  fetchBookPages,
  fetchBooksByPage,
  fetchBooksByQuery,
  fetchNewBook,
  fetchOurRecommendedBook,
  fetchPopularBook,
  fetchTotalBookPage,
  fetchTotalBookPageByCategory,
  fetchTotalChapterInBookById,
} from "@/app/data/bookData";
import { fetchMostViewedBookByCategory } from "@/app/data/categoryData";

export async function fetchBookByIdActions(id: number) {
  try {
    return await fetchBookById(id);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function fetchNewBookAction() {
  try {
    return await fetchNewBook();
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch new books");
  }
}

export async function fetchMostViewedBookByCategoryActions(categoryId: number) {
  try {
    return await fetchMostViewedBookByCategory(categoryId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function fetchBookImageAction(bookId: number) {
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

export async function fetchBookPagesActions(query: string) {
  try {
    return await fetchBookPages(query);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch book pages");
  }
}

export async function fetchBooksByQueryActions(query: string) {
  try {
    return await fetchBooksByQuery(query);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function fetchAllBookAction(
  currentPage: number,
  sort: string,
  order: string
) {
  try {
    return await fetchAllBookSort(sort, currentPage, order);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function fetchOurRecommendedBookAction(bookId: number) {
  try {
    return await fetchOurRecommendedBook(bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function fetchBookByCategorySortAction(
  categoryId: number,
  sort: string,
  currentPage: number,
  order: string
) {
  try {
    return await fetchBookByCategorySort(categoryId, sort, currentPage, order);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function fetchTotalBookPageByCategoryAction(categoryId: number) {
  try {
    return await fetchTotalBookPageByCategory(categoryId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function fetchPopularBookAction(timeframe: string) {
  try {
    return await fetchPopularBook(timeframe);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetchPopularBookAction");
  }
}

export async function fetchTotalBookPageAction() {
  try {
    return await fetchTotalBookPage();
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetchTotalBookPage");
  }
}

export async function fetchTotalChapterInBookByIdAction(id: number) {
  try {
    return await fetchTotalChapterInBookById(id);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetchTotalBookPage");
  }
}
export async function fetchBookNameByIdChapterAction(id: number) {
  try {
    return await fetchBookNameByIdChapter(id);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetchTotalBookPage");
  }
}
