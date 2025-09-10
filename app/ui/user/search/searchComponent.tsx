"use client";
import React, { useRef, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import SearchInput from "@/app/ui/user/search/searchInput";
import Dropdown from "@/app/ui/user/search/dropDown";

export default function SearchComponent({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCompactOpen, setIsCompactOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = (searchQuery: string) => {
    const q = (searchQuery ?? "").trim();
    if (!q) return;

    setQuery(q);
    setIsOpen(false);
    if (compact) setIsCompactOpen(false);
    console.log("Searching for:", q);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") handleSearch(query);
    if (e.key === "Escape") {
      setIsOpen(false);
      if (compact) setIsCompactOpen(false);
    }
  };

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

  useEffect(() => {
    if (isCompactOpen && inputRef.current) inputRef.current.focus();
  }, [isCompactOpen]);

  const SearchUI = (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative">
        <div
          className={`flex items-center justify-center border-1 rounded-lg overflow-hidden bg-white transition-all duration-200 h-9
            ${isOpen ? "border-primary shadow-lg" : "border-border shadow-sm"}`}
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

        {isOpen && <Dropdown ref={dropdownRef} query={query} />}
      </div>
    </div>
  );
  //claude
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
