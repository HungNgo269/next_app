import { Book } from "@/app/interface/book";
import { Suspense } from "react";
import BookCardContent from "./bookCardContent";
import BookCardSkeleton from "@/components/skeleton/bookCardSkeleton";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Suspense fallback={<BookCardSkeleton />}>
      <BookCardContent book={book} />
    </Suspense>
  );
}
