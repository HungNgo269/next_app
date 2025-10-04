"use server";
import {
  AddBookFollow,
  GetBookFollow,
  GetUsersFollowBook,
  RemoveBookFollow,
  GetFollowedBooks,
  GetBookFollowerCount,
} from "@/app/data/bookFollow";

export async function GetBookFollowAction(userId: string, bookId: number) {
  try {
    return await GetBookFollow(userId, bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
  }
}

export async function RemoveBookFollowAction(userId: string, bookId: number) {
  try {
    return await RemoveBookFollow(userId, bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
  }
}

export async function AddBookFollowAction(userId: string, bookId: number) {
  try {
    return await AddBookFollow(userId, bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
  }
}

export async function SendNotiBookFollowAction(userId: string, bookId: number) {
  try {
    return await AddBookFollow(userId, bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
  }
}

export async function GetUsersFollowBookAction(bookId: number) {
  try {
    return await GetUsersFollowBook(bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
  }
}

export async function GetFollowedBooksAction(userId: string) {
  try {
    return await GetFollowedBooks(userId);
  } catch (error) {
    console.error("Server Action Error:", error);
  }
}
export async function GetBookFollowerCountAction(bookId: number) {
  try {
    return await GetBookFollowerCount(bookId);
  } catch (error) {
    console.error("Server Action Error:", error);
  }
}
