import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
interface SlideContentProps {
  slides: SlideSlide[];
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
            <Link href={slide.items.link} className="block w-full h-full group">
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
    </div>
  );
}
