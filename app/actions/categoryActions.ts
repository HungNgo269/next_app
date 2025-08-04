// app/actions/books.ts
"use server";

import { fetchCategory } from "@/app/data";
import { revalidatePath } from "next/cache";

export async function fetchCategoryAction(categoryId: string) {
  try {
    return await fetchCategory(categoryId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category ");
  }
}

export async function createBookAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const categoryId = formData.get("categoryId") as string;

    // Call your create function here
    // await createBook({ title, categoryId });

    revalidatePath("/books"); // Revalidate cache
    return { success: true };
  } catch (error) {
    throw new Error("Failed to create book");
  }
}

export async function deleteBookAction(bookId: string) {
  try {
    // await deleteBook(bookId);
    revalidatePath("/books");
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete book");
  }
}
