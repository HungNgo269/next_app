"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import CategorySelector from "@/app/ui/user/books/bookCategorySelector";
import { Category } from "@/app/interface/category";
import { Book } from "@/app/interface/book";
import { fetchMostViewedBookByCategoryActions } from "@/app/actions/bookActions";
import ViewMoreBookButton from "@/app/ui/user/books/viewMoreBookButton";
import { getcategorySlugById } from "@/app/constant/categories";
import BookCarousel from "@/app/ui/user/books/bookCarousel";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooks = useCallback(async (categoryId: number) => {
    if (!categoryId) return;
    setLoading(true);
    setError("");
    setBooks([]);
    try {
      const response = await fetchMostViewedBookByCategoryActions(categoryId);
      console.log("yeah");
      if (!response) throw new Error("Failed to fetch category");
      setBooks(response as unknown as Book[]);
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
    <div className="mt-6 w-full">
      <span className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
        {dynamicTitle}
      </span>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row justify-between w-full gap-2">
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          <ViewMoreBookButton
            url={`/book?tag=${selectedCategorySlug}&page=1`}
          />
        </div>

        <BookCarousel books={books} variant="lg" isLoading={loading} />
      </div>
    </div>
  );
}
