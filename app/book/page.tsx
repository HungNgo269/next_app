import {
  getcategoryIdBySlug,
  getcategoryNameBySlug,
} from "@/app/constant/categories";
import CategoryFilter from "@/app/ui/share/genre/categoryFilter";
import { BookCardProps } from "@/app/interface/book";
import BookCard from "@/app/ui/user/books/bookCard";
import MostPopularBook from "@/app/ui/user/ranking/popularBook";
import CategoryName from "@/app/ui/user/books/bookCategoryName";
import SortSelection from "@/app/ui/user/books/bookCategorySortSelection";
import {
  fetchAllBookAction,
  fetchBookByCategorySortAction,
  fetchTotalBookPageByCategoryAction,
} from "@/app/actions/bookActions";
import Pagination from "@/app/ui/share/pagination/pagination";
import FooterComponent from "@/app/ui/user/footer/footerComponent";
import { fetchTotalBookPage } from "@/app/data/bookData";

interface BookPageProps {
  searchParams: Promise<{ tag?: string; sort?: string }>;
}

export default async function BookPage({ searchParams }: BookPageProps) {
  let { tag, sort } = await searchParams;
  const sortOptions: string = sort ?? "popularity";
  const categoryId = getcategoryIdBySlug(tag ?? "");
  let totalPages;
  if (categoryId) {
    totalPages = await fetchTotalBookPageByCategoryAction(categoryId);
  } else {
    totalPages = await fetchTotalBookPage();
  }
  let books: BookCardProps[] = [];
  if (tag) {
    books = (await fetchBookByCategorySortAction(
      categoryId,
      sortOptions,
      1,
      "DESC"
    )) as unknown as BookCardProps[];
  } else {
    books = (await fetchAllBookAction(1, sortOptions, "DESC")) as unknown as BookCardProps[];
  }

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
          <div className=" flex flex-col ">
            <div
              className="
    flex gap-3 overflow-x-auto md:overflow-x-hidden
    md:grid md:grid-cols-3 lg:grid-cols-5  w-full
  "
            >
              {books && books.length > 0
                ? (books as BookCardProps[]).map((book: BookCardProps) => (
                    <BookCard variant="sm" book={book} key={book.id} />
                  ))
                : ""}
            </div>
            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          </div>
        </div>

        <div className="w-[300px]  flex flex-col gap-5">
          <MostPopularBook />
        </div>
      </div>
      <div className="mt-10">
        <FooterComponent></FooterComponent>
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
