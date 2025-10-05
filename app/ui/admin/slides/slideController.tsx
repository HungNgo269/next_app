"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideControlsProps {
  totalSlides: number;
  currentSlide: number;
  onSlideChange: (index: number) => void;
  isTransitioning: boolean;
}

export default function SlideControls({
  totalSlides,
  currentSlide,
  onSlideChange,
  isTransitioning,
}: SlideControlsProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    onSlideChange((currentSlide + 1) % totalSlides);
  }, [currentSlide, totalSlides, isTransitioning, onSlideChange]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    onSlideChange((currentSlide - 1 + totalSlides) % totalSlides);
  }, [currentSlide, totalSlides, isTransitioning, onSlideChange]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    onSlideChange(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-24 bottom-10 bg-white/90 hover:bg-white border-gray-200 text-primary shadow-lg z-30 rounded-[50%] cursor-pointer"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Previous slide</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4  bottom-10 bg-white/90 hover:bg-white border-gray-200  text-primary shadow-lg z-30 rounded-[50%] cursor-pointer"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Next slide</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute bottom-10 right-14  bg-white/90 hover:bg-white border-gray-200  text-primary shadow-lg z-30 rounded-[50%] cursor-pointer"
        onClick={togglePlayPause}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <span className="sr-only">{isPlaying ? "Pause" : "Play"} Slide</span>
      </Button>

      <div className="flex justify-center items-center space-x-2 py-4 bg-transparent absolute z-10 bottom-0 left-0 right-0">
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all cursor-pointer duration-200 ${
              index === currentSlide
                ? "bg-primary scale-110"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}
