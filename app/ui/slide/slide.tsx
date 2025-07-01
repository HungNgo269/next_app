"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Slide = () => {
  const images = Array.from({ length: 7 }).map((_, i) => `/jawed.png`);

  return (
    <div className="relative">
      <div style={{ width: "100%", height: "450px" }}>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={true}
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
          loop={false}
          style={{ height: "100%" }}
          watchSlidesProgress={true}
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src || "/placeholder.svg"}
                alt={`Slide ${index}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
              <div className="swiper-lazy-preloader"></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="absolute bg-gradient-to-t from-gray-950 w-full h-[120px] bottom-0 z-10 pointer-events-none"></div>

      <style jsx global>{`
        .swiper-pagination {
          bottom: 20px !important;
          right: 20px !important;
          left: auto !important;
          width: auto !important;
          text-align: right !important;
          z-index: 20 !important;
          display: flex !important;
          flex-direction: row !important;
          justify-content: flex-end !important;
        }

        .custom-bullet {
          width: 8px !important;
          height: 8px !important;
          background: #fff;
          border-radius: 50% !important;
          margin: 0 3px !important;
          opacity: 1 !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
        }

        .custom-bullet-active {
          background: white !important;
          transform: scale(1.3) !important;
          border: 1px solid white !important;
        }

        .swiper-pagination-bullet:hover {
          background: white;

          transform: scale(1.1) !important;
        }

        /* Navigation Arrow Styles */
        .swiper-button-next,
        .swiper-button-prev {
          width: 44px !important;
          height: 44px !important;
          background: rgba(255, 255, 255, 0.3) !important; /* Màu nền mờ nhẹ */
          backdrop-filter: blur(6px) !important;
          -webkit-backdrop-filter: blur(6px) !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
          z-index: 20 !important;
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 16px !important;
          color: blue !important; /* Màu mũi tên */
          font-weight: bold !important;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(
            255,
            255,
            255,
            0.6
          ) !important; /* Mờ hơn khi hover */
          transform: scale(1.1) !important;
        }

        .swiper-button-next.swiper-button-disabled,
        .swiper-button-prev.swiper-button-disabled {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
        }

        .swiper-button-next.swiper-button-disabled:hover,
        .swiper-button-prev.swiper-button-disabled:hover {
          transform: none !important;
          background: red !important;
        }
      `}</style>
    </div>
  );
};

export default Slide;
