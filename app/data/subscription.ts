import { sql } from "@/lib/db";
import { stripe } from "@/lib/utils/stripe/config";
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
      `Supabase customer record was missing. A new record was created.`
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
  // Get customer's UUID from mapping table.
  const customerData = await getUserStripeByCustomerId(customerId);
  const uuid = customerData?.id;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData: Subscription = {
    id: subscription.id,
    user_id: uuid as string,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    //TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
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

  await sql`
    INSERT INTO subscriptions (
      id, user_id, status, price_id, quantity,
      cancel_at_period_end, cancel_at, canceled_at,
      created, ended_at, trial_start, trial_end, updated_at
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
  console.log(`Inserted/updated subscription [${subscription.id}] for user [${uuid}]`);

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};
