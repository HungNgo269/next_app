import Link from "next/link";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";
import HeaderLinks from "./header-links";

export default function HeaderCustomer() {
  return (
    <div className=" h-[66px] fixed top-0 left-0 w-full z-[21] bg-gradient-overlay text-white">
      <div className="flex flex-row  grow gap-3 items-start justify-between py-[11px] px-14">
        <HeaderLinks />
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            className="flex h-[48px] w-full grow items-center justify-center rounded-md
         bg-transparent text-sm font-medium  hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 mr-auto"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
