import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ISlide } from "@/app/interface/slide";

interface SlideContentProps {
  slides: ISlide[];
  currentSlide: number;
}

export default function SlideContent({
  slides,
  currentSlide,
}: SlideContentProps) {
  return (
    <div className="relative h-[450px] md:h-[500px] overflow-hidden">
      <div
        className="flex transition-transform duration-300 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative">
            <Link
              prefetch={true}
              href={slide.redirect_url}
              className="block w-full h-full group"
            >
              <div className="relative w-full h-full">
                <Image
                  src={slide.image_url}
                  alt={slide?.title || "slide name"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={slide.id === 1}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="text-primary-foreground p-8 md:p-12 max-w-2xl">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                      {slide.title}
                    </h2>
                    {slide.description && (
                      <p className="text-lg md:text-xl mb-6 opacity-90">
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
