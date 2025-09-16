import { UUID } from "crypto";

export interface Subscription {
  id: string;
  user_id: UUID;
  status: string;
  price_id: string;
  quantity: number;
  cancel_at_period_end: boolean;
  cancel_at: string | null;
  canceled_at: string | null;
  created: string;
  ended_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
}

export interface SubscriptionProduct {
  id: string;
  description?: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}
export interface SubscriptionPrice {
  id: string;
  product_id: string; //product= subscription
  active: boolean;
  unit_amount?: number;
  currency: string;
  type: pricing_type;
  interval?: pricing_plan_interval;
  trial_period_days: number;
  created_at?: string;
  updated_at?: string;
}
export type pricing_type = "one_time" | "recurring";

export type pricing_plan_interval = "day" | "week" | "month" | "year";
export type subscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "paused"
  | "trialing"
  | "unpaid";
