"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "home", label: "Home & Garden" },
    { value: "sports", label: "Sports" },
    { value: "toys", label: "Toys & Hobbies" },
    { value: "automotive", label: "Automotive" },
    { value: "books", label: "Books" },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {/* Main header */}
      <div className="max-w-7xl mx-auto ">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">
                e<span className="text-red-500">B</span>
                <span className="text-yellow-500">a</span>
                <span className="text-blue-600">y</span>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="flex">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40 rounded-r-none border-r-0 bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search for anything"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-none border-l-0 border-r-0 focus:ring-0 focus:border-blue-500"
                />
              </div>
              <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700 px-6">
                <Search className="h-4 w-4" />
              </Button>
            </div>
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
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>View watchlist</DropdownMenuItem>
                <DropdownMenuItem>Recently viewed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* My eBay */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <span className="hidden sm:inline">My eBay</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Summary</DropdownMenuItem>
                <DropdownMenuItem>Recently viewed</DropdownMenuItem>
                <DropdownMenuItem>Bids/Offers</DropdownMenuItem>
                <DropdownMenuItem>Watchlist</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Purchase history</DropdownMenuItem>
                <DropdownMenuItem>Buy again</DropdownMenuItem>
                <DropdownMenuItem>Selling</DropdownMenuItem>
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

      {/* Navigation bar */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-12">
            <nav className="flex space-x-8">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
              >
                Home
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
              >
                Fashion
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
              >
                Electronics
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:inline-flex"
              >
                Collectibles
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:inline-flex"
              >
                Home & Garden
              </Button>
            </nav>

            <div className="flex items-center text-sm">
              <span className="text-red-600 font-medium hidden sm:inline">
                Daily Discount
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
