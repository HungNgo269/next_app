"use client";

import { category_OPTIONS } from "@/app/constant/categories";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  currentGenre?: string;
}

export default function CategoryFilter({ currentGenre }: CategoryFilterProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (newCategory: string) => {
    startTransition(async () => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tag", newCategory);
      const currentSort = searchParams.get("sort");
      if (currentSort) {
        params.set("sort", currentSort);
      }
      await router.push(`/book?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative min-w-[180px]">
        <Select
          defaultValue={currentGenre}
          onValueChange={handleCategoryChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              {category_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
