import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/**
 * Lazily initialized Stripe client. Returns null when STRIPE_SECRET_KEY is
 * not configured so the app can run (donations UI visible, checkout
 * disabled) before an administrator adds real credentials.
 */
export function getStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2024-06-20",
    });
  }
  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY);
}
