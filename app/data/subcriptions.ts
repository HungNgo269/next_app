"use server";

import { sql } from "@/lib/db";
import { auth } from "@/auth";
import {
  SubscriptionPrice,
  SubscriptionProduct,
} from "@/app/interface/subcription";
import {
  checkoutWithStripe,
  createStripePortal,
} from "@/lib/utils/stripe/server";
import { redirect } from "next/navigation";

export async function getSubscriptionProducts() {
  try {
    const products = await sql`
      SELECT 
        p.*,
        pr.id as price_id,
        pr.unit_amount,
        pr.currency,
        pr.interval,
        pr.interval_count,
        pr.trial_period_days,
        pr.type,
        pr.active as price_active
      FROM subscription_products p
      JOIN subscription_prices pr ON p.id = pr.product_id
      WHERE pr.active = true
      ORDER BY pr.unit_amount ASC
    `;

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getCurrentSubscription() {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const subscription = await sql`
      SELECT 
        s.*,
        sp.name as product_name,
        sp.description as product_description,
        spr.unit_amount,
        spr.currency,
        spr.interval,
        spr.interval_count
      FROM subscriptions s
      JOIN subscription_prices spr ON s.price_id = spr.id
      JOIN subscription_products sp ON spr.product_id = sp.id
      WHERE s.user_id = ${session.user.id}
        AND s.status IN ('active', 'trialing')
      ORDER BY s.created DESC
      LIMIT 1
    `;

    return subscription[0] || null;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}

export async function checkUserSubscription() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { hasSubscription: false };

    const subscription = await sql`
      SELECT 
        id, 
        status, 
        cancel_at_period_end,
        trial_end,
        ended_at
      FROM subscriptions
      WHERE user_id = ${session.user.id}
        AND status IN ('active', 'trialing')
      LIMIT 1
    `;

    if (subscription.length === 0) {
      return { hasSubscription: false };
    }

    const sub = subscription[0];
    const now = new Date();

    // Check if trial has ended
    if (sub.status === "trialing" && sub.trial_end) {
      const trialEnd = new Date(sub.trial_end);
      if (trialEnd < now) {
        return { hasSubscription: false, trialExpired: true };
      }
    }

    return {
      hasSubscription: true,
      status: sub.status,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      trialEnd: sub.trial_end,
    };
  } catch (error) {
    console.error("Error checking subscription:", error);
    return { hasSubscription: false };
  }
}
export async function createCheckoutSession(
  priceId: string,
  redirectPath: string = "/account"
) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Authentication required");
    }

    const price = await sql`
      SELECT * FROM subscription_prices WHERE id = ${priceId}
    `;

    if (!price[0]) {
      throw new Error("Invalid price");
    }

    const result = await checkoutWithStripe(
      price[0] as SubscriptionPrice,
      redirectPath
    );
    if (result.errorRedirect) {
      return { error: result.errorRedirect };
    }

    return { sessionId: result.sessionId };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

export async function createPortalSession() {
  try {
    const session = await auth();
    if (!session?.user) {
      redirect("/login");
    }

    const url = await createStripePortal("/account");

    if (typeof url === "string" && url.startsWith("http")) {
      redirect(url);
    }

    return { error: "Failed to create portal session" };
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw error;
  }
}
