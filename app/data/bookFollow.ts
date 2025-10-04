import { IBookFollow, BookFollowRow } from "@/app/interface/bookFollow";
import { sql } from "@/lib/db";

export async function GetBookFollow(userId: string, bookId: number) {
  try {
    const res = await sql`Select * from book_follow 
        where userId = ${userId} and bookId = ${bookId} `;
    return res[0] as IBookFollow;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add Book Follow.");
  }
}

export async function GetUsersFollowBook(bookId: number): Promise<string[]> {
  try {
    const res = await sql`Select userId from book_follow 
        where bookId = ${bookId}`;

    return (res as BookFollowRow[]).map((row) => row.userid);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to get users following book.");
  }
}

export async function AddBookFollow(userId: string, bookId: number) {
  try {
    const res =
      await sql`insert into  book_follow  (userId,bookId) VALUES (${userId},${bookId}) returning *`;
    return res[0] as IBookFollow;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add Book Follow.");
  }
}

export async function RemoveBookFollow(userId: string, bookId: number) {
  try {
    const res = await sql`delete
        from book_follow 
        where userId = ${userId} and bookId = ${bookId} returning *`;
    return res[0] as IBookFollow;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to remove Book Foolow.");
  }
}

export async function GetFollowedBooks(userId: string) {
  try {
    const res = await sql`
      SELECT
        b.id,
        b.name,
        b.author,
        b.description,
        b.image_urls,
        b.rating,
        b.views,
        b.status,
        b.popularity,
        MAX(c.id)             AS latest_chapter_id,
        MAX(c.chapter_number) AS latest_chapter_number,
        MAX(c.created_at)     AS latest_chapter_date
      FROM book_follow bf
      JOIN books b ON bf.bookid = b.id
      LEFT JOIN chapters c ON c.book_id = b.id
      WHERE bf.userid = ${userId}
      GROUP BY b.id, b.name, b.author, b.description, b.image_urls, b.rating, b.views, b.status, b.popularity
      ORDER BY MAX(c.created_at) DESC NULLS LAST, b.name ASC;
    `;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch followed books.");
  }
}

export async function GetBookFollowerCount(bookId: number) {
  try {
    const res = await sql`Select count(*) as followers from book_follow 
        where bookId = ${bookId}`;
    return Number(res[0].count) > 0;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to get users following book.");
  }
}
