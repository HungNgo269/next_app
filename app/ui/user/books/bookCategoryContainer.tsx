"use client";
import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import CategorySelector from "./bookCategorySelector";
import { Category } from "@/app/interface/category";
import { Book } from "@/app/interface/book";
import { fetchMostViewedBookByCategoryActions } from "@/app/actions/bookActions";
import ViewMoreBookButton from "./viewMoreBookButton";
import { getcategorySlugById } from "@/app/constant/categories";
import BookCarousel from "./bookCarousel";

interface BookCategoryContainerProps {
  categories: Category[];
}

export default function BookCategoryContainer({
  categories,
}: BookCategoryContainerProps) {
  let defaultCategory = categories?.[0]?.id || 1;
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("classic");
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
  const displayBooks = useMemo(() => {
    return books;
  }, [books]);

  const dynamicTitle = useMemo(() => {
    const selectedCat = categories.find((cat) => cat.id === selectedCategory);
    return selectedCat?.title;
  }, [categories, selectedCategory]);

  const handleCategoryChange = useCallback((categoryId: number) => {
    setSelectedCategory(categoryId);
    const slug = getcategorySlugById(categoryId);
    setSelectedCategorySlug(slug);
  }, []);

  return (
    <div className="mt-6">
      <h1 className="text-xl font-semibold mb-2">{dynamicTitle}</h1>

      <div className="flex flex-col  gap-2">
        <div className="flex flex-row justify-between">
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          <ViewMoreBookButton
            url={`/book?tag=${selectedCategorySlug}`}
          ></ViewMoreBookButton>
        </div>

        <div className="">
          <BookCarousel books={books} variant="lg"></BookCarousel>
        </div>
      </div>
    </div>
  );
}
