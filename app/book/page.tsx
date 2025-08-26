import {
  getcategoryIdBySlug,
  getcategoryNameBySlug,
} from "@/app/constant/categories";
import { fetchBookByCategory } from "../data/categoryData";
import CategoryFilter from "../ui/share/genre/categoryFilter";
import { BookCardProps } from "../interface/book";
import BookCard from "../ui/user/books/bookCard";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  async function handleCategoryChangeAction(formData: FormData) {
    "use server";

    const selectedCategory = formData.get("category") as string;
    console.log("🔄 Category change server action:", selectedCategory);
    revalidatePath("/book");
    if (selectedCategory === "all") {
      redirect("/book");
    } else {
      redirect(`/book?tag=${selectedCategory}`);
    }
  }

  return (
    <div className=" mx-auto w-[1190px]">
      <div className="flex  justify-between mt-4">
        <div className="w-[850px]   flex flex-col gap-5">
          <div className="mb-6">
            <CategoryFilter
              currentGenre={tag}
              onCategoryChange={handleCategoryChangeAction}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
