import { Book } from "@/app/interface/book";
import Link from "next/link";
import Image from "next/image";

interface BookCardContentProps {
  book: Book;
}

export default function BookCardContent({ book }: BookCardContentProps) {
  if (!book) {
    return <div>book not found</div>;
  }

  return (
    <div className="flex flex-col w-full h-[355px] p-1 ">
      {/* pro  */}
      <Link href={`/book/${book.id}`}>
        <div className="relative w-[230px] h-[300px] group overflow-hidden rounded-[8px]">
          <Image
            src={book.image_urls?.[0] || "/default-cover.png"}
            alt={book.name}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 cursor-pointer"
          />
        </div>
      </Link>

      <div className="flex flex-col h-[43px] w-full mt-[12px] justify-between">
        <span className="line-clamp-1 font-semibold text-sm cursor-pointer w-fit hover:underline">
          {book.name}
        </span>
        <span className="line-clamp-1 font-semibold text-xs cursor-pointer w-fit hover:underline">
          {book.author}
        </span>
      </div>
    </div>
  );
}
