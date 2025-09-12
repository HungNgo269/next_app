import { Book } from "@/app/interface/book";
import { BookCardSkeleton } from "@/app/ui/skeletons";
import BookCard from "@/app/ui/user/books/bookCard";
import { CONFIG, Variant } from "@/app/ui/user/books/bookCarousel";
import { Suspense } from "react";
interface props {
  slides?: (Book | null)[][];
  variant?: Variant;
}
export default function BookCarouselContent({ slides, variant = "lg" }: props) {
  const cfg = CONFIG[variant];
  console.log("first", variant);
  return (
    <>
      {slides?.map((page, pageIndex) => (
        <div
          key={`slide-${pageIndex}`}
          className={`w-full flex-shrink-0 lg:grid lg:${cfg.grid} flex flex-row gap-1 md:overflow-hidden overflow-x-scroll`}
        >
          {page.map((book, bookIndex) => {
            const itemKey = book?.id || `skeleton-${pageIndex}-${bookIndex}`;

            return (
              <div key={itemKey}>
                {book ? (
                  <Suspense fallback={<BookCardSkeleton></BookCardSkeleton>}>
                    <BookCard book={book} variant={variant} />
                  </Suspense>
                ) : (
                  <BookCardSkeleton variant={variant}></BookCardSkeleton>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
