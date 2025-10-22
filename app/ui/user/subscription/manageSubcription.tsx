"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/helper";
import { Calendar, DollarSign, Package, AlertTriangle } from "lucide-react";
import { subcriptionsInfo } from "@/app/interface/subcription";
import {
  createPortalSession,
  getCurrentSubscription,
} from "@/app/data/subscriptions";
import { formatDateTime } from "@/lib/utils/formatDate";

export default function ManageSubscription() {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<subcriptionsInfo | null>(
    null
  );
  const router = useRouter();
  useEffect(() => {
    const getSub = async () => {
      setLoading(true);
      const res = await getCurrentSubscription();
      setSubscription(res);
    };

    getSub();
    setLoading(false);
  }, []);

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
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
          <Package className="h-8 w-8 " />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Active Subscription
        </h3>
        <p className="text-muted-foreground mb-6">
          Choose a plan to get started with premium features
        </p>
        <Button onClick={() => router.push("/pricing")} className="gap-2">
          <Package className="h-4 w-4" />
          View Plans
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Package className="h-4 w-4" />
            Current Plan
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">
              {subscription.product_name}
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            Billing Amount
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground ">
              {formatPrice(subscription.unit_amount, subscription.currency)}
              <span className="text-base font-normal text-foreground">
                /{subscription.interval}
              </span>
            </p>
          </div>
        </div>
      </div>

      {(subscription.trial_end || subscription.cancel_at_period_end) && (
        <div className="space-y-4">
          {subscription.trial_end && (
            <div className="flex items-start gap-3 p-4 bg-info/10 rounded-xl border border-info/20">
              <Calendar className="h-5 w-5 text-info mt-0.5" />
              <div>
                <p className="font-medium text-info ">Trial Period Active</p>
                <p className="text-sm text-info ">
                  Your trial ends on {formatDateTime(subscription.trial_end)}
                </p>
              </div>
            </div>
          )}

          {subscription.cancel_at_period_end && (
            <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-xl border border-warning/20 ">
              <AlertTriangle className="h-5 w-5 text-warning  mt-0.5" />
              <div>
                <p className="font-medium text-warning ">Subscription Ending</p>
                <p className="text-sm text-warning ">
                  Your subscription will be canceled at the end of the billing
                  period
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
        <Button
          onClick={handleManageBilling}
          disabled={loading}
          className="gap-2"
        >
          <DollarSign className="h-4 w-4" />
          {loading ? "Loading..." : "Manage Billing"}
        </Button>

        {subscription.status === "active" &&
          !subscription.cancel_at_period_end && (
            <Button
              variant="outline"
              onClick={() => router.push("/pricing")}
              className="gap-2"
            >
              <Package className="h-4 w-4" />
              Change Plan
            </Button>
          )}
      </div>
    </div>
  );
}