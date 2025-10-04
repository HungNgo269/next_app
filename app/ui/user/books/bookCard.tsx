import Link from "next/link";
import { BookCardProps } from "@/app/interface/book";
import ImageCard from "@/app/ui/share/image/imageCard";

type Variant = "lg" | "sm";
const MAP = {
  lg: {
    card: "xl:w-[230px]  lg:w-[170px]  w-[130px] h-fit",
    imgWrap:
      "xl:w-[230px] xl:h-[300px] lg:w-[170px] lg:h-[221px] w-[130px] h-[160px]",
    title: "text-sm",
    author: "text-xs",
  },
  sm: {
    card: "xl:w-[160px]  lg:w-[140px]  w-[120px] h-fit",
    imgWrap:
      "xl:w-[160px] xl:h-[207px] lg:w-[140px] lg:h-[182px] w-[120px] h-[160px]",
    title: "text-sm ",
    author: "text-xs",
  },
} as const;

export default function BookCard({
  book,
  variant = "lg",
}: {
  book: BookCardProps;
  variant?: Variant;
}) {
  const image = MAP[variant];
  return (
    <div className={`flex flex-col ${image.card}`}>
      <Link prefetch={true} href={`/book/${book.id}`} aria-label={book.name}>
        <div
          className={`relative overflow-hidden rounded-[8px] group ${image.imgWrap}`}
        >
          <ImageCard
            bookImage={book.image_urls[0]}
            bookName={book.name}
            key={book.id}
          />
        </div>
      </Link>

      <div className="flex flex-col mt-3 h-fit justify-between">
        <Link prefetch={true} href={`/book/${book.id}`} aria-label={book.name}>
          <span
            className={`line-clamp-1 font-semibold cursor-pointer w-fit hover:underline ${image.title}`}
          >
            {book.name}
          </span>
        </Link>

        <span
          className={`line-clamp-1 font-medium text-muted-foreground cursor-pointer w-fit hover:underline ${image.author}`}
        >
          {book.author}
        </span>
        {book?.rating ? (
          <span
            className={`line-clamp-1 font-medium text-muted-foreground cursor-pointer w-fit ${image.author}`}
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
