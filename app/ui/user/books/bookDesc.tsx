"use client";
import { useState } from "react";

export default function BookDesc({ content }: { content: string }) {
  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(!show);
  };

  return (
    <span className="text-gray-700 leading-relaxed text-sm sm:text-base">
      {show ? (
        <>
          {content}
          <span
            onClick={handleShow}
            className="text-blue-500 hover:underline cursor-pointer ml-1"
          >
            show less
          </span>
        </>
      ) : (
        <>
          <span className="line-clamp-3">{content}</span>
          <span
            onClick={handleShow}
            className="text-blue-500 hover:underline cursor-pointer ml-1"
          >
            show more
          </span>
        </>
      )}
    </span>
  );
}
