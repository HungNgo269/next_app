import { fetchMostFollowBookByWeekAction } from "@/app/actions/rankingActions";
import { BookCard } from "@/app/interface/book";
import ImageCard from "../image/imageCard";

export default async function MostPopularSeries() {
  const books: BookCard[] = await fetchMostFollowBookByWeekAction();
  console.log("first", books);
  return (
    <div>
      <div>
        <span className="font-bold text-lg text-start">
          Most views series in{" "}
        </span>
      </div>

      <div className="space-y-3 mt-6">
        {books.map((book, index) => (
          <div key={book.id} className="flex flex-row items-center gap-2">
            <div className="relative w-[60px] h-[80px] overflow-hidden rounded-[4px] group">
              <ImageCard bookImage={book?.image_urls[0]} bookName={book.name} />
            </div>
            <div className="min-w-6 min-h-6 flex items-center justify-center text-lg font-bold text-black">
              {index + 1}
            </div>
            <div className="flex flex-col justify-between">
              <h4 className="text-sm font-semibold cursor-pointer truncate hover:underline max-w-[180px]">
                {book.name}
              </h4>
              <p className="text-sm hover:underline">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
