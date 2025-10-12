"use server";
import { auth } from "@/auth";
import {
  subcriptionsInfo,
  SubscriptionPrice,
} from "@/app/interface/subcription";
import {
  checkoutWithStripe,
  createStripePortal,
} from "@/lib/utils/stripe/server";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import Stripe from "stripe";
import {
  getUserStripe,
  updateUserStripe,
  getUserStripeByCustomerId,
} from "./userData";
import { UserStripe } from "../interface/userStripe";
import { toDateTime } from "@/lib/utils/helper";
import { Subscription } from "../interface/subcription";
const TRIAL_PERIOD_DAYS = 7;
export async function upsertSubscriptionProduct(product: Stripe.Product) {
  const rows = await sql`
    INSERT INTO subscription_products(
      id, description, name, created_at
    ) VALUES (
      ${product.id},
      ${product.description},
      ${product.name},
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      name        = EXCLUDED.name,
      description = EXCLUDED.description,
      updated_at  = now()
    RETURNING *;
  `;
  return rows[0];
}

export async function deleteSubscriptionProduct(product: Stripe.Product) {
  const rows = await sql`
    DELETE FROM subscription_products
    WHERE id = ${product.id}
    RETURNING id;
  `;
  return rows[0]?.id ?? null;
}
export async function upsertSubscriptionPrice(price: Stripe.Price) {
  const res = await sql`
    INSERT INTO subscription_prices (
      id, product_id, active, currency, type,
      unit_amount, interval,interval_count, trial_period_days
    ) VALUES (
      ${price.id},
      ${price.product},
      ${price.active},
      ${price.currency},
      ${price.type},
      ${price.unit_amount ?? null},
      ${price.recurring?.interval ?? null},
      ${price.recurring?.interval_count ?? null},
      ${price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS}
    )
    ON CONFLICT (id) DO UPDATE SET
      product_id        = EXCLUDED.product_id,
      active            = EXCLUDED.active,
      currency          = EXCLUDED.currency,
      type              = EXCLUDED.type,
      unit_amount       = EXCLUDED.unit_amount,
      interval      = EXCLUDED.interval,
      interval_count      = EXCLUDED.interval_count,
      trial_period_days = EXCLUDED.trial_period_days,
      updated_at        = now()
    RETURNING *;
  `;
  return res[0];
}

export async function deleteSubscriptionPrice(price: Stripe.Price) {
  const rows = await sql`
    DELETE FROM subscription_prices
    WHERE id = ${price.id}
    RETURNING id;
  `;
  return rows[0]?.id ?? null;
}

export const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { Id: uuid }, email: email };
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is required");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    // https://github.com/stripe/stripe-node#configuration
    // https://stripe.com/docs/api/versioning
    // @ts-ignore
    apiVersion: "2025-08-27.basil", // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo

    appInfo: {
      name: "Next Book",
      version: "0.0.0",
      url: process.env.NEXT_PUBLIC_BASE_URL,
    },
  });
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error("Stripe customer creation failed.");

  return newCustomer.id;
};
export async function upsertUserStripe(
  id: string,
  stripe_customer_id: string
): Promise<UserStripe | undefined> {
  try {
    const user =
      (await sql`insert into userstripe (id,stripe_customer_id) values 
      (${id},${stripe_customer_id}) on CONFLICT (id) do update
      set stripe_customer_id=EXCLUDED.stripe_customer_id returning *
        `) as UserStripe[];
    return user[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user.");
  }
}
export const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}): Promise<string> => {
  //check customer exsiting in postgres
  const existingUser = await getUserStripe(uuid);
  // Retrieve the Stripe customer ID using the postgres customer ID, with email fallback
  let stripeCustomerId: string | undefined;
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is required");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    // https://github.com/stripe/stripe-node#configuration
    // https://stripe.com/docs/api/versioning
    // @ts-ignore
    apiVersion: "2025-08-27.basil", // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo

    appInfo: {
      name: "Next Book",
      version: "0.0.0",
      url: process.env.NEXT_PUBLIC_BASE_URL,
    },
  });
  if (existingUser?.stripe_customer_id) {
    const existingStripeUser = await stripe.customers.retrieve(
      existingUser.stripe_customer_id
    );
    stripeCustomerId = existingStripeUser.id;
  } else {
    // If Stripe ID is missing from postgres, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);
  if (!stripeIdToInsert) throw new Error("Stripe customer creation failed.");

  if (existingUser && stripeCustomerId) {
    // If postgres has a record but doesn't match Stripe, update postgres record
    if (existingUser.stripe_customer_id !== stripeCustomerId) {
      await updateUserStripe(uuid, stripeCustomerId);
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  } else {
    console.warn(
      `Stripe customer record was missing. A new record was created.`
    );

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertUserStripe(
      uuid,
      stripeIdToInsert
    );
    if (!upsertedStripeCustomer)
      throw new Error("Supabase customer record creation failed.");

    return upsertedStripeCustomer.stripe_customer_id;
  }
};

export const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  try {
    const res =
      await sql`update users set address =${address}, payment_method=${payment_method.type} `;
    return res;
  } catch (error) {
    throw new Error("Supabase customer record creation failed.");
  }
};

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is required");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-08-27.basil",
    appInfo: {
      name: "Next Book",
      version: "0.0.0",
      url: process.env.NEXT_PUBLIC_BASE_URL,
    },
  });

  // Get customer's UUID from mapping table
  const customerData = await getUserStripeByCustomerId(customerId);
  const uuid = customerData?.id;

  if (!uuid) {
    console.error(`No user found for Stripe customer ID: ${customerId}`);
    throw new Error(`User not found for customer ID: ${customerId}`);
  }

  // Retrieve subscription from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });
  // Get subscription item details
  const subscriptionItem = subscription.items.data[0];
  if (!subscriptionItem) {
    throw new Error(
      `No subscription items found for subscription: ${subscriptionId}`
    );
  }

  const subscriptionData: Subscription = {
    id: subscription.id,
    user_id: uuid,
    status: subscription.status,
    price_id: subscriptionItem.price.id,
    quantity: subscriptionItem.quantity || 1,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null,
  };

  try {
    await sql`
      INSERT INTO subscriptions (
        id, user_id, status, price_id, quantity,
        cancel_at_period_end, cancel_at, canceled_at,
        created, ended_at, trial_start, trial_end,
       updated_at
      ) VALUES (
        ${subscriptionData.id},
        ${subscriptionData.user_id},
        ${subscriptionData.status},
        ${subscriptionData.price_id},
        ${subscriptionData.quantity},
        ${subscriptionData.cancel_at_period_end},
        ${subscriptionData.cancel_at},
        ${subscriptionData.canceled_at},
        ${subscriptionData.created},
        ${subscriptionData.ended_at},
        ${subscriptionData.trial_start},
        ${subscriptionData.trial_end},

        now()
      )
      ON CONFLICT (id) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        status = EXCLUDED.status,
        price_id = EXCLUDED.price_id,
        quantity = EXCLUDED.quantity,
        cancel_at_period_end = EXCLUDED.cancel_at_period_end,
        cancel_at = EXCLUDED.cancel_at,
        canceled_at = EXCLUDED.canceled_at,
        created = EXCLUDED.created,
        ended_at = EXCLUDED.ended_at,
        trial_start = EXCLUDED.trial_start,
        trial_end = EXCLUDED.trial_end,
        updated_at = now();
    `;

    console.log(
      ` Successfully inserted/updated subscription [${subscription.id}] for user [${uuid}]`
    );
  } catch (dbError) {
    console.error("Database error when inserting subscription:", dbError);
    throw new Error(`Failed to save subscription to database: ${dbError}`);
  }

  if (createAction && subscription.default_payment_method && uuid) {
    try {
      await copyBillingDetailsToCustomer(
        uuid,
        subscription.default_payment_method as Stripe.PaymentMethod
      );
      console.log(`Billing details copied for user [${uuid}]`);
    } catch (billingError) {
      console.error("Error copying billing details:", billingError);
    }
  }
};
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

    return (subscription[0] as subcriptionsInfo) || null;
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
