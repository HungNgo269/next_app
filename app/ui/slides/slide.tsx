"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { ISlide } from "@/app/interface/slide";
const Slide = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      const result = await fetch("api/upload/slides");
      const data: ISlide[] = await result.json();
      setImages(data.map((item) => item.image_url));
      console.log(images);
    };
    try {
      getData();
    } catch (error) {
      console.error("Error fetching slides:", error);
    }
  }, []);

  return (
    <div className="relative z-20">
      <div style={{ width: "100%", height: "450px" }}>
        <Swiper
          navigation={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet custom-bullet",
            bulletActiveClass:
              "swiper-pagination-bullet-active custom-bullet-active",
            renderBullet: (index, className) =>
              '<span class="' +
              className +
              '" data-slide="' +
              index +
              '"></span>',
          }}
          lazyPreloadPrevNext={3}
          lazyPreloaderClass="swiper-lazy-preloader"
          slidesPerView={1}
          loop={true}
          style={{ height: "100%" }}
          watchSlidesProgress={true}
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <img
                  src={src || "/placeholder.svg"}
                  alt={`Slide ${index}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
                {/* Gradient overlay chỉ áp dụng cho ảnh này */}
                <div className="absolute bg-gradient-to-t from-gray-950 w-full h-[120px] bottom-0 z-0 pointer-events-none"></div>
              </div>
              <div className="swiper-lazy-preloader"></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-pagination {
          bottom: 20px !important;
          right: 20px !important;
          left: auto !important;
          width: auto !important;
          text-align: right !important;
          z-index: 30 !important;
          display: flex !important;
          flex-direction: row !important;
          justify-content: flex-end !important;
        }

        .custom-bullet {
          width: 8px !important;
          height: 8px !important;
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 50% !important;
          margin: 0 3px !important;
          opacity: 1 !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
          z-index: 30 !important;
        }

        .custom-bullet-active {
          background: white !important;
          transform: scale(1.1) !important;
        }

        .swiper-pagination-bullet:hover {
          background: white !important;
          transform: scale(1.1) !important;
        }

        /* Navigation Arrow Styles */
        .swiper-button-next,
        .swiper-button-prev {
          width: 44px !important;
          height: 44px !important;
          background: rgba(255, 255, 255, 0.3) !important;
          backdrop-filter: blur(6px) !important;
          -webkit-backdrop-filter: blur(6px) !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
          z-index: 30 !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          border: solid 1px rgba(255, 255, 255, 0.3) !important;
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 12px !important;
          color: white !important;
          font-weight: bold !important;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(255, 255, 255, 0.4) !important;
        }

        .swiper-button-next.swiper-button-disabled,
        .swiper-button-prev.swiper-button-disabled {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
        }
      `}</style>
    </div>
  );
};

export default Slide;
