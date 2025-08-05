"use client";

import { Book } from "@/app/interface/book";
import { Category } from "@/app/interface/category";
import { useState } from "react";
import BookCard from "./bookCard";

interface BookOrderedListProps {
  books: Book[];
}

export default function BookOrderedList({ books }: BookOrderedListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = () => {
    setCurrentIndex(1);
  };

  const prevSlide = () => {
    setCurrentIndex(0);
  };
  return (
    <div className="grid grid-cols-5 gap-1 mt-3">
      {books.length > 0
        ? books.map((book: Book) => <BookCard key={book.id} book={book} />)
        : ""}
    </div>
  );
}
