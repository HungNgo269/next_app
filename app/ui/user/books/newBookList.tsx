import { sql } from "@/lib/db";
import BookCard from "./bookCard";
import { Book } from "@/app/interface/book";
import BookCarousel from "./bookCarousel";
import ViewMoreBookButton from "./viewMoreBookButton";

export default async function NewBookList() {
  const Books: Book[] = await sql`
  SELECT id,name,author,image_urls
  FROM Books 
  ORDER BY  created_at DESC
  LIMIT 10
`;
  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="flex flex-row items-center justify-between w-full gap-2">
        <span className="font-bold text-2xl text-start flex-1 min-w-0 truncate">
          New Book
        </span>
        <ViewMoreBookButton url="/"></ViewMoreBookButton>
      </div>
      <BookCarousel variant="sm" books={Books}></BookCarousel>
    </div>
  );
}
