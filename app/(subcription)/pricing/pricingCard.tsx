"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { createCheckoutSession } from "@/app/actions/subcriptionsActions";

interface PricingCardProps {
  product: any;
  currentSubscription: any;
  isLoggedIn: boolean;
}

export default function PricingCard({
  product,
  currentSubscription,
  isLoggedIn,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isCurrentPlan = currentSubscription?.price_id === product.price_id;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("us-US", {
      style: "currency",
      currency: product.currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      router.push("/login?callbackUrl=/pricing");
      return;
    }

    setLoading(true);
    try {
      const result = await createCheckoutSession(product.price_id);

      if (result.sessionId) {
        // Redirect to Stripe Checkout
        const stripe = await import("@stripe/stripe-js").then((m) =>
          m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        );

        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: result.sessionId });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Unlimited book access",
    "Ad-free reading",
    "Offline download",
    "Early access to new releases",
    "Exclusive content",
    "Priority support",
  ];

  return (
    <Card className={isCurrentPlan ? "border-primary" : ""}>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <span className="text-3xl font-bold">
            {formatPrice(product.unit_amount)}
          </span>
          <span className="text-muted-foreground">/{product.interval}</span>
        </div>

        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSubscribe}
          disabled={loading || isCurrentPlan}
        >
          {loading
            ? "Processing..."
            : isCurrentPlan
            ? "Current Plan"
            : isLoggedIn
            ? "Subscribe Now"
            : "Sign In to Subscribe"}
        </Button>
      </CardFooter>
    </Card>
  );
}
