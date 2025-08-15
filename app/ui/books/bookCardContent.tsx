import { Book } from "@/app/interface/book";
import Link from "next/link";
import ImageCard from "../image/imageCard";

interface BookCardContentProps {
  book: Book;
  width?: string;
  height?: string;
}

export default function BookCardContent({
  book,
  width,
  height,
}: BookCardContentProps) {
  if (!book) {
    return <div>book not found</div>;
  }
  //TODO => errror page
  return (
    <div
      className={`flex flex-col w-full p-1  ${
        height ? height : "  h-[355px]"
      } `}
    >
      {/* pro  */}
      <Link href={`/book/${book.id}`}>
        <div className="relative w-[230px] h-[300px]  overflow-hidden rounded-[8px] group">
          <ImageCard
            bookImage={book.image_urls[0]}
            bookName={book.name}
            key={book.id}
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
