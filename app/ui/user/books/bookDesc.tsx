"use client";
import { useState } from "react";

type BookDescProps = {
  content?: string | null;
};

export default function BookDesc({ content }: BookDescProps) {
  const safeContent = content ?? "";
  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(!show);
  };

  return (
    <span className=" text-secondary-foreground leading-relaxed text-sm sm:text-base">
      {show ? (
        <>
          {safeContent}
          <span
            onClick={handleShow}
            className="text-info hover:underline cursor-pointer ml-1"
          >
            show less
          </span>
        </>
      ) : (
        <>
          <span className="line-clamp-3">{safeContent}</span>
          <span
            onClick={handleShow}
            className="text-info hover:underline cursor-pointer ml-1"
          >
            show more
          </span>
        </>
      )}
    </span>
  );
}
