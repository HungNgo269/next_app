"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  description?: string;
  link: string;
  alt: string;
}

interface CarouselSlide {
  id: number;
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  items: CarouselItem;
}

const slides: CarouselSlide[] = [
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

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length); //nếu đã ở slide cuối thì quay lại slide đầu (dư 1)
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  return (
    <div className=" relative max-w-4xl mx-auto bg-white rounded-[8px] shadow-lg overflow-hidden mt-10  ">
      <div className="relative h-[350px] md:h-[400px] overflow-hidden ">
        <div
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }} //translateX(100)=>sang phải 1 slide
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-full flex-shrink-0 relative">
              <Link
                href={slide.items.link}
                className="block w-full h-full group"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={slide.items.image}
                    alt={slide.items.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={slide.id === 1}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="text-white p-8 md:p-12 max-w-2xl">
                      <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                        {slide.items.title}
                      </h2>
                      {slide.items.description && (
                        <p className="text-lg md:text-xl mb-6 opacity-90">
                          {slide.items.description}
                        </p>
                      )}
                      <div className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors duration-200">
                        Shop Now
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-gray-200 shadow-lg z-10 rounded-[50%]"
          onClick={prevSlide}
          disabled={isTransitioning}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous slide</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-gray-200 shadow-lg z-10  rounded-[50%]"
          onClick={nextSlide}
          disabled={isTransitioning}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next slide</span>
        </Button>

        {/* Play/Pause button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 bg-white/90 hover:bg-white border-gray-200 shadow-lg z-10 rounded-[50%]"
          onClick={togglePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isPlaying ? "Pause" : "Play"} carousel
          </span>
        </Button>
      </div>
      <div className="flex justify-center items-center space-x-2 py-4 bg-transparent   absolute z-10 bottom-0 left-0 right-0">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? "bg-blue-600 scale-110"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
