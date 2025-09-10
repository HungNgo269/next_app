import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

interface ViewMoreBookButtonProps {
  url: string;
  context?: string;
}

function ViewMoreBookButton({ url, context }: ViewMoreBookButtonProps) {
  return (
    <Link prefetch={true} href={url} className=" ml-auto">
      <button className="flex items-center text-foreground hover:text-primary transition-colors cursor-pointer">
        {context === "chapter" ? (
          <span className="flex flex-row text-foreground mr-1 line-clamp-1 w-fit  ">
            <span className="hidden sm:flex">View</span>&nbsp;
            <span className="block">More</span>&nbsp;
            <span className="hidden sm:flex"> Chapter</span>
          </span>
        ) : (
          <span className="flex flex-row text-foreground mr-1 line-clamp-1 w-fit  ">
            <span className="hidden sm:flex">View</span>&nbsp;
            <span className="block">More</span>&nbsp;
            <span className="hidden sm:flex"> Books</span>
          </span>
        )}
        <ChevronRight className="w-4 h-4" />
      </button>
    </Link>
  );
}
export default memo(ViewMoreBookButton);
