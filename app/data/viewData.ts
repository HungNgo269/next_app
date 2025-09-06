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
