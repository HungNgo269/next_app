import { ViewMetadata } from "@/app/interface/view";
import { sql } from "../../lib/db";

interface ViewProps {
  id: string;
  chapter_id: string;
  book_id: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  viewed_at?: string | Date;
}

export async function addView({
  id,
  chapter_id,
  book_id,
  user_id,
  ip_address,
  user_agent,
  viewed_at,
}: ViewProps) {
  try {
    const res = await sql`
      INSERT INTO chapter_views
        (id, chapter_id, book_id, user_id, ip_address, user_agent, viewed_at)
      VALUES
        (
          ${id},
          ${chapter_id},
          ${book_id},
          ${user_id},
          ${ip_address}::inet,
          ${user_agent},
          ${viewed_at ?? sql`NOW()`}
        )
    `;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to insert chapter view.");
  }
}
export async function updateChapterViewsInDB({
  id,
  chapter_id,
  book_id,
  user_id,
  ip_address,
  user_agent,
  viewed_at,
}: ViewProps) {
  try {
    const res = await sql`
      INSERT INTO chapter_views
        (id, chapter_id, book_id, user_id, ip_address, user_agent, viewed_at)
      VALUES
        (
          ${id},
          ${chapter_id},
          ${book_id},
          ${user_id},
          ${ip_address}::inet,
          ${user_agent},
          ${viewed_at ?? sql`NOW()`}
        )
    `;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to insert chapter view.");
  }
}
export async function syncChapterViews(
  chapterId: number,
  views: ViewMetadata[]
): Promise<void> {
  for (const view of views) {
    try {
      await sql`
        INSERT INTO chapter_views (
          chapter_id, 
          book_id, 
          user_id, 
          ip_address, 
          user_agent,
          viewed_at
        )
        VALUES (
          ${chapterId},
          ${view.bookId},
          ${view.userId || null},
          ${view.ipAddress || null},
          ${view.userAgent || null},
          ${new Date(view.timestamp)}::timestamp
        )
        ON CONFLICT DO NOTHING;
      `;
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`Database Error for chapter ${chapterId}:`, err.message);
    }
  }
}
export async function updateBooksAggregatedStats(): Promise<void> {
  try {
    await sql`
  UPDATE books
  SET 
    views = (
      SELECT COALESCE(SUM(c.view_count), 0)
      FROM chapters c
      WHERE c.book_id = books.id
    ),
    updated_at = CURRENT_TIMESTAMP
  RETURNING *;
`;
  } catch (error) {
    console.error(
      `Failed to update view count for books: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
