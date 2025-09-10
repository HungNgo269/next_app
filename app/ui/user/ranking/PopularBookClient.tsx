"use client";

import { useState, useTransition } from "react";
import { TimeFrame } from "@/app/data/rankingData";
import { fetchPopularBookAction } from "@/app/actions/bookActions";
import { BookCardProps } from "@/app/interface/book";
import PopularBookFilter from "@/app/ui/user/ranking/popularBookFilter";
import { PopularBookSkeleton } from "@/app/ui/skeletons";
import PopularBookContent from "@/app/ui/user/ranking/popularBookContent";

interface PopularBookClientProps {
  initialBooks: BookCardProps[];
  initialTimeFilter: TimeFrame;
}

export default function PopularBookClient({
  initialBooks,
  initialTimeFilter,
}: PopularBookClientProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFrame>(initialTimeFilter);
  const [books, setBooks] = useState<BookCardProps[]>(initialBooks);
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = async (newFilter: TimeFrame) => {
    setTimeFilter(newFilter);

    startTransition(async () => {
      try {
        const fetchedBooks = await fetchPopularBookAction(newFilter);
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    });
  };

  return (
    <>
      <div className="flex flex-row gap-3 md:flex-col">
        <span className="font-bold text-lg text-start whitespace-nowrap">
          Most views book in
        </span>
        <PopularBookFilter
          value={timeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div className="space-y-3 mt-2">
        {isPending ? (
          <PopularBookSkeleton />
        ) : (
          <PopularBookContent books={books} />
        )}
      </div>
    </>
  );
}
