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
  type: "single" | "grid" | "split";
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  items: CarouselItem[];
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    type: "single",
    items: [
      {
        id: 1,
        image: "/placeholder.svg?height=400&width=800",
        title: "Summer Sale - Up to 70% Off",
        description: "Discover amazing deals on electronics, fashion, and more",
        link: "/summer-sale",
        alt: "Summer sale banner",
      },
    ],
  },
  {
    id: 2,
    type: "grid",
    title: "Featured Categories",
    subtitle: "Shop our most popular items",
    backgroundColor: "bg-gradient-to-br from-blue-50 to-purple-50",
    items: [
      {
        id: 1,
        image: "/placeholder.svg?height=200&width=300",
        title: "Electronics",
        description: "Latest gadgets & tech",
        link: "/electronics",
        alt: "Electronics category",
      },
      {
        id: 2,
        image: "/placeholder.svg?height=200&width=300",
        title: "Fashion",
        description: "Trending styles",
        link: "/fashion",
        alt: "Fashion category",
      },
      {
        id: 3,
        image: "/placeholder.svg?height=200&width=300",
        title: "Home & Garden",
        description: "Transform your space",
        link: "/home-garden",
        alt: "Home and garden category",
      },
      {
        id: 4,
        image: "/placeholder.svg?height=200&width=300",
        title: "Sports",
        description: "Gear for adventure",
        link: "/sports",
        alt: "Sports category",
      },
    ],
  },
  {
    id: 3,
    type: "split",
    backgroundColor: "bg-gradient-to-r from-green-50 to-blue-50",
    items: [
      {
        id: 1,
        image: "/placeholder.svg?height=400&width=400",
        title: "New iPhone 15",
        description: "Starting at $799",
        link: "/iphone-15",
        alt: "iPhone 15",
      },
      {
        id: 2,
        image: "/placeholder.svg?height=400&width=400",
        title: "MacBook Pro",
        description: "From $1,299",
        link: "/macbook-pro",
        alt: "MacBook Pro",
      },
    ],
  },
  {
    id: 4,
    type: "single",
    items: [
      {
        id: 1,
        image: "/placeholder.svg?height=400&width=800",
        title: "Black Friday Deals",
        description: "Biggest sale of the year - Don't miss out!",
        link: "/black-friday",
        alt: "Black Friday sale banner",
      },
    ],
  },
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        prevSlide();
      } else if (event.key === "ArrowRight") {
        nextSlide();
      } else if (event.key === " ") {
        event.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div className="relative w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Main carousel container */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {/* Slides */}
        <div
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-full flex-shrink-0 relative">
              {slide.type === "single" && (
                <Link
                  href={slide.items[0].link}
                  className="block w-full h-full group"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={slide.items[0].image || "/placeholder.svg"}
                      alt={slide.items[0].alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={slide.id === 1}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                    <div className="absolute inset-0 flex items-center">
                      <div className="text-white p-8 md:p-12 max-w-2xl">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                          {slide.items[0].title}
                        </h2>
                        {slide.items[0].description && (
                          <p className="text-lg md:text-xl mb-6 opacity-90">
                            {slide.items[0].description}
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
              )}

              {slide.type === "grid" && (
                <div
                  className={`w-full h-full p-8 ${
                    slide.backgroundColor || "bg-white"
                  }`}
                >
                  {slide.title && (
                    <div className="text-center mb-8">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        {slide.title}
                      </h2>
                      {slide.subtitle && (
                        <p className="text-lg text-gray-600">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full max-h-[300px]">
                    {slide.items.map((item) => (
                      <Link key={item.id} href={item.link} className="group">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform duration-200 group-hover:scale-105">
                          <div className="relative h-32 md:h-40">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.alt}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {slide.type === "split" && (
                <div
                  className={`w-full h-full flex ${
                    slide.backgroundColor || "bg-white"
                  }`}
                >
                  {slide.items.map((item, index) => (
                    <Link
                      key={item.id}
                      href={item.link}
                      className="flex-1 group relative"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.alt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl md:text-2xl font-bold mb-2">
                            {item.title}
                          </h3>
                          <p className="text-lg opacity-90 mb-4">
                            {item.description}
                          </p>
                          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-semibold transition-colors duration-200 hover:bg-white/30">
                            Shop Now
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      {index < slide.items.length - 1 && (
                        <div className="absolute right-0 top-0 bottom-0 w-px bg-white/20" />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-gray-200 shadow-lg z-10"
          onClick={prevSlide}
          disabled={isTransitioning}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous slide</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-gray-200 shadow-lg z-10"
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
          className="absolute top-4 right-4 bg-white/90 hover:bg-white border-gray-200 shadow-lg z-10"
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

      {/* Bullet navigation */}
      <div className="flex justify-center items-center space-x-2 py-4 bg-gray-50">
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

        {/* Slide counter */}
        <div className="ml-4 text-sm text-gray-600 font-medium">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Progress bar 
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        />
      </div>
      */}
    </div>
  );
}
