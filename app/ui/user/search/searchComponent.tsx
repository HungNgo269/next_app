"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import SearchInput from "./searchInput";
import Dropdown from "./dropDown";

const staticSuggestions: string[] = [
  "React hooks useEffect",
  "React hooks useState",
  "React hooks custom",
  "React context tutorial",
  "React performance optimization",
  "JavaScript async await",
  "JavaScript promises",
  "JavaScript array methods",
  "CSS flexbox guide",
  "CSS animations",
  "Node.js authentication",
  "Node.js REST API",
  "Python pandas tutorial",
  "Python data visualization",
];

const trendingSearches: string[] = [
  "AI programming 2024",
  "Web development trends",
  "Mobile app design",
  "Database optimization",
  "Cloud computing basics",
];

export default function SearchComponent({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false); // your dropdown open
  const [isCompactOpen, setIsCompactOpen] = useState<boolean>(false); // mobile overlay

  // ✅ your search history kept intact
  const [searchHistory, setSearchHistory] = useState<string[]>([
    "React hooks tutorial",
    "JavaScript ES6 features",
    "CSS Grid layout",
    "Node.js express",
    "Python machine learning",
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const suggestions = useMemo<string[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return staticSuggestions
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    const q = (searchQuery ?? "").trim();
    if (!q) return;

    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item !== q);
      return [q, ...filtered].slice(0, 10);
    });

    setQuery(q);
    setIsOpen(false);
    if (compact) setIsCompactOpen(false); // close overlay on mobile after searching
    console.log("Searching for:", q);
  };

  const removeFromHistory = (itemToRemove: string) =>
    setSearchHistory((prev) => prev.filter((item) => item !== itemToRemove));

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") handleSearch(query);
    if (e.key === "Escape") {
      setIsOpen(false);
      if (compact) setIsCompactOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!dropdownRef.current || !inputRef.current) return;
      const clickedOutside =
        !dropdownRef.current.contains(target) &&
        !inputRef.current.contains(target);
      if (clickedOutside) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autofocus when opening compact overlay
  useEffect(() => {
    if (isCompactOpen && inputRef.current) inputRef.current.focus();
  }, [isCompactOpen]);

  // ---- shared search UI (your original structure) ----
  const SearchUI = (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative">
        <div
          className={`flex items-center justify-center border-2 rounded-lg overflow-hidden bg-white transition-all duration-200 h-9
            ${
              isOpen ? "border-blue-500 shadow-lg" : "border-gray-300 shadow-sm"
            }`}
        >
          <SearchInput
            ref={inputRef}
            value={query}
            onChange={setQuery}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={() => handleSearch(query)}
            className="mr-3 transition-all duration-200 text-black"
            aria-label="Search"
            type="button"
          >
            <Search size={20} />
          </button>
        </div>

        {isOpen && (
          <Dropdown
            ref={dropdownRef}
            query={query}
            suggestions={suggestions}
            history={searchHistory}
            trending={trendingSearches}
            onSelect={handleSearch}
            onRemoveHistoryItem={removeFromHistory}
          />
        )}
      </div>
    </div>
  );

  // ---- compact mode (mobile/tablet): icon -> full-screen overlay) ----
  if (compact) {
    return (
      <>
        <button
          onClick={() => setIsCompactOpen(true)}
          className="p-2 text-gray-700"
          aria-label="Open search"
        >
          <Search className="h-5 w-5" />
        </button>

        {isCompactOpen && (
          <div className="fixed inset-0 z-50">
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => {
                setIsOpen(false);
                setIsCompactOpen(false);
              }}
            />
            {/* panel */}
            <div className="absolute inset-x-0 top-0 bg-white p-3 shadow-lg rounded-b-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Search</span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsCompactOpen(false);
                  }}
                  className="p-1"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {SearchUI}
            </div>
          </div>
        )}
      </>
    );
  }

  return SearchUI;
}
