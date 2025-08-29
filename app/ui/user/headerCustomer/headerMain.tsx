import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Bell,
  Heart,
  Menu,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import SearchComponent from "../search/searchComponent";
import ModeToggle from "../../share/theme/themeButton";
import Link from "next/link";
import { ScrollHeader } from "./scrollHeader";
import { UserButton } from "./headerUserButton";
import { Logo } from "../../share/Button/logo";

export default function Header() {
  return (
    <div className="w-full border-b-black ">
      <div className="sm:max-w-xl md:max-w-2xl lg:max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-2">
          <div className="flex flex-row items-center">
            {/* Mobile menu */}
            <Button variant="link" size="sm" className="sm:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            <Link
              href={process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}
              className="sm:text-xl md:text-2xl lg:text-3xl"
            >
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile/tablet: icon only (overlay opens on tap) */}
            <div className="sm:hidden">
              <SearchComponent compact />
            </div>

            {/* Desktop: full search */}
            <div className="hidden sm:block flex-grow-0 flex-shrink basis-[250px]">
              <SearchComponent />
            </div>

            {/* Desktop extras */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="hidden md:inline">Watchlist</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>View watchlist</DropdownMenuItem>
                  <DropdownMenuItem>Recently viewed</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Always show user button */}
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
}
