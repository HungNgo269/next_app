"use client";
import { Separator } from "@/components/ui/separator";
import UserNavLink from "./navLink";
import PageContent from "./pageContent";
import { subcriptionsInfo } from "@/app/interface/subcription";
import { useState } from "react";
import type { UserProfile } from "@/app/interface/user";

export default function AccountProvider({
  subscription,
  user,
}: {
  subscription: subcriptionsInfo | null;
  user: UserProfile | null;
}) {
  const [active, setActive] = useState(1);

  const handleSetActive = (id: number) => {
    setActive(id);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <UserNavLink active={active} onClick={handleSetActive}></UserNavLink>
      <Separator orientation="vertical" />
      <PageContent
        subscription={subscription}
        active={active}
        user={user}
      ></PageContent>
    </div>
  );
}
