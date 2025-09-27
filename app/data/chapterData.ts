import { ChapterInfo } from "@/app/interface/chapter";
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
    SELECT c.id, c.title,c.chapter_number,c.view_count,c.created_at,c.updated_at
    FROM chapters  c
    WHERE book_id = ${bookId}`;
    return res as ChapterInfo[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}
export async function fetchNewestChapter(currentPage: number) {
  const offset = (currentPage - 1) * 8;
  try {
    let res = await sql`SELECT c.id, c.title,c.chapter_number ,b.name
    FROM chapters c join books b on c.book_id = b.id
    order by c.created_at desc
    limit 8 offset ${offset}
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
export async function fetchChapterByBookmark(userId: string) {
  try {
    let res = await sql`
    SELECT c.id,c.book_id,c.title,b.image_urls,b.description,b.rating,b.author
    FROM book_mark bm join chapters c on bm.chapterid=c.id 
    join books b on c.book_id = b.id  where bm.userid=${userId};
    `;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to  fetch Chapter By Bookmark.");
  }
}
export async function updateChapter(data: {
  id: number;
  content: string;
  title: string;
  chapterNumber: number;
  bookId: number;
}) {
  try {
    const result = await sql`
      UPDATE chapters 
      SET
        book_id = ${data.bookId},
        title = ${data.title},
        chapter_number = ${data.chapterNumber},
        content = ${data.content},
        updated_at = NOW()
      WHERE id = ${data.id}
      RETURNING *;
    `;

    return result[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update chapter");
  }
}
export async function createChapter(
  chapterContent: string,
  chapterTitle: string,
  chapterNumber: number,
  bookId: number
) {
  try {
    let res = await sql`
    insert into chapters (book_id,title,content,chapter_number) values 
    (${bookId},${chapterTitle},${chapterContent},${chapterNumber})
    returning *
    `;
    return res[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to  create Chapter.");
  }
}
export async function deleteChapter(chapterId: number) {
  try {
    let res = await sql`
    delete from chapters where id = ${chapterId}
     RETURNING *;
    `;
    return res[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to  delete Chapter.");
  }
}
