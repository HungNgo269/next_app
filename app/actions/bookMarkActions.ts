"use server";
import {
  addBookMark,
  getAllBookMark,
  getBookMark,
  removeBookMark,
  updateBookMark,
} from "@/app/data/bookMarkData";

export async function addBookMarkAction(
  userId: string,
  chapterId: number,
  progress: number
) {
  try {
    return await addBookMark(userId, chapterId, progress);
  } catch (error) {
    console.error("Server Action Error:", error);
  }
}
export async function removeBookMarkAction(userId: string, chapterId: number) {
  try {
    return await removeBookMark(userId, chapterId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to remove Book Mark Action");
  }
}
export async function getBookMarkAction(userId: string, chapterId: number) {
  try {
    return await getBookMark(userId, chapterId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to get Book Mark");
  }
}

export async function getAllBookMarkAction(userId: string) {
  try {
    return await getAllBookMark(userId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to get Book Mark");
  }
}
export async function updateBookMarkAction(
  userId: string,
  chapterId: number,
  progress: number
) {
  try {
    return await updateBookMark(userId, chapterId, progress);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to update Book Mark");
  }
}
