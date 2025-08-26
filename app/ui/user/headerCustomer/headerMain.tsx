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

export default function Header() {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto ">
        <div className="flex items-center justify-between h-16 ">
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <Link
                href={
                  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
                }
              >
                <BookOpen></BookOpen>
              </Link>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <div className="flex-grow-0 flex-shrink basis-[250px]">
              <SearchComponent></SearchComponent>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Watchlist</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              {/* <div className="rounded-md">
                <ModeToggle></ModeToggle>
              </div> */}
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>View watchlist</DropdownMenuItem>
                <DropdownMenuItem>Recently viewed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu */}
            <Button variant="ghost" size="sm" className="sm:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
