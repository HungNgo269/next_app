"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/helper";
import { Calendar, DollarSign, Package, AlertTriangle } from "lucide-react";
import { createPortalSession } from "@/app/data/subcriptions";
import { subcriptionsInfo } from "@/app/interface/subcription";

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
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
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
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      trialing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      canceled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      past_due:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
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
      {/* Subscription Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Package className="h-4 w-4" />
            Current Plan
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
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
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatPrice(subscription.unit_amount, subscription.currency)}
              <span className="text-base font-normal text-slate-500 dark:text-slate-400">
                /{subscription.interval}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      {(subscription.trial_end || subscription.cancel_at_period_end) && (
        <div className="space-y-4">
          {subscription.trial_end && (
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Trial Period Active
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your trial ends on{" "}
                  {new Date(subscription.trial_end).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {subscription.cancel_at_period_end && (
            <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900 dark:text-orange-100">
                  Subscription Ending
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Your subscription will be canceled at the end of the billing
                  period
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
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
