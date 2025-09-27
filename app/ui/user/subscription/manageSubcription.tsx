"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/helper";
import { Calendar, DollarSign, Package, AlertTriangle } from "lucide-react";
import { subcriptionsInfo } from "@/app/interface/subcription";
import { createPortalSession } from "@/app/data/subscriptions";

const ManageSubscription = ({
  subscription,
}: {
  subscription: subcriptionsInfo | null;
}) => {
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
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
          <Package className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-primary-foreground mb-2">
          No Active Subscription
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Choose a plan to get started with premium features
        </p>
        <Button onClick={() => router.push("/pricing")} className="gap-2">
          <Package className="h-4 w-4" />
          View Plans
        </Button>
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

    const colors: Record<string, string> = {
      active:
        "bg-success/15 text-success dark:bg-success/30 dark:text-success/80",
      trialing: "bg-info/15 text-info dark:bg-info/25 dark:text-info/80",
      canceled:
        "bg-destructive/10 text-destructive dark:bg-destructive/25 dark:text-destructive/80",
      past_due:
        "bg-warning/15 text-warning dark:bg-warning/25 dark:text-warning/80",
    };

    return (
      <Badge
        variant={variants[status] || "outline"}
        className={colors[status] || ""}
      >
        {status.replace(/_/g, " ").toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Package className="h-4 w-4" />
            Current Plan
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-primary-foreground">
              {subscription.product_name}
            </h3>
            <div className="flex items-center gap-2">
              {getStatusBadge(subscription.status)}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            <DollarSign className="h-4 w-4" />
            Billing Amount
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-slate-900 dark:text-primary-foreground">
              {formatPrice(subscription.unit_amount, subscription.currency)}
              <span className="text-base font-normal text-slate-500 dark:text-slate-400">
                /{subscription.interval}
              </span>
            </p>
          </div>
        </div>
      </div>

      {(subscription.trial_end || subscription.cancel_at_period_end) && (
        <div className="space-y-4">
          {subscription.trial_end && (
            <div className="flex items-start gap-3 p-4 bg-info/10 dark:bg-info/20 rounded-xl border border-info/20 dark:border-info/30">
              <Calendar className="h-5 w-5 text-info dark:text-info/80 mt-0.5" />
              <div>
                <p className="font-medium text-info dark:text-info/90">
                  Trial Period Active
                </p>
                <p className="text-sm text-info dark:text-info/70">
                  Your trial ends on{" "}
                  {new Date(subscription.trial_end).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {subscription.cancel_at_period_end && (
            <div className="flex items-start gap-3 p-4 bg-warning/10 dark:bg-warning/25 rounded-xl border border-warning/20 dark:border-warning/30">
              <AlertTriangle className="h-5 w-5 text-warning dark:text-warning/80 mt-0.5" />
              <div>
                <p className="font-medium text-warning dark:text-warning/90">
                  Subscription Ending
                </p>
                <p className="text-sm text-warning dark:text-warning/70">
                  Your subscription will be canceled at the end of the billing
                  period
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
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
};

export default ManageSubscription;
export { ManageSubscription };
