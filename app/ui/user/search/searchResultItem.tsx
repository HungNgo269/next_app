import Image from "next/image";
import ImageCard from "@/app/ui/share/image/imageCard";
import { BookCardProps } from "@/app/interface/book";
import Link from "next/link";

export default function SearchResultItem({ book }: { book: BookCardProps }) {
  return (
    <Link prefetch={true} href={`/book/${book.id}`} className="block">
      <div className="flex flex-row gap-4 p-4 hover:bg-background">
        <div className="h-20 w-16 relative">
          <ImageCard bookName={book.name} bookImage={book.image_urls[0]} />
        </div>
        <div className="flex flex-col justify-start">
          <div className="font-semibold">{book.name}</div>
          <div className="text-accent-foreground text-sm">{book.author}</div>
          {book.rating !== undefined && (
            <div className="text-accent-foreground text-sm">
              Rating: {book.rating}/5
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
