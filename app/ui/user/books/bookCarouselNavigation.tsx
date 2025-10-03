import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Variant = "lg" | "sm";

const MAP = {
  lg: {
    className: "xl:h-[300px]  lg:h-[225px] ",
    positionLeft: "left-[-20px]",
    positionRight: "right-[-5px]",
  },
  sm: {
    className: "xl:h-[207px]   lg:h-[180px] ",
    positionLeft: "left-[-20px]",
    positionRight: "right-[-12px]",
  },
} as const;

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  width?: string | number;
  height?: string | number;
  variant?: Variant;
}

export default function BookCarouselNavigation({
  currentSlide,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  variant,
}: SlideNavigationProps) {
  const s = MAP[variant ?? "lg"];
  const showPrevButton = currentSlide > 0;
  const showNextButton = currentSlide < totalSlides - 1;

  return (
    <div
      className={`absolute top-0 md:flex justify-between items-center z-20 pointer-events-none hidden xl:h-[300px]   ${
        s.className
      } ${showPrevButton ? s.positionLeft : s.positionRight}`}
    >
      <div className="flex justify-start">
        {showPrevButton && (
          <Button
            variant="outline"
            size="icon"
            className="bg-white/90 hover:bg-white border-gray-200 shadow-lg rounded-full  cursor-pointer  pointer-events-auto"
            onClick={onPrevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex justify-end">
        {showNextButton && (
          <Button
            variant="outline"
            size="icon"
            className="bg-white/90 hover:bg-white border-gray-200 shadow-lg rounded-full   cursor-pointer pointer-events-auto"
            onClick={onNextSlide}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
