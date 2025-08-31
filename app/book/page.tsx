import {
  getcategoryIdBySlug,
  getcategoryNameBySlug,
  sortOptions,
} from "@/app/constant/categories";
import { fetchBookByCategory } from "../data/categoryData";
import CategoryFilter from "../ui/share/genre/categoryFilter";
import { BookCardProps } from "../interface/book";
import BookCard from "../ui/user/books/bookCard";
import MostPopularBook from "../ui/user/ranking/mostPopularBook";
import CategoryName from "../ui/user/books/bookCategoryName";
import SortSelection from "../ui/user/books/bookCategorySortSelection";
import { fetchBookByCategorySortAction } from "../actions/bookActions";

interface BookPageProps {
  searchParams: Promise<{ tag?: string; sort?: string }>;
}

export default async function BookPage({ searchParams }: BookPageProps) {
  let { tag, sort } = await searchParams;
  if (sort === undefined) {
    sort = "popularity";
  }
  const sortOptions: string = sort;
  const categoryId = getcategoryIdBySlug(tag);
  const books: BookCardProps[] = await fetchBookByCategorySortAction(
    categoryId,
    sortOptions,
    1,
    "DESC"
  );
  console.log("book", books);

  return (
    <div className=" mx-auto w-[1190px] mt-20">
      <div className="flex  justify-between">
        <div className="w-[850px]   flex flex-col gap-5">
          <CategoryName></CategoryName>
          <div className="flex flex-row mb-6 justify-between">
            <CategoryFilter currentGenre={tag} />
            <SortSelection currentSort={sortOptions}></SortSelection>
          </div>
          <div
            className="
    flex gap-3 overflow-x-auto md:overflow-x-hidden
    md:grid md:grid-cols-3 lg:grid-cols-5 
  "
          >
            {books && books.length > 0
              ? (books as BookCardProps[]).map((book: BookCardProps) => (
                  <BookCard variant="sm" book={book} key={book.id} />
                ))
              : ""}
          </div>
        </div>

        <div className="w-[300px]  flex flex-col gap-5">
          <MostPopularBook />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ searchParams }: BookPageProps) {
  const { tag } = await searchParams;
  const categoryName = tag ? getcategoryNameBySlug(tag) : null;

  return {
    title: categoryName ? ` ${categoryName} - Bookstore` : " Bookstore",
    description: categoryName
      ? `${categoryName} at bookstore`
      : "Interesting book",
  };
}
