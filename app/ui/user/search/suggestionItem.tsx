import { highlightMatch } from "@/lib/utils/highlightMatch";
import React from "react";

interface SuggestionItemProps {
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  value: string;
  query?: string;
  onClick?: () => void;
}
export default function SuggestionItem({
  icon,
  trailingIcon,
  value,
  query,
  onClick,
}: SuggestionItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center px-5 py-3 hover:bg-primary/10 cursor-pointer group transition-colors"
      role="option"
    >
      {icon}
      <span className="flex-1 text-sm text-gray-700">
        {query ? highlightMatch(value, query) : value}
      </span>
      {trailingIcon}
    </div>
  );
}
