"use client";

import { category_OPTIONS } from "@/app/constant/categories";
import { useTransition } from "react";
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
  onCategoryChange: (formData: FormData) => Promise<void>; // server action
}

export default function CategoryFilter({
  currentGenre,
  onCategoryChange,
}: CategoryFilterProps) {
  const [isPending, startTransition] = useTransition();

  const handleFormAction = (formData: FormData) => {
    startTransition(async () => {
      await onCategoryChange(formData);
    });
  };

  return (
    <div className="flex items-center gap-3">
      <form action={handleFormAction}>
        <div className="relative min-w-[180px]">
          <input type="hidden" name="category" value={currentGenre} />

          <Select
            defaultValue={currentGenre}
            onValueChange={(value) => {
              const form = document.querySelector("form") as HTMLFormElement;
              const input = form.querySelector<HTMLInputElement>(
                "input[name='category']"
              );
              if (input) input.value = value;
              form?.requestSubmit();
            }}
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
      </form>
    </div>
  );
}
