import React from "react";
import { Search, ArrowUpLeft } from "lucide-react";
import SuggestionItem from "./suggestionItem";

export interface SuggestionsListProps {
  query: string;
  suggestions: string[];
  onSelect: (item: string) => void;
}

export default function SugggestionList({
  query,
  suggestions,
  onSelect,
}: SuggestionsListProps) {
  return (
    <div className="border-b border-gray-100">
      <div className="px-5 py-2 bg-gray-50">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Gợi ý tìm kiếm
        </span>
      </div>
      {suggestions.map((s, index) => (
        <SuggestionItem
          key={index}
          icon={<Search size={16} className="text-blue-500 mr-4" />}
          value={s}
          query={query}
          onClick={() => onSelect(s)}
          trailingIcon={
            <ArrowUpLeft
              size={14}
              className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          }
        />
      ))}
    </div>
  );
}
