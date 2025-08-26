import React, { forwardRef } from "react";
import { X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  onFocus?: () => void;
  onEnter?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, onFocus, onEnter, onKeyDown }, ref) => {
    return (
      <div className="flex-1 flex items-center">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          className="w-full text-base bg-transparent placeholder:text-gray-500 px-4 border-none
           focus:outline-none focus:ring-0" //bỏ border shadcn
          aria-label="Search input"
        />
        {value && (
          <button
            onClick={onClear}
            className="p-2 hover:bg-gray-100 rounded-full mr-2 transition-colors"
            aria-label="Clear search"
            type="button"
          >
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
export default SearchInput;
