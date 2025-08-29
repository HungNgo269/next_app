import { fetchCategories } from "@/app/data/categoryData";
import BookCategoryContainer from "./bookCategoryContainer";
import { Category } from "@/app/interface/category";
export default async function BestSellerContainer() {
  const categories: Category[] = await fetchCategories();
  return (
    <div className="flex flex-row justify-between">
      <BookCategoryContainer key="category-container" categories={categories} />
    </div>
  );
}
