// import Stripe from "stripe";

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error("NEXT_PRIVATE_STRIPE_API_KEY is required");
// }

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   // https://github.com/stripe/stripe-node#configuration
//   // https://stripe.com/docs/api/versioning
//   // @ts-ignore
//   apiVersion: "2024-06-20", // Register this as an official Stripe plugin.
//   // https://stripe.com/docs/building-plugins#setappinfo

//   appInfo: {
//     name: "Next Book",
//     version: "0.0.0",
//     url: process.env.NEXT_PUBLIC_BASE_URL,
//   },
// });
