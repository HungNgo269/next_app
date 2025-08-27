import { sql } from "@/lib/db";
import { unstable_cache } from "next/cache";
export const FetchMostFollowBookByWeek = unstable_cache(
  async () => {
    try {
      let res = await sql`Select id, image_urls, name, author
         from books
       order by views desc limit 5`;
      return res;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch Categories.");
    }
  },
  ["most-popular-books-all-time"],
  {
    revalidate: 3600,
    tags: ["books", "ranking"],
  }
);

export const FetchMostFollowBookByMonth = unstable_cache(
  async () => {
    try {
      let res = await sql`Select id, image_urls, name, author
         from books
       order by views desc limit 5`;
      return res;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch Categories.");
    }
  },
  ["most-popular-books-all-time"],
  {
    revalidate: 3600,
    tags: ["books", "ranking"],
  }
);

export const FetchMostFollowBookAllTime = unstable_cache(
  async () => {
    try {
      let res = await sql`Select id, image_urls, name, author
         from books
       order by views desc limit 5`;
      return res;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch Categories.");
    }
  },
  ["most-popular-books-all-time"],
  {
    revalidate: 3600,
    tags: ["books", "ranking"],
  }
);
