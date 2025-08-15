import { sql } from "@/app/lib/db";
export async function FetchMostFollowBookByWeek() {
  try {
    let res = await sql`Select id, image_urls, name, author
       from books
     order by views desc limit 5`;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}
export async function FetchMostFollowBookByMonth() {
  try {
    let res = await sql`Select id, image_urls, name, author
       from books
     order by views desc limit 5`;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}
export async function FetchMostFollowBookAllTime() {
  try {
    let res = await sql`Select id, image_urls, name, author
       from books
     order by views desc limit 5`;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}
