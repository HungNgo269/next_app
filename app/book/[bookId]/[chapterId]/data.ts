import { sql } from "@/app/lib/db";

export default async function fetchChapter(ChapterId: string) {
  try {
    const data = await sql` SELECT *
    FROM chapters
    WHERE id = ${ChapterId}`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slides.");
  }
}
