import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ViewMoreBookButton {
  url: string;
  context?: string;
}

export default function ViewMoreBookButton({
  url,
  context,
}: ViewMoreBookButton) {
  return (
    <Link href={url}>
      <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
        {context ? (
          <span className="text-sm mr-1 line-clamp-1 w-fit">
            View More Chapter
          </span>
        ) : (
          <span className="text-sm mr-1 line-clamp-1 w-fit">
            View More Books
          </span>
        )}
        <ChevronRight className="w-4 h-4" />
      </button>
    </Link>
  );
}
