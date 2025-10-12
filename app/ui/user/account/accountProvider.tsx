"use client";
import { Separator } from "@/components/ui/separator";
import UserNavLink from "./navLink";
import PageContent from "./pageContent";
import { subcriptionsInfo } from "@/app/interface/subcription";
import { useState } from "react";
import type { UserProfile } from "@/app/interface/user";

interface props {
  user: UserProfile;
}

export default function AccountProvider({ user }: props) {
  const [active, setActive] = useState(1);
  const handleSetActive = (id: number) => {
    setActive(id);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <UserNavLink active={active} onClick={handleSetActive}></UserNavLink>
      <Separator orientation="vertical" />
      <PageContent active={active} user={user}></PageContent>
    </div>
  );
}
