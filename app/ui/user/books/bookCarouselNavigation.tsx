import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Variant = "lg" | "sm";

const MAP = {
  lg: { width: "1238px", height: "300px" },
  sm: { width: "840px", height: "300px" },
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
  const s = MAP[variant];
  const showPrevButton = currentSlide > 0;
  const showNextButton = currentSlide < totalSlides - 1;

  return (
    <div
      className={`absolute top-1/2 translate-y-1/2 flex justify-between items-center z-20 pointer-events-none 
        ${s.height}  ${s.width} ${
        showPrevButton ? "left-[-17]" : "right-[-17]"
      } }`}
    >
      <div className="flex justify-start">
        {showPrevButton && (
          <Button
            variant="outline"
            size="icon"
            className="bg-white/90 hover:bg-white border-gray-200 shadow-lg rounded-full pointer-events-auto"
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
            className="bg-white/90 hover:bg-white border-gray-200 shadow-lg rounded-full pointer-events-auto"
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
