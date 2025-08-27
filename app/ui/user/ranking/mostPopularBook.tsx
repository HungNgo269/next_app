import { fetchMostFollowBookAllTimeAction } from "@/app/actions/rankingActions";
import { BookCard, BookCardProps } from "@/app/interface/book";
import Link from "next/link";
import ImageCard from "../../share/image/imageCard";
import { FetchMostFollowBookAllTime } from "@/app/data/rankingData";

export default async function MostPopularBook() {
  const books: BookCardProps[] = await FetchMostFollowBookAllTime();
  console.log("it did rerender", books);
  return (
    <div>
      <div>
        <span className="font-bold text-lg text-start">
          Most views book in{" "}
        </span>
      </div>

      <div className="space-y-3 mt-6">
        {books.map((book: BookCardProps, index) => (
          <div
            key={book.id}
            className="flex flex-row items-center gap-2 h-[80px] "
          >
            <Link
              href={`book/${book.id}`}
              className="relative w-[60px] h-full overflow-hidden rounded-[4px] group"
            >
              <ImageCard bookImage={book?.image_urls[0]} bookName={book.name} />
            </Link>
            <div className="min-w-6 min-h-6 flex items-center justify-center text-lg font-bold text-black">
              {index + 1}
            </div>
            <div className="flex flex-col  justify-center h-full">
              <Link
                href={`book/${book.id}`}
                className="text-sm font-semibold cursor-pointer truncate hover:underline max-w-[180px]"
              >
                {book.name}
              </Link>
              <Link href={`${book.author}`} className="text-sm hover:underline">
                {book.author}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
