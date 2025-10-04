"use client";
// dùng cho screen <lg , brake point theo tailwind sm48,md768
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";

export default function Swipper() {
  return (
    <div className="w-full px-4 py-8">
      <Swiper
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
        }}
      >
        <SwiperSlide>
          <div className="bg-blue-500 text-white p-8 rounded-lg h-48 flex items-center justify-center">
            Slide 1
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-green-500 text-white p-8 rounded-lg h-48 flex items-center justify-center">
            Slide 2
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-red-500 text-white p-8 rounded-lg h-48 flex items-center justify-center">
            Slide 3
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-yellow-500 text-white p-8 rounded-lg h-48 flex items-center justify-center">
            Slide 4
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
