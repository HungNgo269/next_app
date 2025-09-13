import {
  fetchAllBookAction,
  fetchBookByCategorySortAction,
} from "../actions/bookActions";
import { getcategoryIdBySlug } from "../constant/categories";
import { BookCardProps } from "../interface/book";
import BookCard from "../ui/user/books/bookCard";

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
    w-full gap-3
    flex overflow-x-auto                     
    md:grid md:grid-cols-3 lg:grid-cols-4    xl:grid-cols-5
    md:overflow-visible
    md:place-items-center md:justify-center  
  "
    >
      {books?.length
        ? books.map((book: BookCardProps) => (
            <BookCard variant="sm" book={book} key={book.id} />
          ))
        : null}
    </div>
  );
}
