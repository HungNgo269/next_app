import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { auth } from "@/auth";
import AccountProvider from "@/app/ui/user/account/accountProvider";
import { getCurrentSubscription } from "@/app/data/subcriptions";
import { getUserProfile } from "@/app/data/userData";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;
  const subscription = await getCurrentSubscription();
  const profile = user?.id ? await getUserProfile(user.id) : null;

  const displayName = profile?.name ?? user?.name ?? "Your Account";
  const displayEmail = profile?.email ?? user?.email ?? "";
  const displayRole = profile?.role ?? user?.role ?? "user";
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : null;

  const avatarSrc = profile?.image_url ?? user?.image_url ?? "/placeholder.svg";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleLabel =
    displayRole === "subUser"
      ? "Subscriber"
      : displayRole === "admin"
      ? "Administrator"
      : "Member";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-info/10 via-accent/10 to-primary/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-20 w-20 ring-4 ring-white dark:ring-slate-800 shadow-lg">
                <AvatarImage src={avatarSrc} alt={displayName} />
                <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-info to-accent text-primary-foreground">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-primary-foreground">
                    {displayName}
                  </h1>
                  <Badge variant="secondary" className="w-fit">
                    {roleLabel}
                  </Badge>
                </div>
                {displayEmail && (
                  <p className="text-slate-600 dark:text-slate-300 text-lg">
                    {displayEmail}
                  </p>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {memberSince
                    ? `Member since ${memberSince}`
                    : "Welcome to your account"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <AccountProvider
          subscription={subscription}
          user={profile}
        ></AccountProvider>
      </div>
    </div>
  );
}
