"use client";

import { sort_OPTIONS_time } from "@/app/constant/categories";
import { TimeFrame } from "@/app/data/rankingData";

interface PopularBookFilterProps {
  value: TimeFrame;
  onFilterChange: (timeframe: TimeFrame) => void;
}

export default function PopularBookFilter({
  value,
  onFilterChange,
}: PopularBookFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative min-w-[180px] flex flex-row gap-1">
        {sort_OPTIONS_time.map((option) => (
          <span
            key={option.id}
            onClick={() => onFilterChange(option.name as TimeFrame)}
            className={`cursor-pointer select-none text-xs transition-all duration-200
              ${
                value === option.name ? "text-primary" : "text-muted-foreground"
              }
            `}
          >
            {option.name}
          </span>
        ))}
      </div>
    </div>
  );
}
