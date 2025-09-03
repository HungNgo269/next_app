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
      {suggestions.map((s, index) => (
        <SuggestionItem
          key={index}
          icon={<Search size={16} className="text-primary mr-4" />}
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
