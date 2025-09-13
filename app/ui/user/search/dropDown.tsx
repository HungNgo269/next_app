"use client";
import React, { forwardRef } from "react";
import SearchResultItem from "@/app/ui/user/search/searchResultItem";

interface DropdownProps {
  query: string;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(({ query }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute top-full left-0 right-0 mt-2 
         bg-white rounded-sm shadow-xl z-[30] max-h-96 overflow-y-auto backdrop-blur-sm "
      style={{
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      role="listbox"
      aria-label="Search dropdown"
    >
      <SearchResultItem query={query}></SearchResultItem>
    </div>
  );
});

Dropdown.displayName = "Dropdown";
export default Dropdown;
