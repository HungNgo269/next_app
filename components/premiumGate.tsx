"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface PremiumGateProps {
  hasAccess: boolean;
  reason?: string;
  children: React.ReactNode;
}

export default function PremiumGate({
  hasAccess,
  reason,
  children,
}: PremiumGateProps) {
  const router = useRouter();

  if (hasAccess) {
    return <>{children}</>;
  }

  const messages = {
    not_authenticated: {
      title: "Sign in Required",
      description: "Please sign in to access this content",
      action: "Sign In",
      onClick: () => router.push("/login"),
    },
    no_subscription: {
      title: "Premium Content",
      description: "This content is available for premium members only",
      action: "View Plans",
      onClick: () => router.push("/pricing"),
    },
    trial_expired: {
      title: "Trial Expired",
      description: "Your free trial has ended. Subscribe to continue reading",
      action: "Subscribe Now",
      onClick: () => router.push("/pricing"),
    },
  };

  const content =
    messages[reason as keyof typeof messages] || messages.no_subscription;

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center">
          <Lock className="w-10 h-10 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{content.title}</h2>
          <p className="text-muted-foreground">{content.description}</p>
        </div>

        <Button size="lg" onClick={content.onClick} className="min-w-[200px]">
          {content.action}
        </Button>
      </div>
    </div>
  );
}
