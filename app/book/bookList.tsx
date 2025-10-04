import { Suspense } from "react";
import {
  fetchAllBookAction,
  fetchBookByCategorySortAction,
} from "../actions/bookActions";
import { getcategoryIdBySlug } from "../constant/categories";
import { BookCardProps } from "../interface/book";
import BookCard from "../ui/user/books/bookCard";
import { BookCardSkeleton } from "@/app/ui/skeletons";

export async function BookList({
  tag,
  sortOptions,
  currentPage,
}: {
  tag?: string;
  sortOptions: string;
  currentPage: number;
}) {
  const categoryId = getcategoryIdBySlug(tag ?? "");
  let books: BookCardProps[] = [];

  if (tag) {
    books = (await fetchBookByCategorySortAction(
      categoryId,
      sortOptions,
      currentPage,
      "DESC"
    )) as unknown as BookCardProps[];
  } else {
    books = (await fetchAllBookAction(
      currentPage,
      sortOptions,
      "DESC"
    )) as unknown as BookCardProps[];
  }

  return (
    <div
      className="
    w-full gap-2
    grid grid-cols-2
    md:grid-cols-5
    md:overflow-visible
    md:place-items-center md:justify-center  
    justify-items-center
  "
    >
      <Suspense fallback={<BookCardSkeleton></BookCardSkeleton>}>
        {books?.length
          ? books.map((book: BookCardProps) => (
              <BookCard variant="sm" book={book} key={book.id} />
            ))
          : null}
      </Suspense>
    </div>
  );
}
