"use client";
import { memo } from "react";
import BookCard from "./bookCard";
import { Book } from "@/app/interface/book";

interface BestSellerListProps {
  books: Book[];
  loading: boolean;
  error: string;
  selectedCategoryName?: string;
}
const bestSellerList = memo(function bestSellerList({
  books,
  loading,
  error,
  selectedCategoryName,
}: BestSellerListProps) {
  if (loading) {
    return (
      <div className="">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="">
        <div className="text-center text-red-600">
          <p>Lỗi: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {books.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>Không có sách nào trong danh mục này</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5  gap-1">
          {books.map((book: Book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
});
export default bestSellerList;
