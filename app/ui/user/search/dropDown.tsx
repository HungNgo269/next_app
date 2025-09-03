import React, { forwardRef } from "react";
import SugggestionList from "./suggestionList";
import HistoryList from "./historyList";
import EmptyState from "./emptyState";
import TrendingList from "./trendingList";

interface DropdownProps {
  query: string;
  suggestions: string[];
  history: string[];
  trending: string[];
  onSelect: (v: string) => void;
  onRemoveHistoryItem: (v: string) => void;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    { query, suggestions, history, trending, onSelect, onRemoveHistoryItem },
    ref
  ) => {
    const showSuggestions = !!query && suggestions.length > 0;
    const showHistory = !query && history.length > 0;
    const showTrending = !query && history.length === 0 && trending.length > 0;
    const showEmpty = !query && history.length === 0 && trending.length === 0;

    return (
      <div
        ref={ref}
        className="absolute top-full left-0 right-0 mt-2 
         bg-white rounded-xl shadow-xl z-[51] max-h-96 overflow-y-auto backdrop-blur-sm"
        style={{
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        role="listbox"
        aria-label="Search dropdown"
      >
        {showSuggestions && (
          <SugggestionList
            query={query}
            suggestions={suggestions}
            onSelect={onSelect}
          />
        )}

        {showHistory && (
          <HistoryList
            items={history}
            onSelect={onSelect}
            onRemove={onRemoveHistoryItem}
          />
        )}

        {showTrending && <TrendingList items={trending} onSelect={onSelect} />}

        {showEmpty && <EmptyState />}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";
export default Dropdown;
