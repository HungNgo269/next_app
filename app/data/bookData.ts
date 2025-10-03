import { sql } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { Book, BookCardProps } from "@/app/interface/book";
import { getStartDate, TimeFrame } from "@/app/data/rankingData";
const ITEMS_PER_PAGE = 10;

export async function fetchBookById(id: number) {
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
export async function fetchBookImage(bookId: number) {
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
export async function fetchBooksByPage(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql`
      SELECT id,name,status,image_urls,is_active,views,author,publish_date,description
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

export async function fetchBookPages(query: string) {
  try {
    const data = await sql`
  SELECT COUNT(*)
  FROM books
  WHERE
    id::text ILIKE ${`%${query}%`} OR
    name ILIKE ${`%${query}%`} OR
    status::text ILIKE ${`%${query}%`} OR
    image_urls::text ILIKE ${`%${query}%`} OR
    is_active::text ILIKE ${`%${query}%`}
`;
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch book pages.");
  }
}
export async function fetchBooksByQuery(query: string) {
  try {
    const data = await sql`
      SELECT id,name,status,image_urls,is_active,author,rating
      FROM books
      WHERE 
    name ILIKE ${`%${query}%`} 
         order by id asc
      limit ${ITEMS_PER_PAGE} 
        `;
    return data as BookCardProps[];
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

export async function fetchAllBookSort(
  sort: string,
  currentPage: number,
  order: string
) {
  const offset = (currentPage - 1) * 30;
  const allowedSorts = ["views", "rating", "newest", "popularity"];
  const allowedOrders = ["ASC", "DESC"];
  if (!allowedSorts.includes(sort) || !allowedOrders.includes(order)) {
    throw new Error("Invalid sort parameters");
  }
  try {
    const data = await sql`
  SELECT b.id, b.name, b.status, b.image_urls, b.rating,b.author
  FROM books b 
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

export async function fetchTotalBookPage() {
  try {
    const data = await sql`
  SELECT COUNT(*) 
  FROM books
`;
    const totalPages = Math.ceil(Number(data[0].count) / 30);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total book page.");
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
  SELECT b.id, b.name, b.status, b.image_urls, b.rating,b.author
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
export async function fetchTotalBookPageByCategory(categoryId: number) {
  try {
    const data = await sql`
  SELECT COUNT(*) 
  FROM books b  join books_categories bc on bc.book_id = b.id 
  WHERE bc.category_id =${categoryId};
`;
    console.log("first", data);
    const totalPages = Math.ceil(Number(data[0].count) / 30);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slide page.");
  }
}

export async function fetchPopularBook(timeframe: string) {
  try {
    const cacheKey = `popular-books-${timeframe}`;
    const startDate = getStartDate(timeframe as TimeFrame);
    const books = await unstable_cache(
      async () => {
        const result = await sql`SELECT b.id, b.image_urls, b.name, b.author,
       (b.views + COUNT(cv.id)) as total_views
          FROM books b
LEFT JOIN chapters c ON b.id = c.book_id
LEFT JOIN chapter_views cv ON c.id = cv.chapter_id 
  AND cv.viewed_at >= ${startDate}
GROUP BY b.id, b.image_urls, b.name, b.author, b.views
ORDER BY total_views DESC
LIMIT 5
        `;
        return result as BookCardProps[];
      },
      [cacheKey],
      { revalidate: 3600, tags: ["books", "popular"] }
    )();

    return books;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetchPopularBook.");
  }
}
export async function fetchTotalChapterInBookById(id: number) {
  try {
    const res =
      await sql`SELECT COUNT(c.chapter_number) as total FROM chapters c where c.book_id=${id}
  `;
    return res[0]?.total ?? 0;
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch book image for chapter");
  }
}
export async function AddBookToBookShelf(userId: string, bookId: number) {
  try {
    const res = await sql`
    insert into book_shelf  (id,book_id) values (${userId},${bookId})
  `;
    return res;
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch book image for chapter");
  }
}
export async function RemoveFromBookShelf(bookId: number) {
  try {
    const res = await sql`
    DELETE FROM book_shelf  where book_id=${bookId};
  `;
    return res;
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch book image for chapter");
  }
}
export async function fetchBookNameByBookId(bookId: number) {
  try {
    const res = await sql`
    select b.name from books b
where b.id = ${bookId} 
  `;
    return res[0]?.name as string;
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetchBookNameByBookId");
  }
}
export async function fetchBookImageByBookId(bookId: number) {
  try {
    const res = await sql`
    select b.image_urls from books b
where b.id = ${bookId} 
  `;
    return res[0].image_urls[0];
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetchBookNameByBookId");
  }
}
