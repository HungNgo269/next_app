import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function requireSubscription() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      hasAccess: false,
      reason: "not_authenticated",
    };
  }

  const subscription = await sql`
    SELECT status, trial_end, ended_at
    FROM subscriptions
    WHERE user_id = ${session.user.id}
      AND status IN ('active', 'trialing')
    ORDER BY created DESC
    LIMIT 1
  `;

  if (subscription.length === 0) {
    return {
      hasAccess: false,
      reason: "no_subscription",
    };
  }

  const sub = subscription[0];

  if (sub.status === "trialing" && sub.trial_end) {
    const trialEnd = new Date(sub.trial_end);
    if (trialEnd < new Date()) {
      return {
        hasAccess: false,
        reason: "trial_expired",
      };
    }
  }

  return {
    hasAccess: true,
    subscription: sub,
  };
}
