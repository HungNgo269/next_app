import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, BookMarked } from "lucide-react";
import SearchComponent from "@/app/ui/user/search/searchComponent";
import Link from "next/link";
import { UserButton } from "@/app/ui/user/headerCustomer/headerUserButton";
import { Logo } from "@/app/ui/share/Button/logo";
import { getSessionCache } from "@/lib/utils/getSession";
import HeaderClientColor from "./headerClientColor";
import { headers } from "next/headers";
import NotificationReceiver from "@/app/ui/user/test/NotificationReceiver";

export default async function Header() {
  const session = await getSessionCache();
  const user = session?.user;
  const headerList = headers();
  const pathName = (await headerList).get("x-pathname");
  return (
    <div className="w-full">
      <div className="max-w-screen mx-auto w-full">
        <div className="flex items-center  justify-between h-16 md:px-4 lg:px-8 xl:px-12">
          <div className="flex flex-row items-center">
            <Link
              prefetch={true}
              href={"/"}
              className="sm:text-xl md:text-2xl lg:text-3xl"
            >
              <Logo />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="sm:hidden">
              <SearchComponent compact />
            </div>
            <div className="hidden sm:block flex-grow-0 flex-shrink basis-[250px]">
              <SearchComponent />
            </div>
            {user ? (
              <div className="flex flex-row gap-3 items-center">
                <div className="hidden sm:flex flex-row justify-center">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex flex-row items-center h-10 justify-center"
                      >
                        <BookMarked className="h-5 w-5" />
                        <span className="hidden md:inline ">Book Shelf</span>
                        <ChevronDown className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Link prefetch={true} href={"#"}>
                          Your Book Shelf
                        </Link>
                      </DropdownMenuItem>

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
                  <HeaderClientColor></HeaderClientColor>
                  <NotificationReceiver userId={user.id}></NotificationReceiver>
                </div>
                <UserButton />
              </div>
            ) : (
              <div className="flex flex-row gap-4">
                <Link
                  prefetch={true}
                  href={`/register?callbackUrl=${encodeURIComponent(
                    pathName!
                  )}`} //encodeURI = ensure valid
                >
                  <Button className="cursor-pointer">Sign In</Button>
                </Link>
                <Link
                  prefetch={true}
                  href={`/login?callbackUrl=${encodeURIComponent(pathName!)}`}
                >
                  <Button className="cursor-pointer" variant={"outline"}>
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
