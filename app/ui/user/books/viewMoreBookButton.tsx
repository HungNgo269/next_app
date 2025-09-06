import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

interface ViewMoreBookButtonProps {
  url: string;
  context?: string;
}

function ViewMoreBookButton({ url, context }: ViewMoreBookButtonProps) {
  return (
    <Link href={url} className=" ml-auto">
      <button className="flex items-center text-foreground hover:text-primary transition-colors cursor-pointer">
        {context === "chapter" ? (
          <span className="text-sm mr-1 line-clamp-1 w-fit ">
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
export default memo(ViewMoreBookButton);
