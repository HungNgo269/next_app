import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Menu, ChevronDown } from "lucide-react";
import SearchComponent from "@/app/ui/user/search/searchComponent";
import Link from "next/link";
import { UserButton } from "@/app/ui/user/headerCustomer/headerUserButton";
import { Logo } from "@/app/ui/share/Button/logo";
import { getSessionCache } from "@/lib/utils/getSession";

export default async function Header() {
  const session = await getSessionCache();
  const user = session?.user;
  return (
    <div className="w-full">
      <div className="max-w-screen mx-auto w-full">
        <div className="flex items-center  justify-between h-16 md:px-4 lg:px-8 xl:px-12">
          <div className="flex flex-row items-center">
            {/* Mobile menu */}
            {/* <Button variant="link" size="sm" className="sm:hidden">
              <Menu className="h-5 w-5" />
            </Button> */}
            <Link
              prefetch={true}
              href={"/"}
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

            {user ? (
              <div className="flex flex-row gap-3 items-center">
                <div className="hidden sm:block">
                  <DropdownMenu modal={false}>
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
                      <DropdownMenuItem>
                        <Link prefetch={true} href={"#"}>
                          View Bookmark
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link prefetch={true} href={"#"}>
                          Recently viewed
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <UserButton />
              </div>
            ) : (
              <div className="flex flex-row gap-4">
                <Button className="cursor-pointer">
                  <Link prefetch={true} href={"/register"}>
                    Sign In
                  </Link>
                </Button>
                <Button className="cursor-pointer" variant={"outline"}>
                  <Link prefetch={true} href={"/login"}>
                    Login
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
