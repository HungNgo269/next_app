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
  Search,
  ShoppingCart,
  Bell,
  Heart,
  Menu,
  ChevronDown,
  Globe,
  Link,
  BookOpen,
} from "lucide-react";
import SearchComponent from "../../share/search/searchComponent";
import ModeToggle from "../../share/theme/themeButton";

export default function Header() {
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto ">
        <div className="flex items-center justify-between h-16 ">
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <Link href={"/"}>
                <BookOpen></BookOpen>
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-grow-0 flex-shrink basis-[732px]">
            <SearchComponent></SearchComponent>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Watchlist */}
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
              <div className="rounded-md">
                <ModeToggle></ModeToggle>
              </div>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>View watchlist</DropdownMenuItem>
                <DropdownMenuItem>Recently viewed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">
                3
              </Badge>
            </Button>

            {/* Shopping cart */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">
                2
              </Badge>
            </Button>

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
