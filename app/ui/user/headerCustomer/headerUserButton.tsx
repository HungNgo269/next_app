import { AuthUser, useAuthStore } from "@/app/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  CreditCard,
  Bell,
  HelpCircle,
  User,
  LogOut,
} from "lucide-react";
import { auth, signOut } from "@/auth";

interface UserButtonProps {
  user?: AuthUser;
}

export async function UserButton({ user }: UserButtonProps) {
  const session = await auth();
  console.log("session", session);
  console.log("user", session?.user);
  const userData = user || {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar:
      "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full md:h-12 md:w-12 hover:bg-accent"
        >
          <Avatar className="h-10 w-10 md:h-12 md:w-12">
            <AvatarImage
              src={
                userData.avatar ||
                "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg"
              }
              alt={userData.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(userData.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 md:w-72" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="w-full"
          >
            <button className="w-full flex items-center px-2 py-1.5 text-sm cursor-pointer text-destructive hover:bg-accent rounded-sm">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
