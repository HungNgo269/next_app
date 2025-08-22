import { sql } from "@/lib/db";

export default async function fetchChapter(ChapterId: string) {
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
