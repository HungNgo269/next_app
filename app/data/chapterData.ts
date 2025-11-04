import {
  BookNewChapterCard,
  ChapterBase,
  ChapterCardProps,
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
    return res as ChapterCardProps[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}

export async function fetchReadedChapter(bookId: number, userId: string) {
  try {
    let res = await sql`
    SELECT c.id, c.title,c.chapter_number,c.view_count,c.created_at,c.updated_at, 
   CASE
  WHEN c.id = cr.chapter_id AND cr.user_id = ${userId} THEN true
  ELSE false
END AS is_viewed
    FROM chapters c left join chapter_readed cr   
     ON c.id = cr.chapter_id 
        AND cr.user_id = ${userId}
      WHERE c.book_id = ${bookId}  
       ORDER BY c.chapter_number ASC`;
    return res as ChapterCardProps[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch chapters.");
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
      WITH newest_chapter AS (
        SELECT 
          c.id,
          c.title,
          c.chapter_number,
          c.book_id,
          b.name as book_name,
          c.created_at,
          ROW_NUMBER() OVER (PARTITION BY c.book_id ORDER BY c.created_at DESC) as rowNumber
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
            'chapter_number', chapter_number,
            'created_at',created_at
          ) ORDER BY created_at DESC
        ) as chapters,
        MAX(created_at) as latest_update
      FROM newest_chapter
      WHERE rowNumber <= 3
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
export async function fetchNewestChapterForLoggedUser(
  currentPage: number,
  userId: string
) {
  const offset = (currentPage - 1) * 12;
  try {
    let res = await sql`
      WITH newest_chapter AS (
        SELECT 
          c.id,
          c.title,
          c.chapter_number,
          c.book_id,
          b.name as book_name,
          c.created_at,
          CASE
        WHEN c.id = cr.chapter_id AND cr.user_id = ${userId} THEN true
        ELSE false
        END AS is_viewed,
          ROW_NUMBER() OVER (PARTITION BY c.book_id ORDER BY c.created_at DESC) as rowNumber
        FROM chapters c 
            JOIN books b ON c.book_id = b.id

    LEFT JOIN chapter_readed cr
      ON cr.chapter_id = c.id
      AND cr.user_id = ${userId}      )
      SELECT 
        book_id,
        book_name,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', id,
            'title', title,
            'chapter_number', chapter_number,
                    'is_viewed', is_viewed,
            'created_at',created_at
          ) ORDER BY created_at DESC
        ) as chapters,
        MAX(created_at) as latest_update
      FROM newest_chapter
      WHERE rowNumber <= 3
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
export async function addReadedChapter(
  userId: string,
  bookId: number,
  chapter_id: number
) {
  try {
    await sql`
    insert into chapter_readed (user_id,chapter_id,book_id)
    values(${userId},${chapter_id},${bookId}) `;
  } catch (error) {
    console.error("Database Error:", error);
  }
}
