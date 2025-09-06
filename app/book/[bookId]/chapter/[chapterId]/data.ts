import { sql } from "@/lib/db";

export async function fetchChapter(ChapterId: number) {
  try {
    const data = await sql` SELECT *
    FROM chapters
    WHERE id = ${ChapterId}`;
    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slides.");
  }
}
export async function checkPrevChapter(currentChapterNumber: number) {
  try {
    const data = await sql` SELECT id
    FROM chapters 
    WHERE chapter_number = ${currentChapterNumber - 1}`;
    return data.length > 0 ? data[0].id : null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slides.");
  }
}
export async function checkNextChapter(currentChapterNumber: number) {
  try {
    const data = await sql` SELECT id
    FROM chapters
    WHERE chapter_number = ${currentChapterNumber + 1}`;
    return data.length > 0 ? data[0].id : null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slides.");
  }
}
