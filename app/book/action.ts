"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchBookByCategory } from "../data/categoryData";
import { getcategoryIdBySlug } from "@/app/constant/categories";

export async function changeCategoryAction(formData: FormData) {
  const selectedCategory = formData.get("category") as string;

  console.log("🚀 Server Action - changeCategoryAction:", selectedCategory);

  try {
    const categoryId = getcategoryIdBySlug(selectedCategory);
    await fetchBookByCategory(categoryId);
    revalidatePath("/book");
    redirect(`/book?tag=${selectedCategory}`);
  } catch (error) {
    console.error("❌ Server Action Error:", error);
    redirect("/book");
  }
}

export async function updateCategoryAction(categorySlug: string) {
  console.log("🚀 Server Action - updateCategoryAction:", categorySlug);

  try {
    const categoryId =
      categorySlug === "all" ? 0 : getcategoryIdBySlug(categorySlug);
    const books = await fetchBookByCategory(categoryId);
    revalidatePath("/book");
    return {
      success: true,
      books,
      categorySlug,
    };
  } catch (error) {
    console.error("❌ updateCategoryAction Error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
