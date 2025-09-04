"use client";
import { Category } from "@/app/interface/category";
import { memo } from "react";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: number;
  onCategoryChange: (categoryId: number) => void;
}

function CategorySelector({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  return (
    <div className="flex flex-row justify-start items-center gap-1 ">
      {categories.map((category: Category) => (
        <div key={category.id}>
          <button
            onClick={() => onCategoryChange(category.id)}
            className={`
              hover:cursor-pointer${
                selectedCategory === category.id
                  ? " text-primary"
                  : " text-foreground"
              }`}
          >
            {category.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default memo(CategorySelector);
