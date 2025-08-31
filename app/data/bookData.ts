import { sql } from "@/lib/db";

export async function fetchBookById(id: string) {
  try {
    let res = await sql`Select * from books  where id=${id}`;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch book by id.");
  }
}
export async function fetchNewBook() {
  try {
    let res = await sql`
  SELECT id,name,author,image_urls
  FROM Books 
  ORDER BY  created_at DESC
  LIMIT 10
`;
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch book by id.");
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
const ITEMS_PER_PAGE = 6;
export async function fetchBooksByPage(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql`
      SELECT id,name,status,image_urls,is_active,created_at,updated_at
      FROM books
      WHERE
    id::text ILIKE ${`%${query}%`} OR
    name ILIKE ${`%${query}%`} OR
    status::text ILIKE ${`%${query}%`} OR
    image_urls::text ILIKE ${`%${query}%`} OR
    is_active::text ILIKE ${`%${query}%`} 
         order by id asc
      limit ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slides.");
  }
}

export async function fetchAllBook(query: string, currentPage: number) {
  const offset = (currentPage - 1) * 30;
  try {
    const data = await sql`
      SELECT id,name,status,image_urls,is_active,created_at,updated_at
      FROM books
      WHERE
    id::text ILIKE ${`%${query}%`} OR
    name ILIKE ${`%${query}%`} OR
    status::text ILIKE ${`%${query}%`} OR
    image_urls::text ILIKE ${`%${query}%`} OR
    is_active::text ILIKE ${`%${query}%`} 
         order by id asc
      limit ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slides.");
  }
}
export async function fetchOurRecommendedBook(bookId: number) {
  try {
    const res = await sql`
      SELECT 
        b.id, b.name, b.image_urls, b.author, b.description,
        badges.label, badges.icon, badges.priority
      FROM books b 
      JOIN book_badges bb ON b.id = bb.book_id
      JOIN badges badges ON bb.badge_id = badges.id
      WHERE b.id = ${bookId}
      ORDER BY badges.priority
    `;

    if (res.length === 0) return null;

    const book = {
      id: res[0].id,
      name: res[0].name,
      image_urls: res[0].image_urls[0],
      author: res[0].author,
      description: res[0].description,
      badges: res.map((row) => ({
        label: row.label,
        icon: row.icon,
        priority: row.priority,
      })),
    };

    return book;
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch recommended book");
  }
}

export async function fetchBookByCategorySort(
  categoryId: number,
  sort: string,
  currentPage: number,
  order: string
) {
  const offset = (currentPage - 1) * 30;

  // Validate input
  const allowedSorts = ["views", "rating", "newest", "popularity"];
  const allowedOrders = ["ASC", "DESC"];

  if (!allowedSorts.includes(sort) || !allowedOrders.includes(order)) {
    throw new Error("Invalid sort parameters");
  }

  try {
    const data = await sql`
  SELECT b.id, b.name, b.status, b.image_urls, b.rating
  FROM books b 
  JOIN books_categories bc ON b.id = bc.book_id
  WHERE bc.category_id = ${categoryId}
  ORDER BY 
    ${
      sort === "views"
        ? sql`b.views`
        : sort === "rating"
        ? sql`b.rating`
        : sort === "popularity"
        ? sql`b.popularity`
        : sort === "created_at"
        ? sql`b.created_at`
        : sql`b.name`
    }
    ${order === "DESC" ? sql`DESC` : sql`ASC`}
  LIMIT 30 OFFSET ${offset}
`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch books by category.");
  }
}
