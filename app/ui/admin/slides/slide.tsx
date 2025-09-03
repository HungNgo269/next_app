"use client";

import { useState } from "react";
import SlideContent from "./slideContent";
import SlideControls from "./slideController";
export interface SlideItem {
  id: number;
  image: string;
  title: string;
  description?: string;
  link: string;
  alt: string;
}

export interface SlideSlide {
  id: number;
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  items: SlideItem;
}

// data/slides.ts

export const slides: SlideSlide[] = [
  {
    id: 1,
    items: {
      id: 1,
      image:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      title: "Summer Sale - Up to 70% Off",
      description: "Discover amazing deals on electronics, fashion, and more",
      link: "/summer-sale",
      alt: "Summer sale banner",
    },
  },
  {
    id: 2,
    title: "Featured Categories",
    subtitle: "Shop our most popular items",
    backgroundColor: "bg-gradient-to-br from-blue-50 to-purple-50",
    items: {
      id: 1,
      image:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      title: "Electronics",
      description: "Latest gadgets & tech",
      link: "/electronics",
      alt: "Electronics category",
    },
  },
  {
    id: 3,
    backgroundColor: "bg-gradient-to-r from-green-50 to-blue-50",
    items: {
      id: 1,
      image:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      title: "New iPhone 15",
      description: "Starting at $799",
      link: "/iphone-15",
      alt: "iPhone 15",
    },
  },
  {
    id: 4,
    items: {
      id: 1,
      image:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      title: "Black Friday Deals",
      description: "Biggest sale of the year - Don't miss out!",
      link: "/black-friday",
      alt: "Black Friday sale banner",
    },
  },
];
export default function Slide() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSlideChange = (newSlide: number) => {
    setIsTransitioning(true);
    setCurrentSlide(newSlide);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <div className="relative w-full mx-auto bg-white shadow-lg overflow-hidden">
      <SlideContent slides={slides} currentSlide={currentSlide} />
      <SlideControls
        totalSlides={slides.length}
        currentSlide={currentSlide}
        onSlideChange={handleSlideChange}
        isTransitioning={isTransitioning}
      />
    </div>
  );
}
