import { BookCardProps } from "@/app/interface/book";
import Link from "next/link";
import ImageCard from "@/app/ui/share/image/imageCard";

interface popularBookContentProps {
  books: BookCardProps[];
}

export default function PopularBookContent({ books }: popularBookContentProps) {
  return (
    <div className="space-y-3">
      {books.map((book: BookCardProps, index) => (
        <div
          key={book.id}
          className="flex flex-row items-center gap-2 h-[80px]"
        >
          <Link
            prefetch={true}
            href={`book/${book.id}`}
            className="relative w-[60px] h-full overflow-hidden rounded-[4px] group"
          >
            <ImageCard bookImage={book?.image_urls[0]} bookName={book.name} />
          </Link>
          <div className="min-w-6 min-h-6 flex items-center justify-center text-lg font-bold text-card-foreground">
            {index + 1}
          </div>
          <div className="flex flex-col justify-center h-full">
            <Link
              prefetch={true}
              href={`book/${book.id}`}
              className="text-sm font-semibold cursor-pointer truncate hover:underline max-w-[180px]"
            >
              {book.name}
            </Link>
            <Link
              prefetch={true}
              href={`${book.author}`}
              className="text-sm hover:underline"
            >
              {book.author}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
