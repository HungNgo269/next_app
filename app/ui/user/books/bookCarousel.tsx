"use client";

import { Book } from "@/app/interface/book";
import { useMemo, useState } from "react";
import BookCarouselNavigation from "@/app/ui/user/books/bookCarouselNavigation";
import BookCarouselContent from "@/app/ui/user/books/bookCarouselContent";

export type Variant = "lg" | "sm";
interface BookCarouselProps {
  books: Book[];
  variant?: Variant;
  isLoading?: boolean;
}

export const CONFIG = {
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

export default function BookCarousel({
  books,
  variant = "lg",
  isLoading = false,
}: BookCarouselProps) {
  const cfg = CONFIG[variant];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const displayItems = useMemo(() => {
    if (isLoading) {
      return Array(10).fill(null);
    }
    return books;
  }, [books, isLoading]);

  const slides = useMemo(() => {
    const chunks: (Book | null)[][] = [];
    for (let i = 0; i < displayItems.length; i += ITEMS_PER_SLIDE) {
      chunks.push(displayItems.slice(i, i + ITEMS_PER_SLIDE));
    }
    return chunks;
  }, [displayItems]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  };
  console.log("slide", slides);
  return (
    <div className={`relative ${cfg.container}`}>
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out h-fit"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onTransitionEnd={() => setIsTransitioning(false)}
        >
          <BookCarouselContent
            slides={slides}
            variant={variant}
          ></BookCarouselContent>
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
