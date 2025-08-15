import { sql } from "../lib/db";

export async function fetchChapterDataCard(id: string) {
  try {
    let res = await sql`
    SELECT id,book_id, title, chapter_number
    FROM chapters
    WHERE id = ${id}`;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}
