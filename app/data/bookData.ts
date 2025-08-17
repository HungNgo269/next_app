import { sql } from "@/app/lib/db";

export async function fetchBookById(id: string) {
  try {
    let res = await sql`Select * from books  where id=${id}`;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch book by id.");
  }
}

export async function fetchBookByCategory() {
  try {
    let res =
      await sql`Select * from books b join book_categories bc on b.id = bc.book_id 
    join categories c on bc.category_id= c.id order by views limit 10`;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}

export async function fetchMostViewedBookByCategory(query: string) {
  try {
    const res = await sql`
      SELECT 
        b.id,
        b.name,
        b.author,
        b.image_urls
      FROM books b
      JOIN books_categories bc ON b.id = bc.book_id
      JOIN categories c ON bc.category_id = c.id
      WHERE c.id = ${query}
      ORDER BY b.views DESC
      LIMIT 10
    `;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}
export async function fetchBookImage(bookId: string) {
  try {
    const res = await sql`
    SELECT id,image_urls,description,name
    FROM Books
    WHERE id = ${bookId}
  `;
    return res[0];
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch book image for chapter");
  }
}
export async function addViewBook(id: string) {
  try {
    let res = await sql`
UPDATE books
SET views = views + 1
WHERE id = ${id}`;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}
export async function fetchBookRecommended() {
  try {
    const res = await sql`
    SELECT book_id,badge_id,description,name
    FROM Books where 
  `;
    return res;
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch book image for chapter");
  }
}
