"use client";

import { getcategoryTitleBySlug } from "@/app/constant/categories";
import { useSearchParams } from "next/navigation";

export default function CategoryName() {
  const searchParam = useSearchParams();
  const slug = searchParam.get("tag");
  const categoryTitle = getcategoryTitleBySlug(slug ?? "");
  return (
    <span className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
      {categoryTitle}
    </span>
  );
}
