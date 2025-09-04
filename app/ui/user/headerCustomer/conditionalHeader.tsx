"use client";
import { usePathname } from "next/navigation";

interface ConditionalHeaderProps {
  children: React.ReactNode;
}

export default function ConditionalHeader({
  children,
}: ConditionalHeaderProps) {
  const pathname = usePathname();
  const shouldHideHeader = pathname.match(/^\/book\/[^\/]+\/chapter\/[^\/]+$/);
  if (shouldHideHeader) {
    return null;
  }
  return <>{children}</>;
}
