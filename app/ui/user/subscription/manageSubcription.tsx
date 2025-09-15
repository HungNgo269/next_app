"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/helper";
import { createPortalSession } from "@/app/data/subcriptions";

interface ManageSubscriptionProps {
  subscription: any;
}

export default function ManageSubscription({
  subscription,
}: ManageSubscriptionProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      await createPortalSession();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to open billing portal");
    } finally {
      setLoading(false);
    }
  };

  if (!subscription) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">No active subscription</p>
        <Button onClick={() => router.push("/pricing")}>View Plans</Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      active: "default",
      trialing: "secondary",
      canceled: "destructive",
      past_due: "destructive",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status.replace(/_/g, " ").toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Plan</p>
          <p className="text-lg font-semibold">{subscription.product_name}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <div className="mt-1">{getStatusBadge(subscription.status)}</div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Price</p>
          <p className="text-lg">
            {formatPrice(subscription.unit_amount, subscription.currency)}/
            {subscription.interval}
          </p>
        </div>

        {subscription.trial_end && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Trial Ends
            </p>
            <p className="text-lg">
              {new Date(subscription.trial_end).toLocaleDateString()}
            </p>
          </div>
        )}

        {subscription.cancel_at_period_end && (
          <div className="col-span-2">
            <p className="text-sm font-medium text-destructive">
              Your subscription will be canceled at the end of the billing
              period
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button onClick={handleManageBilling} disabled={loading}>
          {loading ? "Loading..." : "Manage Billing"}
        </Button>

        {subscription.status === "active" &&
          !subscription.cancel_at_period_end && (
            <Button variant="outline" onClick={() => router.push("/pricing")}>
              Change Plan
            </Button>
          )}
      </div>
    </div>
  );
}
