// const stripe = require("stripe")(
//   process.env.STRIPE_SECRET_KEY
// );

// export async function CheckoutSessionStripe() {
//   const session = await stripe.checkout.sessions.create({
//     mode: "subscription",
//     line_items: [
//       {
//         price: "{{PRICE_ID}}",
//         quantity: 1,
//       },
//     ],
//     ui_mode: "embedded",
//     return_url:
//       "https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}",
//   });
//   return session;
// }
