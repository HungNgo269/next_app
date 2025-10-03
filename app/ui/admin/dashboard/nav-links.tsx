"use client";

import {
  ArrowDown,
  BookA,
  ChevronDown,
  ChevronRight,
  House,
  NotebookText,
  Play,
  User,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "User", href: "/dashboard", icon: User },
  { name: "Slides", href: "/dashboard/slides", icon: Play },
  {
    name: "Books",
    href: "/dashboard/books",
    icon: NotebookText,
    children: [{ name: "Chapter", href: "/dashboard/chapters", icon: BookA }],
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [toggle, setToggle] = useState<Record<string, boolean>>({});

  const handleToggle = (linkName: string, event: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    setToggle((prev) => ({
      ...prev,
      [linkName]: !prev[linkName],
    }));
  };

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const hasChildren = !!link.children;
        const isExpanded = toggle[link.name] || false;

        return (
          <div key={link.name}>
            <Link
              href={link.href}
              className={clsx(
                "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-primary/10 hover:text-primary md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  "bg-primary/10 text-primary": pathname === link.href,
                }
              )}
            >
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-row gap-4">
                  <LinkIcon className="w-4" />
                  <p className="hidden md:flex md:items-center md:text-center">
                    {link.name}
                  </p>
                </div>

                {hasChildren && (
                  <ChevronRight
                    className={clsx(
                      "w-4 h-4 cursor-pointer transition-transform z-50",
                      {
                        "rotate-90": isExpanded,
                      }
                    )}
                    onClick={(e) => handleToggle(link.name, e)}
                  />
                )}
              </div>
            </Link>
            {hasChildren && isExpanded && (
              <div className="ml-4 mt-2">
                {link.children.map((child) => {
                  const ChildIcon = child.icon;
                  return (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={clsx(
                        "flex h-[40px] items-center gap-2 rounded-md bg-gray-50 p-2 text-sm font-medium hover:bg-primary/10 hover:text-primary",
                        {
                          "bg-primary/10 text-primary": pathname === child.href,
                        }
                      )}
                    >
                      <ChildIcon className="w-4" />
                      <p>{child.name}</p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
