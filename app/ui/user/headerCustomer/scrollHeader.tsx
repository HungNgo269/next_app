"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ScrollHeaderProps {
  children: React.ReactNode; //header
}

export function ScrollHeader({ children }: ScrollHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const offSet = window.scrollY;
      if (offSet > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //cho nó chạy ở sau hook nếu ko muốn lỗi chênh hook
  if (pathname.includes("/chapter")) {
    return null;
  }
  return (
    // <div
    //   className={`${
    //     scrolled
    //       ? "bg-[linear-gradient(180deg,rgba(18,18,20,0.8))]"
    //       : "bg-[linear-gradient(180deg,rgba(18,18,20,0.68),transparent)]"
    //   } h-[66px] fixed top-0 left-0 w-full z-[21] text-white`}
    // >
    //   {children}
    // </div>
    <div
      className={`${
        scrolled
          ? "bg-[linear-gradient(180deg,#fffc)]"
          : "bg-[linear-gradient(180deg,#fffc,transparent)]"
      } h-[66px] fixed top-0 left-0 w-full z-[21] text-black border-b-black`}
    >
      {children}
    </div>
  );
}
