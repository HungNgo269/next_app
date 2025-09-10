import Link from "next/link";
import { BookCardProps } from "@/app/interface/book";
import ImageCard from "@/app/ui/share/image/imageCard";

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
    card: "w-[160px] h-[280px]",
    imgWrap: "w-[160px] h-[207px]",
    title: "text-[13px]",
    author: "text-[11px]",
  },
} as const;

export default function BookCard({
  book,
  variant = "lg",
}: {
  book: BookCardProps;
  variant?: Variant;
}) {
  const s = MAP[variant];
  return (
    <div className={`flex flex-col p-1 ${s.card}`}>
      <Link
        prefetch={true}
        href={`/book/${book.id}`}
        prefetch={false}
        aria-label={book.name}
      >
        <div
          className={`relative overflow-hidden rounded-[8px] group ${s.imgWrap}`}
        >
          <ImageCard
            bookImage={book.image_urls[0]}
            bookName={book.name}
            key={book.id}
          />
        </div>
      </Link>

      <div className="flex flex-col mt-3 h-fit justify-between">
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
        {book?.rating ? (
          <span
            className={`line-clamp-1 font-medium text-muted-foreground cursor-pointer w-fit ${s.author}`}
          >
            Rating: {book?.rating}
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
