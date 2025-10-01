import { IBookFollow, BookFollowRow } from "@/app/interface/bookFollow";
import { sql } from "@/lib/db";

export async function GetBookFollow(userId: string, bookId: number) {
  try {
    const res = await sql`Select * from book_follow 
        where userId = ${userId} and bookId = ${bookId} `;
    return res[0] as IBookFollow;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add Book Follow.");
  }
}

export async function GetUsersFollowBook(bookId: number): Promise<string[]> {
  try {
    const res = await sql`Select userId from book_follow 
        where bookId = ${bookId}`;

    return (res as BookFollowRow[]).map((row) => row.userid);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to get users following book.");
  }
}

export async function AddBookFollow(userId: string, bookId: number) {
  try {
    const res =
      await sql`insert into  book_follow  (userId,bookId) VALUES (${userId},${bookId}) returning *`;
    return res[0] as IBookFollow;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add Book Follow.");
  }
}

export async function RemoveBookFollow(userId: string, bookId: number) {
  try {
    const res = await sql`delete
        from book_follow 
        where userId = ${userId} and bookId = ${bookId} returning *`;
    return res[0] as IBookFollow;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to remove Book Foolow.");
  }
}
