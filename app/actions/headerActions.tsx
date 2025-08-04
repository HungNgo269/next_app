"use client";

import { PowerIcon } from "@heroicons/react/24/outline";
import { AuthUser, useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function AuthActionsClient() {
  const user: AuthUser | null = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };
  console.log("first", user);
  return (
    <>
      {user ? (
        <button
          onClick={handleLogout}
          className="flex h-[48px] w-full grow items-center justify-center rounded-md bg-transparent text-sm font-medium hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 mr-auto"
        >
          <PowerIcon className="w-6" />
          <div className="hidden md:block">Sign Out</div>
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/register")}
            className="flex h-[48px] w-full grow items-center justify-center rounded-md bg-transparent text-sm font-medium hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 mr-auto"
          >
            {user?.name}ád Sign In
          </button>
          <button
            onClick={() => router.push("/login")}
            className="flex h-[48px] w-full grow items-center justify-center rounded-md bg-transparent text-sm font-medium hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 mr-auto"
          >
            Login
          </button>
        </div>
      )}
    </>
  );
}
