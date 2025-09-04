"use client";

import { sort_OPTIONS_time, sortTimeName } from "@/app/constant/categories";

interface props {
  option: sortTimeName;
}

export default function PopularBookFilter({ filterOption }: props) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative min-w-[180px] flex flex-row gap-1">
        {sort_OPTIONS_time.map((option) => (
          <span
            key={option.id}
            onClick={() => !isPending && handleSort(option.name)}
            className={`cursor-pointer select-none text-xs  transition-all duration-200
      ${
        filterOption === option.name
          ? " text-primary"
          : " text-muted-foreground"
      }`}
          >
            {option.name}
          </span>
        ))}
      </div>
    </div>
  );
}
