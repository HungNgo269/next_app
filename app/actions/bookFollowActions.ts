"use server";
import {
  AddBookFollow,
  GetBookFollow,
  GetUsersFollowBook,
  RemoveBookFollow,
} from "@/app/data/bookFollow";

export async function GetBookFollowAction(userId: string, bookId: number) {
  try {
    return await GetBookFollow(userId, bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to get Book Follow Action");
  }
}
export async function RemoveBookFollowAction(userId: string, bookId: number) {
  try {
    return await RemoveBookFollow(userId, bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to remove Book Follow Action");
  }
}
export async function AddBookFollowAction(userId: string, bookId: number) {
  try {
    return await AddBookFollow(userId, bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to add Book Follow Action");
  }
}
export async function SendNotiBookFollowAction(userId: string, bookId: number) {
  try {
    return await AddBookFollow(userId, bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to add Book Follow Action");
  }
}
export async function GetUsersFollowBookAction(bookId: number) {
  try {
    return await GetUsersFollowBook(bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to get user Follow book Action");
  }
}
