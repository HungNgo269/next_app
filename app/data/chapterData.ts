import {
  BookNewChapterCard,
  ChapterBase,
  ChapterCardProps,
  ChapterInfo,
} from "@/app/interface/chapter";
import { sql } from "../../lib/db";

export async function fetchChapterDataCard(id: number) {
  try {
    let res = await sql`
    SELECT id,book_id, title, chapter_number,created_at
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
    WHERE book_id = ${bookId} order by c.chapter_number desc`;
    return res as ChapterInfo[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}

export async function fetchNewestChapter(currentPage: number) {
  const offset = (currentPage - 1) * 12;
  try {
   //PARTITION BY c.book_id  = chia kết quả theo bookId.
   //RoW_NUmber = đánh số thứ tự => 1 2 3 giảm dần theo order
   //qualify= > lọc rownumber (fill)
   //group by => gom theo id. name.
   //=json_agg => gộp theo mảng json {id,title,chapternumber}
   //=> gửi {id,name,chapters={id,title,chapternumber}}
    let res = await sql`
      WITH ranked_chapters AS (
        SELECT 
          c.id,
          c.title,
          c.chapter_number,
          c.book_id,
          b.name as book_name,
          c.created_at,
          ROW_NUMBER() OVER (PARTITION BY c.book_id ORDER BY c.created_at DESC) as rn
        FROM chapters c 
        JOIN books b ON c.book_id = b.id
      )
      SELECT 
        book_id,
        book_name,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', id,
            'title', title,
            'chapter_number', chapter_number
          ) ORDER BY created_at DESC
        ) as chapters,
        MAX(created_at) as latest_update
      FROM ranked_chapters
      WHERE rn <= 3
      GROUP BY book_id, book_name
      ORDER BY latest_update DESC
      LIMIT 12 OFFSET ${offset}
    `;
    return res as BookNewChapterCard[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch newest chapters.");
  }
}
export async function fetchMultipleChapterDataCard(ids: number[]) {
  try {
    let res = await sql`
    SELECT id, book_id, title, chapter_number, created_at
    FROM chapters 
    WHERE id = ANY(${ids})
    ORDER BY created_at DESC`;
    return res as ChapterCardProps[]
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch chapters data.");
  }
}
export async function fetchTotalChapterPage() {
  try {
    let res = await sql`
    SELECT COUNT(*)
    FROM books  
    `;
    const totalPages = Math.ceil(Number(res[0].count) / 12);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}
export async function fetchChapterByBookmark(userId: string) {
  try {
    let res = await sql`
    SELECT
      c.id,
      c.book_id,  
      c.title,
      c.chapter_number,
      bm.progress,
      b.name,
      b.image_urls,
      b.description,
      b.rating,
      b.author
    FROM book_mark bm
    JOIN chapters c ON bm.chapterid = c.id
    JOIN books b ON c.book_id = b.id
    WHERE bm.userid = ${userId};
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
export async function createChapter(data: {
  content: string;
  title: string;
  chapterNumber: number;
  bookId: number;
}) {
  try {
    let res = await sql`
    insert into chapters (book_id,title,content,chapter_number) values 
    (${data.bookId},${data.title},${data.content},${data.chapterNumber})
    returning *
    `;
    return res[0] as ChapterBase;
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
