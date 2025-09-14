import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { Book } from "@/app/interface/book";
import { getStartDate, TimeFrame } from "@/app/data/rankingData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get("timeframe") as TimeFrame) || "Today";
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const cacheKey = `popular-books-${timeframe}-${limit}`;
    const startDate = getStartDate(timeframe);
    console.log("startDate", startDate);
    const books = await unstable_cache(
      async () => {
        const result = await sql`SELECT b.id, b.image_urls, b.name, b.author,
       (b.views + COUNT(cv.id)) as total_views
          FROM books b
LEFT JOIN chapters c ON b.id = c.book_id
LEFT JOIN chapter_views cv ON c.id = cv.chapter_id 
  AND cv.viewed_at >= $1 
GROUP BY b.id, b.image_urls, b.name, b.author, b.views
ORDER BY total_views DESC
LIMIT $2;
        `;
        return result as Book[];
      },
      [cacheKey],
      { revalidate: 3600, tags: ["books", "popular"] }
    )();

    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error("Error fetching popular books:", error);
    return NextResponse.json(
      { error: "Error while fetching popular books" },
      { status: 500 }
    );
  }
}
