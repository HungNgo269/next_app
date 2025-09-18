import React, { forwardRef } from "react";

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
  onEnter?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onFocus, onEnter, onKeyDown }, ref) => {
    return (
      <div className="flex-1 flex items-center">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          className="w-full text-base bg-transparent placeholder:text-accent-foreground px-4 border-none
           focus:outline-none focus:ring-0"
          aria-label="Search input"
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
export default SearchInput;
