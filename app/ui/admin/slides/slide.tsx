"use client";

import { useState } from "react";
import SlideContent from "@/app/ui/admin/slides/slideContent";
import SlideControls from "@/app/ui/admin/slides/slideController";
import { ISlide } from "@/app/interface/slide";

interface props {
  slides: ISlide[];
}

export default function Slide({ slides }: props) {
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
