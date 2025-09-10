import { Subscription, SubscriptionPrice } from "@/app/interface/subcription";
import { sql } from "@/lib/db";
import Stripe from "stripe";
const TRIAL_PERIOD_DAYS = 7;
export async function upsertSubscriptionProduct(product: Subscription) {
  const rows = await sql/*sql*/ `
    INSERT INTO subscription(
      id, active, name, description, metadata
    ) VALUES (
      ${product.id},
      ${product.active},
      ${product.name},
      ${product.description},
      ${JSON.stringify(product.metadata ?? {})}::jsonb
    )
    ON CONFLICT (id) DO UPDATE SET
      active      = EXCLUDED.active,
      name        = EXCLUDED.name,
      description = EXCLUDED.description,
      metadata    = EXCLUDED.metadata ,
      updated_at  = now()
    RETURNING *;
  `;
  return rows[0];
}

export async function deleteSubscriptionProduct(id: string) {
  const rows = await sql`
    DELETE FROM subscription
    WHERE id = ${id}
    RETURNING id;
  `;
  return rows[0]?.id ?? null;
}
export async function upsertSubscriptionPrice(price: SubscriptionPrice) {
  const res = await sql/*sql*/ `
    INSERT INTO subscription_prices (
      id, product_id, active, currency, type,
      unit_amount, "interval", trial_period_days, metadata
    ) VALUES (
      ${price.id},
      ${price.product_id},
      ${price.active},
      ${price.currency},
      ${price.type},
      ${price.unit_amount ?? null},
      ${price.interval ?? null},
      ${price.trial_period_days ?? null},
    )
    ON CONFLICT (id) DO UPDATE SET
      product_id        = EXCLUDED.product_id,
      active            = EXCLUDED.active,
      currency          = EXCLUDED.currency,
      type              = EXCLUDED.type,
      unit_amount       = EXCLUDED.unit_amount,
      "interval"        = EXCLUDED."interval",
      trial_period_days = EXCLUDED.trial_period_days,
      updated_at        = now()
    RETURNING *;
  `;
  return res[0];
}

export async function deleteSubscriptionPrice(id: string) {
  const rows = await sql`
    DELETE FROM subscription_prices
    WHERE id = ${id}
    RETURNING id;
  `;
  return rows[0]?.id ?? null;
}
