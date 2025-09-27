import { IBookmark } from "@/app/interface/bookMark";
import { sql } from "@/lib/db";

export async function addBookMark(
  userId: string,
  chapterId: number,
  progress: number
) {
  try {
    const res = await sql`
      INSERT INTO book_mark (userid, chapterid,progress)
      VALUES (${userId}, ${chapterId}, ${progress})
      RETURNING *;
    `;
    return res[0] as IBookmark;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add Book Mark.");
  }
}

export async function removeBookMark(userId: string, chapterId: number) {
  try {
    const res = await sql`
      DELETE FROM book_mark
      WHERE userid = ${userId} AND chapterid = ${chapterId}
      RETURNING *;
    `;
    return res[0] as IBookmark;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to remove Book Mark.");
  }
}
export async function getBookMark(userId: string, chapterId: number) {
  try {
    const res = await sql`
      select * from book_mark where chapterid=${chapterId} and userid=${userId}
    `;
    return res[0] as IBookmark;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to get Book Mark.");
  }
}
export async function getAllBookMark(userId: string) {
  try {
    const res = await sql`
      select * from book_mark where userid=${userId}
    `;
    return res as IBookmark[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to get Book Mark.");
  }
}
export async function updateBookMark(
  userId: string,
  chapterId: number,
  progress: number
) {
  try {
    const res = await sql`
      update  book_mark
      set progress=${progress}
      where userid = ${userId} AND chapterid = ${chapterId}
      RETURNING *;
    `;
    return res[0] as IBookmark;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update Book Mark.");
  }
}
