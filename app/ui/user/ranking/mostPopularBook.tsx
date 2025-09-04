"use client";
import { Book, BookCardProps } from "@/app/interface/book";
import Link from "next/link";
import ImageCard from "../../share/image/imageCard";
import PopularBookFilter from "./popularBookFilter";
import { sortTimeName } from "@/app/constant/categories";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function MostPopularBook() {
  const [books, setBooks] = useState<BookCardProps[]>([]);
  const [timeFilter, setTimeFilter] = useState<sortTimeName>("Today");
  const [loading, setLoading] = useState(true);
  const limit = 5;
  const { data, error, isLoading } = useSWR<Book[]>(
    `/api/book/popular-books?timeframe=${timeFilter}&limit=${limit}`,
    fetcher
  );
  console.log("check dât", data);
  const handleFilterChange = (newFilter: sortTimeName) => {
    setTimeFilter(newFilter);
  };

  if (loading) {
    return (
      <div>
        <div className="flex flex-row gap-2">
          <span className="font-bold text-lg text-start whitespace-nowrap">
            Most views book in
          </span>
          <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
        </div>
        <div className="space-y-3 mt-6">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex flex-row items-center gap-2 h-[80px]"
            >
              <div className="animate-pulse bg-gray-200 w-[60px] h-full rounded"></div>
              <div className="animate-pulse bg-gray-200 min-w-6 min-h-6 rounded"></div>
              <div className="flex flex-col justify-center h-full gap-2 flex-1">
                <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row gap-2">
        <span className="font-bold text-lg text-start whitespace-nowrap">
          Most views book in
        </span>
        <PopularBookFilter
          currentFilter={timeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="space-y-3 mt-6">
        {books.map((book: BookCardProps, index) => (
          <div
            key={book.id}
            className="flex flex-row items-center gap-2 h-[80px]"
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
            <div className="flex flex-col justify-center h-full">
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
