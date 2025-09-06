import React, { forwardRef } from "react";
import SearchResultItem from "./searchResultItem";

interface DropdownProps {
  query: string;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(({ query }, ref) => {
  const showEmpty = !query;

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 right-0 mt-2 
         bg-white rounded-sm shadow-xl z-[51] max-h-96 overflow-y-auto backdrop-blur-sm px-4"
      style={{
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      role="listbox"
      aria-label="Search dropdown"
    >
      <SearchResultItem  book={}></SearchResultItem>
    </div>
  );
});

Dropdown.displayName = "Dropdown";
export default Dropdown;
