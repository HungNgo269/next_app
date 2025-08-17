"use client";
import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useRef, useState } from "react";

const links = [
  { name: "Home", href: "/Home", icon: HomeIcon },
  { name: "EBook", href: "/dashboard/invoices" },
  { name: "AudioBook", href: "/dashboard/invoices" },
  { name: "Subscription-only book", href: "/dashboard/invoices" },
  { name: "Free book", href: "/dashboard/invoices" },
];

const ebookLinks = [
  { name: "Home", href: "/Home" },
  { name: "EBook", href: "/dashboard/invoices" },
  { name: "AudioBook", href: "/dashboard/invoices" },
  { name: "Subscription-only book", href: "/dashboard/invoices" },
  { name: "Free book", href: "/dashboard/invoices" },
];

export default function HeaderLinks() {
  const pathname = usePathname();
  const [activePopup, setActivePopup] = useState<number | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (index: number) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setActivePopup(index);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setActivePopup(null);
    }, 300);
  };

  return (
    <div className="flex flex-row grow gap-3 items-center justify-start">
      {links.map((link, index) => {
        const LinkIcon = link.icon;
        return (
          <div
            key={link.name}
            className="relative"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={link.href}
              className={clsx(
                "relative flex py-2.5 grow items-center justify-center gap-2 rounded-md bg-transparent   text-base/5 font-medium hover:text-blue-600 md:flex-none md:justify-start whitespace-nowrap",
                {
                  "bg-sky-100 text-blue-600": pathname === link.href,
                }
              )}
            >
              {LinkIcon && <LinkIcon className="h-4 w-4" />}
              <p>{link.name}</p>
            </Link>

            {activePopup === index && index !== 0 && (
              <div
                className="absolute top-10 left-0 mt-2 grid grid-cols-4 gap-3 bg-gray-900 bg-opacity-90 border p-4 shadow-lg z-50 min-w-max text-white rounded-lg border-gray-500 border-1"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                {index === 1 &&
                  ebookLinks.map((el, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={el.href}
                      className="text-sm hover:text-blue-600"
                    >
                      {el.name}
                    </Link>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
