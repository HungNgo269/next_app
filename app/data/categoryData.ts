import { sql } from "@/lib/db";

export async function fetchBookByCategory(categoryId: number) {
  try {
    let res = await sql`
      SELECT b.id, b.name, b.image_urls, b.author, b.status 
      FROM books b 
      JOIN books_categories bc ON b.id = bc.book_id 
      JOIN categories c ON bc.category_id = c.id  
      WHERE c.id = ${categoryId}
    `;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch books by category.");
  }
}
export async function fetchMostViewedBookByCategory(id: string) {
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
      WHERE c.id = ${id}
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

export async function fetchCategory(id: string) {
  try {
    let res = await sql`Select * from categories where categories.id=${id}`;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Category.");
  }
}
export async function fetchCategoryOfBook(id: string) {
  try {
    let res = await sql`
      SELECT c.id as category_id, c.name, c.url 
      FROM categories c 
      JOIN books_categories bc ON c.id = bc.category_id 
      WHERE bc.book_id = ${id}
    `;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Category.");
  }
}
