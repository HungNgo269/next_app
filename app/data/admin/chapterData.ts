import { ChapterUploadProps } from "@/app/interface/chapter";
import { sql } from "@/lib/db";

const ITEMS_PER_PAGE = 10;

export async function fetchChaptersByPage(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql`
      SELECT id, title, chapter_number, book_id, content, created_at, updated_at
      FROM chapters
      WHERE
        id::text ILIKE ${`%${query}%`} OR
        title ILIKE ${`%${query}%`} OR
        chapter_number::text ILIKE ${`%${query}%`} OR
        book_id::text ILIKE ${`%${query}%`}
      ORDER BY created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch chapters.");
  }
}

export async function fetchChapterPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM chapters
      WHERE
        id::text ILIKE ${`%${query}%`} OR
        title ILIKE ${`%${query}%`} OR
        chapter_number::text ILIKE ${`%${query}%`} OR
        book_id::text ILIKE ${`%${query}%`}
    `;
    console.log(data[0].count);
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch chapter pages.");
  }
}
export async function fetchChapterPagesOfBook(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM chapters
      WHERE
        id::text ILIKE ${`%${query}%`} OR
        title ILIKE ${`%${query}%`} OR
        chapter_number::text ILIKE ${`%${query}%`} OR
        book_id::text ILIKE ${`%${query}%`}
    `;
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch chapter pages.");
  }
}
export async function uploadChapterContent({
  book_id,
  title,
  chapter_number,
  content,
}: ChapterUploadProps) {
  try {
    const data = await sql`
      INSERT INTO chapters (book_id, title, chapter_number, content)
      VALUES (${book_id}, ${title}, ${chapter_number}, ${content})
      RETURNING *
    `;
    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create chapter.");
  }
}

export async function deleteChapter(chapterId: string) {
  try {
    await sql`DELETE FROM chapters WHERE id = ${chapterId}`;
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to delete chapter" };
  }
}
export async function fetchChaptersByPageOfBook(
  query: string,
  currentPage: number,
  bookId: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql`
      SELECT c.id, c.title, c.chapter_number, c.book_id, c.content, c.created_at, c.updated_at
      FROM chapters c join books b on c.book_id = b.id where b.id =${bookId}
      ANd(

       c.id::text ILIKE ${`%${query}%`} OR
        c.title ILIKE ${`%${query}%`} OR
        c.chapter_number::text ILIKE ${`%${query}%`} 
      )
      ORDER BY created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch chapters.");
  }
}
