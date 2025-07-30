import { sql } from "@/app/lib/db";
import { Book } from "@/app/interface/book";
import { Category } from "@/app/interface/category";
import BooksWithNavigation from "./bookNavbar";
import { ChevronRight } from "lucide-react";

export default async function BestSellerContainer() {
  const Books: Book[] = await sql`
    SELECT *
    FROM books 
    ORDER BY views DESC
  `;

  const categories: Category[] = await sql`
    SELECT id, name, url FROM categories LIMIT 10
  `;

  return (
    <div className="flex flex-col mt-10 mx-auto w-full">
      <div className="flex flex-row justify-between">
        <div className="text-xl font-semibold">
          Hottest book around the internet right now
        </div>
        <div className="flex flex-row text-gray-600 items-center justify-center">
          <div>See more books</div>
          <ChevronRight size={20} />
        </div>
      </div>

      <BooksWithNavigation books={Books} categories={categories} />
    </div>
  );
}
