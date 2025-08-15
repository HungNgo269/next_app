import { Search } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="py-12 text-center text-gray-500">
      <Search size={40} className="mx-auto mb-3 text-gray-300" />
    </div>
  );
}
