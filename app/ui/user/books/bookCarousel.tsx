"use client";

import { Book } from "@/app/interface/book";
import { Suspense, useMemo, useState } from "react";
import BookCard from "./bookCard";
import BookCarouselNavigation from "./bookCarouselNavigation";
import { BookCardSkeleton } from "../../skeletons";

type Variant = "lg" | "sm";
interface BookCarouselProps {
  books: Book[];
  variant?: Variant;
}

const CONFIG = {
  lg: {
    container: "w-[1190px]",
    grid: "grid-cols-5 gap-1",
  },
  sm: {
    container: "w-[850px]",
    grid: "grid-cols-5 gap-1",
  },
} as const;
const ITEMS_PER_SLIDE = 5;

export default function BookCarousel({ books, variant }: BookCarouselProps) {
  const cfg = CONFIG[variant];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = useMemo(() => {
    const chunks: Book[][] = [];
    for (let i = 0; i < books.length; i += ITEMS_PER_SLIDE) {
      chunks.push(books.slice(i, i + ITEMS_PER_SLIDE));
    }
    return chunks;
  }, [books]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  console.log(":slide", slides);
  return (
    <div className={`relative ${cfg.container}`}>
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out h-fit"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onTransitionEnd={() => setIsTransitioning(false)}
        >
          {slides.map((page, i) => (
            <div key={i} className="w-full flex-shrink-0">
              <div className={`grid  ${cfg.grid}`}>
                {page.map((book) => (
                  <Suspense
                    fallback={
                      <BookCardSkeleton variant={variant}></BookCardSkeleton>
                    }
                  >
                    <BookCard key={book.id} book={book} variant={variant} />
                  </Suspense>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BookCarouselNavigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrevSlide={prevSlide}
        onNextSlide={nextSlide}
        variant={variant}
      />
    </div>
  );
}
