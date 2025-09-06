// hooks/usePopularBooks.ts
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { Book } from "../interface/book";
import { TimeFrame } from "../data/rankingData";

export const usePopularBooks = (
  timeframe: TimeFrame = "Today",
  limit: number = 5
) => {
  const { data, error, isLoading, mutate } = useSWR<Book[]>(
    `/api/books/popular?timeframe=${timeframe}&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 5 * 60 * 1000,
      dedupingInterval: 30 * 1000,
    }
  );

  return {
    books: data,
    isLoading,
    error,
    mutate, // Để manual revalidate
  };
};
