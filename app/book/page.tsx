import {
  getcategoryIdBySlug,
  getcategoryNameBySlug,
} from "@/app/constant/categories";
import { fetchBookByCategory } from "../data/categoryData";
import CategoryFilter from "../ui/share/genre/categoryFilter";
import { BookCardProps } from "../interface/book";
import BookCard from "../ui/user/books/bookCard";
import MostPopularBook from "../ui/user/ranking/mostPopularBook";

interface BookPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BookPage({ searchParams }: BookPageProps) {
  const { tag } = await searchParams;
  const categoryId = getcategoryIdBySlug(tag);
  const books: BookCardProps[] = await fetchBookByCategory(categoryId);
  const categoryName = getcategoryNameBySlug(tag);
  console.log("book", books);

  return (
    <div className=" mx-auto w-[1190px] mt-20">
      <div className="flex  justify-between">
        <div className="w-[850px]   flex flex-col gap-5">
          <div className="mb-6">
            <CategoryFilter currentGenre={tag} />
          </div>
          <div
            className="
    flex gap-3 overflow-x-auto md:overflow-x-auto
    md:grid md:grid-cols-3 lg:grid-cols-5 
    scrollbar-hide
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
    title: categoryName
      ? `Sách ${categoryName} - Bookstore`
      : "Tất cả sách - Bookstore",
    description: categoryName
      ? `Khám phá bộ sưu tập sách ${categoryName} tại bookstore`
      : "Khám phá bộ sưu tập sách đa dạng với nhiều thể loại",
  };
}
