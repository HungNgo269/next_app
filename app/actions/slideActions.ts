"use server";
import {
  deleteSlide,
  fetchSlideById,
  fetchSlidesByPage,
} from "@/app/data/admin/slideData";
import { revalidatePath } from "next/cache";
import { fetchAllSlide } from "@/app/data/slideData";

export async function fetchSlidesByPageActions(
  query: string,
  currentPage: number
) {
  try {
    return await fetchSlidesByPage(query, currentPage);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function fetchSlideByIdActions(query: string) {
  try {
    return await fetchSlideById(query);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function DeleteSlideActions(slideId: string, currentPath: string) {
  try {
    const result = await deleteSlide(slideId);
    if (result.success === true) {
      revalidatePath(currentPath);
      return { success: true };
    }
    return result;
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}
export async function fetchAllSlideAction() {
  try {
    const result = await fetchAllSlide();
    return result;
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to  fetchAllSlideAction ");
  }
}
