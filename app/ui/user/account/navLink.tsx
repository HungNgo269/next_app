import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, CreditCard, Bell, Shield, LogOut } from "lucide-react";

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
  return (
    <div className="lg:flex-3">
      <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
        Account Settings
      </h2>
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
          variant="ghost"
          className="hidden md:flex w-full justify-start gap-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </nav>
    </div>
  );
}
