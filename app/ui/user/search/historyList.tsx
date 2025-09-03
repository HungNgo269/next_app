import React from "react";
import { Clock, X } from "lucide-react";
interface HistoryListProps {
  items: string[];
  onSelect: (item: string) => void;
  onRemove: (item: string) => void;
}

export default function HistoryList({
  items,
  onSelect,
  onRemove,
}: HistoryListProps) {
  return (
    <div className="py-2" aria-label="Search history">
      {items.map((item, i) => (
        <div
          key={`${item}-${i}`}
          className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer group"
          onClick={() => onSelect(item)}
          role="option"
        >
          <Clock size={16} className="text-gray-400 mr-3" />
          <span className="flex-1 text-sm">{item}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item);
            }}
            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded-full transition-all"
            aria-label={`Remove ${item} from history`}
            type="button"
          >
            <X size={14} className="text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  );
}
