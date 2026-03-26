import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const runtime = "nodejs";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { typescript: true });
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id || session.metadata?.userId;
      const subRaw = session.subscription;
      const custRaw = session.customer;
      const subscriptionId =
        typeof subRaw === "string" ? subRaw : subRaw && typeof subRaw === "object" && "id" in subRaw
          ? (subRaw as Stripe.Subscription).id
          : null;
      const customerId =
        typeof custRaw === "string" ? custRaw : custRaw && typeof custRaw === "object" && "id" in custRaw
          ? (custRaw as Stripe.Customer).id
          : null;

      if (userId && subscriptionId && customerId) {
        await db
          .update(users)
          .set({
            plan: "pro",
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
          })
          .where(eq(users.id, userId));
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const subId = subscription.id;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer?.id;

      const bySubRows = await db
        .select()
        .from(users)
        .where(eq(users.stripeSubscriptionId, subId))
        .limit(1);
      const bySub = bySubRows[0];
      if (bySub) {
        await db
          .update(users)
          .set({ plan: "free", stripeSubscriptionId: null })
          .where(eq(users.id, bySub.id));
      } else if (customerId) {
        const byCustomerRows = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);
        const byCustomer = byCustomerRows[0];
        if (byCustomer) {
          await db
            .update(users)
            .set({ plan: "free", stripeSubscriptionId: null })
            .where(eq(users.id, byCustomer.id));
        }
      }
    }
  } catch (e) {
    console.error("Stripe webhook handler error:", e);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}
