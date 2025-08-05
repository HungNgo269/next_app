"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import CategorySelector from "./bookCategorySelector";
import BookList from "./bestSellerList";
import { Category } from "@/app/interface/category";
import { Book } from "@/app/interface/book";
import { fetchCategoryAction } from "@/app/actions/categoryActions";
import { fetchMostViewedBookByCategoryActions } from "@/app/actions/bookActions";

interface BookCategoryContainerProps {
  categories: Category[];
}

export default function BookCategoryContainer({
  categories,
}: BookCategoryContainerProps) {
  let defaultCategory = categories?.[0]?.id || "cat-001";
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBooks = useCallback(async (categoryId: string) => {
    if (!categoryId) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetchMostViewedBookByCategoryActions(categoryId);
      if (!response) throw new Error("Failed to fetch category");
      setBooks(response);
    } catch (err: unknown) {
      let error = err as Error;
      setError(error.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchBooks(selectedCategory);
    }
  }, [selectedCategory, fetchBooks]);
  // Memoize filtered books (nếu có thêm filter logic)
  const displayBooks = useMemo(() => {
    // Có thể thêm logic filter, sort ở đây nếu cần
    return books;
  }, [books]);

  // Memoize dynamic title based on selected category
  const dynamicTitle = useMemo(() => {
    const selectedCat = categories.find((cat) => cat.id === selectedCategory);
    return selectedCat?.title;
  }, [categories, selectedCategory]);

  // Handler để thay đổi category
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  return (
    <div className="mt-6">
      <h1 className="text-xl font-semibold mb-2">{dynamicTitle}</h1>

      <div className="flex flex-col  gap-2">
        <div className="">
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        <div className="">
          <BookList
            books={displayBooks}
            loading={loading}
            error={error}
            selectedCategoryName={
              categories.find((c) => c.id === selectedCategory)?.name
            }
          />
        </div>
      </div>
    </div>
  );
}
