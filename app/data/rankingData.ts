import { sql } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { Book } from "../interface/book";
export type TimeFrame = "Today" | "Week" | "Month";
export function getStartDate(timeframe: TimeFrame): Date {
  const now = new Date();

  switch (timeframe) {
    case "Today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());

    case "Week":
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60);
      return weekAgo;

    case "Month":
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return monthStart;

    default:
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
}
export const fetchPopularBooks = async (
  timeframe: TimeFrame = "Today",
  limit: number = 5
): Promise<Book[]> => {
  const cacheKey = `popular-books-${timeframe}-${limit}`;

  return await unstable_cache(
    async () => {
      const timeCondition = getStartDate(timeframe);
      const result = await sql`
        SELECT id, image_urls, name, author
        FROM books  
        WHERE ${timeCondition}
        ORDER BY views DESC
        LIMIT ${limit}
      `;
      return result as Book[];
    },
    [cacheKey],
    { revalidate: 86400, tags: ["books", "popular"] }
  )();
};
