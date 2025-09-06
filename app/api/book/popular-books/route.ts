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

    // console.log("check date", startDate);
    const books = await unstable_cache(
      async () => {
        // Use parameterized query for SQL injection prevention
        const result = await sql`
          SELECT id, image_urls, name, author, views
          FROM books
          ORDER BY views DESC
          LIMIT ${limit}
        `;
        return result as Book[];
      },
      [cacheKey],
      { revalidate: 86400, tags: ["books", "popular"] }
    )();

    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error("Error fetching popular books:", error);
    return NextResponse.json(
      { error: "Error while fetch popular boook" },
      { status: 500 }
    );
  }
}
