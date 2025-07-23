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
    <header className="w-full bg-white border-b border-gray-200">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-gray-600">Hi</span>
                &nbsp;
                <span className="text-blue-500 underline"> Sign in</span>
                &nbsp;
                <span className="text-gray-600">or</span>
                &nbsp;
                <span className="text-blue-500 underline"> Register</span>
              </div>
              <span className="text-gray-400">|</span>

              <span className="text-gray-600">Daily Deals</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Help & Contact</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Sell</span>
              <span className="text-gray-400">|</span>
              <div className="flex items-center space-x-1">
                <Globe className="h-3 w-3 text-gray-600" />
                <span className="text-gray-600">Ship to</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <nav className="flex space-x-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <span>Shop by category</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[800px] p-0">
                  <div className="flex bg-white z-10">
                    {/* Most popular categories */}
                    <div className="flex-1 p-6 border-r border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Most popular categories
                      </h3>
                      <div className="space-y-3">
                        <a
                          href="#"
                          className="block text-sm text-gray-700 hover:text-blue-600"
                        >
                          Smartphones and accessories
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-gray-700 hover:text-blue-600"
                        >
                          Video games and consoles
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-gray-700 hover:text-blue-600"
                        >
                          Computers and tablets
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-gray-700 hover:text-blue-600"
                        >
                          Cameras and photos
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-gray-700 hover:text-blue-600"
                        >
                          Camera drones
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-gray-700 hover:text-blue-600"
                        >
                          Refurbished
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-gray-700 hover:text-blue-600"
                        >
                          Smart home
                        </a>
                      </div>
                    </div>

                    {/* More categories */}
                    <div className="flex-1 p-6 border-r border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        More categories
                      </h3>
                      <div className="space-y-3">
                        <a
                          href="#"
                          className="block text-sm text-gray-700 hover:text-blue-600"
                        >
                          Apple
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-gray-700 hover:text-blue-600"
                        >
                          Samsung
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-gray-700 hover:text-blue-600"
                        >
                          Portable audio and headphones
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-gray-700 hover:text-blue-600"
                        >
                          Smart watches
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-gray-700 hover:text-blue-600"
                        >
                          Deals
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-gray-700 hover:text-blue-600"
                        >
                          Sell on eBay
                        </a>
                      </div>
                    </div>

                    {/* Promotional section */}
                    <div className="w-80 p-0">
                      <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-6 h-full flex flex-col justify-center relative overflow-hidden">
                        <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-2">
                            Electronics
                          </h3>
                          <h3 className="text-2xl font-bold mb-4">
                            & technology
                          </h3>
                          <p className="text-lg mb-6">Check the offers</p>
                          <Button className="bg-white text-pink-600 hover:bg-gray-100 font-semibold px-6 py-2 rounded-full">
                            Shop now
                          </Button>
                        </div>

                        {/* Product images */}
                        <div className="absolute right-4 top-4 opacity-90">
                          <div className="relative">
                            {/* Gaming controller */}
                            <div className="w-16 h-16 bg-white/20 rounded-lg mb-2 flex items-center justify-center">
                              <div className="w-8 h-8 bg-white/40 rounded"></div>
                            </div>
                            {/* Phone */}
                            <div className="w-12 h-20 bg-gradient-to-b from-purple-600 to-pink-600 rounded-lg mb-2"></div>
                            {/* Other devices */}
                            <div className="flex space-x-1">
                              <div className="w-6 h-6 bg-white/30 rounded"></div>
                              <div className="w-6 h-6 bg-white/30 rounded"></div>
                            </div>
                          </div>
                        </div>

                        {/* Laptop silhouette */}
                        <div className="absolute right-0 bottom-0 opacity-30">
                          <div className="w-32 h-20 bg-white/20 rounded-tl-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
              >
                Motors
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

            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600 hidden sm:inline">Sell</span>
              <span className="text-red-600 font-medium hidden sm:inline">
                Brand Outlet
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
