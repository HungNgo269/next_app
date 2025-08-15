import { fetchCategories } from "@/app/data/categoryData";
import BookCategoryContainer from "./bookCategoryContainer";
import { Category } from "@/app/interface/category";
export default async function BestSellerContainer() {
  const categories: Category[] = await fetchCategories();
  return (
    <>
      <BookCategoryContainer categories={categories} />
    </>
  );
}
