"use server";

import SignOutAction from "@/app/(auth)/signoutAction";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default async function LogOutButton() {
  return (
    <form action={SignOutAction}>
      <Button
        type="submit"
        variant="ghost"
        className="hidden md:flex w-full justify-start gap-3 text-left text-destructive hover:text-destructive/90 hover:bg-destructive/10 "
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </Button>
    </form>
  );
}
