"use client";
import { Book } from "@/app/interface/book";
import { Category } from "@/app/interface/category";
import { useState, useMemo } from "react";
import BookOrderedList from "./bookOrderedList";

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
    const selectedCategory = categories[activeCategory];
    return books
      .filter((book) => book.category_id === selectedCategory?.id)
      .slice(0, 5);
  }, [books, categories, activeCategory]);

  const handleCategoryClick = (index: number) => {
    setActiveCategory(index);
    console.log(activeCategory);
    console.log("first,", filteredBooks);
  };
  console.log("cẳe", filteredBooks);
  return (
    <>
      <div className="flex flex-row mr-auto mt-3 gap-2 text-gray-700 text-sm">
        {categories.map((category: Category, index) => (
          <span
            key={category.id}
            onClick={() => handleCategoryClick(index)}
            className={`cursor-pointer ${
              activeCategory === index ? "text-green-400" : ""
            }`}
          >
            {category.name}
          </span>
        ))}
      </div>

      <BookOrderedList books={books} />
    </>
  );
}
