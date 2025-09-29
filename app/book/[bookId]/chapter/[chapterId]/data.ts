import { Chapter } from "@/app/interface/chapter";
import { sql } from "@/lib/db";

export async function fetchChapter(ChapterId: number) {
  try {
    const data =
      await sql` SELECT id,book_id,title,chapter_number,content,view_count,updated_at,created_at
    FROM chapters
    WHERE id = ${ChapterId}`;
    return data[0] as Chapter;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slides.");
  }
}
export async function checkPrevChapter(
  currentChapterNumber: number,
  bookId: number
) {
  try {
    const data = await sql` SELECT id
    FROM chapters 
    WHERE chapter_number = ${currentChapterNumber - 1} and book_id=${bookId}`;
    return data.length > 0 ? data[0].id : null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slides.");
  }
}
export async function checkNextChapter(
  currentChapterNumber: number,
  bookId: number
) {
  try {
    const data = await sql` SELECT id
    FROM chapters
    WHERE chapter_number = ${currentChapterNumber + 1} and book_id = ${bookId}`;
    return data.length > 0 ? data[0].id : null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slides.");
  }
}
