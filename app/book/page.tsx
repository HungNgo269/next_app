import { Suspense } from "react";
import CategoryFilter from "../ui/share/genre/categoryFilter";
import CategoryName from "../ui/user/books/bookCategoryName";
import SortSelection from "../ui/user/books/bookCategorySortSelection";
import { BookCardSkeleton } from "../ui/skeletons";
import Pagination from "../ui/share/pagination/pagination";
import MostPopularBook from "../ui/user/ranking/popularBook";
import FooterComponent from "../ui/user/footer/footerComponent";
import { getcategoryIdBySlug } from "../constant/categories";
import { fetchTotalBookPageByCategoryAction } from "../actions/bookActions";
import { fetchTotalBookPage } from "../data/bookData";
import { BookList } from "./bookList";
interface BookPageProps {
  searchParams: Promise<{ tag?: string; sort?: string; page: number }>;
}

export default async function BookPage({ searchParams }: BookPageProps) {
  let { tag, sort, page } = await searchParams;

  const sortOptions: string = sort ?? "popularity";
  const categoryId = getcategoryIdBySlug(tag ?? "");

  let totalPages;
  if (categoryId) {
    totalPages = await fetchTotalBookPageByCategoryAction(categoryId);
  } else {
    totalPages = await fetchTotalBookPage();
  }
  return (
    <div className="mx-auto w-full lg:w-[1190px] mt-20 ">
      <div className="flex justify-between">
        <div className="w-full lg:w-[850px] flex flex-col gap-5">
          <CategoryName />
          <div className="flex flex-row mb-6 justify-between">
            <CategoryFilter currentGenre={tag} />
            <SortSelection currentSort={sortOptions} />
          </div>

          <div className="flex flex-col">
            <Suspense fallback={<BookCardSkeleton></BookCardSkeleton>}>
              <BookList
                tag={tag}
                sortOptions={sortOptions}
                currentPage={page}
              />
            </Suspense>

            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          </div>
        </div>

        <div className="hidden w-[300px] lg:flex flex-col gap-5">
          <MostPopularBook />
        </div>
      </div>

      <div className="mt-10">
        <FooterComponent />
      </div>
    </div>
  );
}
