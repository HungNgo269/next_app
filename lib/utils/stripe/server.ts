"use server";

import Stripe from "stripe";

import { SubscriptionPrice } from "@/app/interface/subcription";
import { auth } from "@/auth";
import { createOrRetrieveCustomer } from "@/app/data/subscriptions";
import {
  calculateTrialEndUnixTimestamp,
  getErrorRedirect,
  getURL,
} from "../helper";

type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

export async function checkoutWithStripe(
  price: SubscriptionPrice,
  redirectPath: string = "/account"
): Promise<CheckoutResponse> {
  try {
    const sessionApp = await auth();
    const user = sessionApp?.user;
    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user?.id || "",
        email: user?.email || "",
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to access customer record.");
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer,
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      cancel_url: getURL(),
      success_url: getURL(redirectPath),
    };

    console.log(
      "Trial end:",
      calculateTrialEndUnixTimestamp(price.trial_period_days)
    );
    if (price.type === "recurring") {
      params = {
        ...params,
        mode: "subscription",
        subscription_data: {
          trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days),
        },
      };
    } else if (price.type === "one_time") {
      params = {
        ...params,
        mode: "payment",
      };
    }
    let session;
    try {
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

      session = await stripe.checkout.sessions.create(params);
    } catch (err) {
      console.error(err);
      throw new Error("Unable to create checkout session.");
    }

    if (session) {
      return { sessionId: session.id };
    } else {
      throw new Error("Unable to create checkout session.");
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          error.message,
          "Please try again later or contact a system administrator."
        ),
      };
    } else {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          "An unknown error occurred.",
          "Please try again later or contact a system administrator."
        ),
      };
    }
  }
}

export async function createStripePortal(currentPath: string) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      throw new Error("Not authenticated");
    }
    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id,
        email: user.email || "",
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to access customer record.");
    }

    if (!customer) {
      throw new Error("Could not get customer.");
    }

    try {
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

      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL("/account"),
      });
      if (!url) {
        throw new Error("Could not create billing portal");
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error("Could not create billing portal");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return getErrorRedirect(
        currentPath,
        error.message,
        "Please try again later or contact a system administrator."
      );
    } else {
      return getErrorRedirect(
        currentPath,
        "An unknown error occurred.",
        "Please try again later or contact a system administrator."
      );
    }
  }
}
