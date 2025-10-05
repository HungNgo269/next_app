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
    <span className=" text-foreground leading-relaxed text-sm sm:text-base">
      {show ? (
        <>
          <span>
            {safeContent}
            <span
              onClick={handleShow}
              className="text-info hover:underline cursor-pointer ml-1"
            >
              show less
            </span>
          </span>
        </>
      ) : (
        <>
          <span>
            <span className="line-clamp-3">{safeContent}</span>
            <span
              onClick={handleShow}
              className="text-info hover:underline cursor-pointer ml-1 inline"
            >
              show more
            </span>
          </span>
        </>
      )}
    </span>
  );
}
