import { sql } from "@/app/lib/db";
// phân trang...
export async function fetchBookByCategory() {
  try {
    let res =
      await sql`Select * from book b join book_categories bc on b.id = bc.book_id 
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

export async function fetchCategories() {
  try {
    let res = await sql`Select * from categories order by id asc limit 10`;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Categories.");
  }
}

export async function fetchCategory(query: string) {
  try {
    let res = await sql`Select * from categories where categories.id=${query}`;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Category.");
  }
}
