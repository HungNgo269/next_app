import { sql } from "@/lib/db";
import { ISlide } from "@/app/interface/slide";

export async function fetchAllSlide(): Promise<ISlide[]> {
  try {
    const res = await sql`
     select * from Slides
     order by display_order
     `;
    return res as ISlide[];
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}
