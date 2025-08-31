"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { sortOptions, sortSlug } from "@/app/constant/categories";

interface Props {
  currentSort: string;
}

export default function SortSelection({ currentSort }: Props) {
  const [selectedSort, setSelectedSort] = useState<sortSlug>(currentSort);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (newSort: sortSlug) => {
    setSelectedSort(newSort);

    startTransition(async () => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", newSort);
      const currentTag = searchParams.get("tag");
      if (currentTag) {
        params.set("tag", currentTag);
      }
      await router.push(`/book?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {sortOptions.map((option) => (
        <Button
          key={option.id}
          variant={selectedSort === option.slug ? "default" : "outline"}
          size="sm"
          onClick={() => handleSort(option.slug)}
          disabled={isPending}
          className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
            selectedSort === option.slug
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {option.name}
        </Button>
      ))}
    </div>
  );
}
