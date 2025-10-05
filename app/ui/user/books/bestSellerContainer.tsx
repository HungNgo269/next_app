import { fetchAllCategoryAction } from "@/app/actions/categoryActions";
import BookCategoryContainer from "@/app/ui/user/books/bookCategoryContainer";
import { Category } from "@/app/interface/category";
export default async function BestSellerContainer() {
  const categories = (await fetchAllCategoryAction()) as unknown as Category[];
  return (
    <div className="flex flex-row justify-between lg:w-full w-full md:w-[700px]">
      <BookCategoryContainer key="category-container" categories={categories} />
    </div>
  );
}
