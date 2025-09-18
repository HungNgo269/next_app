import { UUID } from "crypto";

export interface UserStripe {
  id: UUID;
  stripe_customer_id: string;
}
