"use client";
import SignOutAction from "@/app/(auth)/signoutAction";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, CreditCard, Bell, Shield, LogOut } from "lucide-react";
import { useTransition } from "react";

const userNavLinks = [
  { id: 1, name: "Profile Information", icon: User },
  { id: 2, name: "Subscription", icon: CreditCard },
  // { id: 3, name: "Notification", icon: Bell },
  // { id: 4, name: "Security", icon: Shield },
];

interface props {
  active: number;
  onClick: (id: number) => void;
}

export default function UserNavLink({ active, onClick }: props) {
  const [isPending, startTransition] = useTransition(); //trạng thái khi chạy, khi chạy thì await cái action
  const handleLogout = () => {
    startTransition(async () => {
      await SignOutAction();
    });
  };
  return (
    <div className="lg:flex-3">
      <h2 className="font-semibold text-foreground  mb-4">Account Settings</h2>
      <nav className="space-y-2">
        <>
          {userNavLinks.map((item) => {
            const LinkIcon = item.icon;
            return (
              <Button
                variant="ghost"
                onClick={() => {
                  onClick(item.id);
                }}
                key={item.id}
                className={`w-full justify-start gap-3 text-left hover:bg-primary/30 ${
                  item.id == active ? "bg-primary/30" : ""
                }`}
              >
                <LinkIcon className="h-4 w-4"></LinkIcon>
                {item.name}
              </Button>
            );
          })}
        </>
        <Separator className="my-4" />
        <Button
          onClick={handleLogout}
          variant="ghost"
          disabled={isPending}
          className="hidden md:flex w-full justify-start gap-3 text-left text-destructive hover:text-destructive/90 hover:bg-destructive/10 dark:text-destructive/80 dark:hover:bg-destructive/20"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </nav>
    </div>
  );
}
