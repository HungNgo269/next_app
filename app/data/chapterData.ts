import { sql } from "../../lib/db";

export async function fetchChapterDataCard(id: string) {
  try {
    let res = await sql`
    SELECT id,book_id, title, chapter_number
    FROM chapters
    WHERE id = ${id}`;
    return res[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}
export async function fetchChapterOfBook(bookId: string) {
  try {
    let res = await sql`
    SELECT *
    FROM chapters 
    WHERE book_id = ${bookId}`;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}
