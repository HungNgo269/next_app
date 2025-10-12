import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import AccountProvider from "@/app/ui/user/account/accountProvider";
import { getUserProfile } from "@/app/data/userData";
import { redirect } from "next/navigation";
import { getSessionCache } from "@/lib/utils/getSession";
import { formatDate } from "@/lib/utils/formatDate";

export default async function ProfilePage() {
  const session = await getSessionCache();
  const user = session?.user;
  if (!user?.id) {
    const callbackUrl = encodeURIComponent("/account");
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }
  const profile = await getUserProfile(user?.id!);
  return (
    <div className="bg-background lg:w-[1000px] md:w-[700px] w-full">
      {user.id && (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-info/10 via-accent/10 to-primary/10 rounded-3xl blur-3xl"></div>
            <div className="relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Avatar className="h-20 w-20 ring-4 ring-ring  shadow-lg">
                  <AvatarImage src={profile?.image_url!} alt={profile?.name} />
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h1 className="text-3xl font-bold text-foreground ">
                      {profile?.name}
                    </h1>
                    <Badge variant="secondary" className="w-fit">
                      {profile?.role}
                    </Badge>
                  </div>
                  {profile?.email && (
                    <p className="text-muted-foreground text-lg">
                      {profile?.email}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {profile?.created_at
                      ? `Member since ${formatDate(profile?.created_at)}`
                      : "Welcome to your account"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <AccountProvider user={profile!}></AccountProvider>
        </div>
      )}
    </div>
  );
}
