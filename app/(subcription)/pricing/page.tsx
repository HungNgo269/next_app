import { auth } from "@/auth";
import PricingCard from "../../ui/user/subscription/pricingCard";
import {
  getCurrentSubscription,
  getSubscriptionProducts,
} from "@/app/data/subscriptions";

export default async function PricingPage() {
  const session = await auth();
  const products = await getSubscriptionProducts();
  const currentSubscription = session?.user
    ? await getCurrentSubscription()
    : null;

  return (
    <div className="h-fit bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground">
            Unlock premium features and unlimited access to all books
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product: any) => (
            <PricingCard
              key={product.price_id}
              product={product}
              currentSubscription={currentSubscription}
              isLoggedIn={!!session?.user}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a {products[0]?.trial_period_days || 7}-day free
            trial. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
