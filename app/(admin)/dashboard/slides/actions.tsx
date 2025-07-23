"use server";
import { sql } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteSlide(slideId: string) {
  try {
    await sql`DELETE FROM slides WHERE id = ${slideId}`;
    revalidatePath("/slides");
    return { success: true };
  } catch (error) {
    console.error("Error deleting slide:", error);
    return { success: false, error: "Failed to delete slide" };
  }
}
