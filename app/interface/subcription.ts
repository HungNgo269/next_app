export interface Subscription {
  id: string;
  active: boolean;
  description?: string | null;
  name: string;
  metadata?: Record<string, any>;
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
