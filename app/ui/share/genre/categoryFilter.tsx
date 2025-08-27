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
import { useRouter } from "next/navigation";
interface CategoryFilterProps {
  currentGenre?: string;
}

export default function CategoryFilter({ currentGenre }: CategoryFilterProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleFormAction = (formData: FormData) => {
    const formDataEntries = Object.fromEntries(formData.entries());
    console.log("FormData fields:", formDataEntries);

    const category = formData.get("category")?.toString();
    console.log("Category:", category);

    startTransition(async () => {
      await router.push(`/book?tag=${category}`);
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
