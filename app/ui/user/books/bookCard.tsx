"use client";

import Image from "next/image";
import Link from "next/link";
import { Book } from "@/app/interface/book";

type Variant = "lg" | "sm";
// cho 2 component kích thước khác nhau.
const MAP = {
  lg: {
    card: "w-[230px] h-[355px]",
    imgWrap: "w-[230px] h-[300px]",
    title: "text-sm",
    author: "text-xs",
  },
  sm: {
    card: "w-[160px] h-[259px]",
    imgWrap: "w-[160px] h-[207px]",
    title: "text-[13px]",
    author: "text-[11px]",
  },
} as const;

export default function BookCard({
  book,
  variant = "lg",
}: {
  book: Book;
  variant?: Variant;
}) {
  const s = MAP[variant];
  const src = book.image_urls?.[0];

  return (
    <div className={`flex flex-col p-1 ${s.card}`}>
      <Link href={`/book/${book.id}`} prefetch={false} aria-label={book.name}>
        <div
          className={`relative overflow-hidden rounded-[8px] group ${s.imgWrap}`}
        >
          <Image
            src={src}
            alt={book.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            priority={false}
          />
        </div>
      </Link>

      <div className="flex flex-col mt-3 h-[43px] justify-between">
        <span
          className={`line-clamp-1 font-semibold cursor-pointer w-fit hover:underline ${s.title}`}
        >
          {book.name}
        </span>
        <span
          className={`line-clamp-1 font-medium text-muted-foreground cursor-pointer w-fit hover:underline ${s.author}`}
        >
          {book.author}
        </span>
      </div>
    </div>
  );
}
