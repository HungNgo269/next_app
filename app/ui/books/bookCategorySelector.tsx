"use client";
import { Category } from "@/app/interface/category";
import { memo } from "react";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategorySelector = memo(function CategorySelector({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  return (
    <div className="flex flex-row justify-start items-center gap-1">
      {categories.map((category: Category) => (
        <div key={category.id}>
          <button
            onClick={() => onCategoryChange(category.id)}
            className={`${
              selectedCategory === category.id
                ? " text-green-500"
                : " text-gray-700"
            }`}
          >
            {category.name}
          </button>
        </div>
      ))}
    </div>
  );
});

export default CategorySelector;
