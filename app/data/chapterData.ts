import { sql } from "../../lib/db";

export async function fetchChapterDataCard(id: number) {
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
export async function fetchChapterOfBook(bookId: number) {
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
export async function fetchNewestChapter() {
  try {
    let res = await sql`
    SELECT c.id, c.title,c.chapter_number ,b.name
    FROM chapters c join books b on c.book_id = b.id
    order by c.created_at desc
    limit 8 offset 8
    `;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}
export async function fetchTotalChapterPage() {
  try {
    let res = await sql`
    SELECT COUNT(*)
    FROM chapters 
    `;
    const totalPages = Math.ceil(Number(res[0].count) / 8);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}
