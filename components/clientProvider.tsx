"use client";

import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { useHydrateAuth } from "@/app/store/useHydrateAuth";
import { Session } from "next-auth";

function HydrateWrapper() {
  useHydrateAuth();
  return null;
}

export default function ClientProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <HydrateWrapper />
      {children}
    </SessionProvider>
  );
}
