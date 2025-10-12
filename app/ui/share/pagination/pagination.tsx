"use client";

import { Input } from "@/components/ui/input";
import { generatePagination } from "@/lib/utils/generatePagination";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useRef, useState } from "react";
interface props {
  totalPages: number;
  hashUrl?: string;
}
export default function Pagination({ totalPages, hashUrl }: props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}${hashUrl ? `#${hashUrl}` : ""}`;
  };

  const allPages = generatePagination(currentPage, totalPages);
  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex  gap-1">
        {allPages.map((page, index) => {
          let position: "first" | "last" | "single" | "middle" | undefined;

          if (index === 0) position = "first";
          if (index === allPages.length - 1) position = "last";
          if (allPages.length === 1) position = "single";
          if (page === "...") position = "middle";

          return (
            <PaginationNumber
              key={`${page}-${index}`}
              href={createPageURL(page)}
              totalPages={totalPages}
              page={page}
              pathname={pathname}
              searchParams={searchParams}
              position={position}
              isActive={currentPage === page}
              hashUrl={hashUrl}
            />
          );
        })}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
  totalPages,
  searchParams,
  pathname,
  hashUrl,
}: {
  page: number | string;
  href: string;
  position?: "first" | "last" | "middle" | "single";
  isActive: boolean;
  totalPages: number;
  searchParams: ReadonlyURLSearchParams;
  pathname: string;
  hashUrl?: string;
}) {
  const [openInput, setOpenInput] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleNavigate = () => {
    const pageNum = parseInt(ref.current?.value || "");
    if (pageNum >= 1 && pageNum <= totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set("page", pageNum.toString());
      router.push(
        `${pathname}?${params.toString()}${hashUrl ? `#${hashUrl}` : ""}`
      );
    }
    setOpenInput(false);
  };
  const handleBlur = () => {
    handleNavigate();
  };
  useEffect(() => {
    const focus = () => {
      ref?.current?.focus();
    };
    if (openInput) {
      focus();
    }
  }, [openInput]);
  const className = clsx(
    "flex h-10 w-10 items-center justify-center font-semibold text-sm rounded",
    {
      "z-10 bg-primary border-primary text-primary-foreground hover:brightness-90":
        isActive,
      "hover:bg-gray-200 bg-background hover:cursor-pointer ": !isActive,
    }
  );
  if (position === "middle" && !isActive) {
    return (
      <>
        {openInput === true ? (
          <div className="h-10 w-20">
            <Input
              className="w-full h-full bg-none border-none"
              id="pageNumber"
              name="pageNumber"
              ref={ref}
              onBlur={handleBlur}
              type="number"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNavigate();
                }
                if (e.key === "Escape") {
                  setOpenInput(false);
                }
              }}
            ></Input>
          </div>
        ) : (
          <div
            onClick={() => {
              setOpenInput(true);
            }}
            className={className}
          >
            {page}{" "}
          </div>
        )}
      </>
    );
  }
  if (isActive || position === "middle") {
    return <div className={className}>{page}</div>;
  }
  if (!isActive) {
    return (
      <Link prefetch={true} href={href} className={className}>
        {page}
      </Link>
    );
  }
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center rounded-md ",
    {
      "pointer-events-none text-gray-300": isDisabled,
      "hover:bg-gray-100": !isDisabled,
      "mr-2 md:mr-4": direction === "left",
      "ml-2 md:ml-4": direction === "right",
    }
  );

  const icon =
    direction === "left" ? (
      <ArrowLeftIcon className="w-4 " />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link prefetch={true} className={className} href={href}>
      {icon}
    </Link>
  );
}
