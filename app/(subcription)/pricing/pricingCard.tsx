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
    return new Intl.NumberFormat("en-US", {
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
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: product.price_id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create checkout session");
      }

      if (result.sessionId) {
        const stripe = await import("@stripe/stripe-js").then((m) =>
          m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        );

        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: result.sessionId,
          });

          if (error) {
            console.error("Stripe redirect error:", error);
            alert("Payment redirect failed: " + error.message);
          }
        } else {
          throw new Error("Failed to load Stripe");
        }
      } else if (result.errorRedirect) {
        window.location.href = result.errorRedirect;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error:", err?.message);
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
