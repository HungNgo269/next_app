import React from "react";
import { TrendingUp } from "lucide-react";

export interface TrendingListProps {
  items: string[];
  onSelect: (item: string) => void;
}
export default function TrendingList({ items, onSelect }: TrendingListProps) {
  return (
    <div>
      <div className="px-5 py-2 bg-gray-50">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Tìm kiếm thịnh hành
        </span>
      </div>
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => onSelect(item)}
          className="flex items-center px-5 py-3 hover:bg-orange-50 cursor-pointer group transition-colors"
          role="option"
        >
          <TrendingUp size={16} className="text-orange-500 mr-4" />
          <span className="flex-1 text-sm text-gray-700">{item}</span>
          <div className="w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      ))}
    </div>
  );
}
