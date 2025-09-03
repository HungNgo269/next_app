import { ChapterUploadProps } from "@/app/interface/chapter";
import { sql } from "@/lib/db";

export async function uploadChapterContent({
  book_id,
  title,
  chapter_number,
  content,
}: ChapterUploadProps) {
  try {
    const data = await sql`
      Insert into Chapter (book_id,title,chapter_number,content) 
  VALUES (${book_id}, ${title}, ${chapter_number}, ${content})
      `;
    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slides.");
  }
}
