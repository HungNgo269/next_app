"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
// import "swiper/css/lazy";

const Slide = () => {
  const images = Array.from({ length: 7 }).map((_, i) => `/hero-desktop.png`);
  return (
    <div>
      <div style={{ width: "100%", height: "450px" }}>
        <Swiper
          modules={[Navigation]}
          navigation={true}
          // lazy={true}
          slidesPerView={1}
          loop={true}
          style={{ height: "100%" }}
          watchSlidesProgress={true}
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt={`Slide ${index}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="absolute bg-gradient-to-t from-gray-950 w-full h-[120px] bottom-0 z-10"></div>
    </div>
  );
};

export default Slide;
