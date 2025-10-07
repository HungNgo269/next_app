"use client";
import React, { useMemo } from "react";
import ImageCard from "@/app/ui/share/image/imageCard";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useDebounce } from "@/app/hooks/useDebounce";

interface Props {
  query: string;
}

interface BookItem {
  id: number;
  name: string;
  author?: string;
  image_urls: string[];
  rating?: number;
}

export default function SearchResultItem({ query }: Props) {
  const q = useMemo(() => (query ?? "").trim(), [query]);
  const debounced = useDebounce(q, 300);

  const key = debounced
    ? `/api/search?q=${encodeURIComponent(debounced)}`
    : null;
  const { data, error, isLoading } = useSWR<{ items: BookItem[] }>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10_000,
    }
  );

  if (!debounced) return null;
  if (isLoading)
    return <div className="p-4 text-sm text-gray-500">Searching…</div>;
  if (error)
    return (
      <div className="p-4 text-sm text-destructive" role="alert">
        Failed to load results
      </div>
    );

  const results = data?.items ?? [];
  if (results.length === 0)
    return <div className="p-4 text-sm text-gray-500">No results</div>;

  return (
    <>
      {results.map((book) => (
        <Link
          key={book.id}
          prefetch={true}
          href={`/book/${book.id}`}
          className="block"
        >
          <div className="flex flex-row gap-4 p-4 hover:bg-background bg-background  border-b-gray-100 border-1  ">
            <div className="min-h-18 min-w-14 relative rounded-[8px] overflow-hidden">
              <ImageCard bookName={book.name} bookImage={book.image_urls[0]} />
            </div>
            <div className="flex flex-col justify-start ">
              <div className="font-semibold text-foreground">{book.name}</div>
              {book.author && (
                <div className="text-foreground text-sm">{book.author}</div>
              )}
              {book.rating && (
                <div className="text-foreground text-sm ">
                  Rating: {book.rating}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
