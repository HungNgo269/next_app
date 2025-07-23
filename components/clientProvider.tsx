"use client";

import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { useHydrateAuth } from "@/app/store/useHydrateAuth";

function HydrateWrapper() {
  useHydrateAuth();
  return null;
}

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <HydrateWrapper />
      <Toaster position="top-right" />
      {children}
    </SessionProvider>
  );
}
