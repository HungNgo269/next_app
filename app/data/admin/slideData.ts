import { sql } from "@/lib/db";
const ITEMS_PER_PAGE = 10;
export async function fetchSlidesByPage(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql`
      SELECT id,title,display_order,is_active,redirect_url,description,image_url,created_at,updated_at

      FROM slides
      WHERE
    id::text ILIKE ${`%${query}%`} OR
    title ILIKE ${`%${query}%`} OR
    image_url ILIKE ${`%${query}%`} OR

    display_order::text ILIKE ${`%${query}%`} OR
    is_active::text ILIKE ${`%${query}%`} OR
    description ILIKE ${`%${query}%`}
         order by display_order asc
      limit ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slides.");
  }
}

export async function fetchSlideById(query: string) {
  try {
    const data = await sql`
      SELECT *
      FROM slides where ${query}= id `;
    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slides.");
  }
}

export async function fetchSlides() {
  try {
    const data = await sql`
      SELECT *
      FROM slides order by id desc`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slides.");
  }
}

export async function fetchSlidePages(query: string) {
  try {
    const data = await sql`
  SELECT COUNT(*) 
  FROM slides 
  WHERE 
    id::text ILIKE ${`%${query}%`} OR
    title ILIKE ${`%${query}%`} OR
    image_url ILIKE ${`%${query}%`} OR
    display_order::text ILIKE ${`%${query}%`} OR
    is_active::text ILIKE ${`%${query}%`} OR
    description ILIKE ${`%${query}%`}
`;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slide page.");
  }
}
export async function deleteSlide(slideId: string) {
  try {
    await sql`DELETE FROM slides WHERE id = ${slideId}`;
    return { success: true };
  } catch (error) {
    console.error("Error deleting slide:", error);
    return { success: false, error: "Failed to delete slide" };
  }
}

// export async function fetchTotalSlides() {
//   try {
//     const data = await sql`
//       SELECT count(*) as total_slides
//       FROM slides`;
//     return data;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch Total Slide.");
//   }
// }
