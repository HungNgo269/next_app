"use client";
import { Book } from "@/app/interface/book";
import { Category } from "@/app/interface/category";
import { useState, useMemo } from "react";
import BookCard from "./bookCard";

interface BooksWithNavigationProps {
  books: Book[];
  categories: Category[];
}

export default function BooksWithNavigation({
  books,
  categories,
}: BooksWithNavigationProps) {
  const [activeCategory, setActiveCategory] = useState(0);

  const filteredBooks = useMemo(() => {
    if (activeCategory === 0) {
      return books.slice(0, 5);
    }

    const selectedCategory = categories[activeCategory - 1];
    return books
      .filter((book) => book.category_id === selectedCategory?.id)
      .slice(0, 5);
  }, [books, categories, activeCategory]);

  const handleCategoryClick = (index: number) => {
    setActiveCategory(index);
  };
  return (
    <>
      <div className="flex flex-row mr-auto mt-3 gap-2 text-gray-700 text-sm">
        <span
          onClick={() => handleCategoryClick(0)}
          className={`cursor-pointer ${
            activeCategory === 0 ? "text-green-400" : ""
          }`}
        >
          All
        </span>

        {categories.map((category: Category, index) => (
          <span
            key={category.id}
            onClick={() => handleCategoryClick(index + 1)}
            className={`cursor-pointer ${
              activeCategory === index + 1 ? "text-green-400" : ""
            }`}
          >
            {category.name}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1 mt-3">
        {filteredBooks.length > 0
          ? filteredBooks.map((book: Book) => (
              <BookCard key={book.id} book={book} />
            ))
          : ""}
      </div>
    </>
  );
}
