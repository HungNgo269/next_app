import { Button } from "@/components/ui/button";

import Link from "next/link";
import { Logo } from "@/app/ui/share/Button/logo";
import { headers } from "next/headers";

export default async function HeaderLogin() {
  const headerList = headers();
  const pathName = (await headerList).get("x-pathname");
  return (
    <div className="w-full border-b-1 border-border">
      <div className="max-w-screen mx-auto w-full">
        <div className="flex items-center justify-between h-16 md:px-4 lg:px-8 xl:px-12 mx-3">
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
            <div className="flex flex-row gap-4">
              <Link
                prefetch={true}
                href={`/register?callbackUrl=${encodeURIComponent(pathName!)}`}
              >
                <Button className="cursor-pointer" variant={"outline"}>
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
