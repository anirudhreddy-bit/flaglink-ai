import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/auth";
import Stripe from "stripe";

export const runtime = "nodejs";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { typescript: true });
}

function appOrigin(request: NextRequest): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    request.nextUrl.origin
  );
}

async function resolveUserId(request: NextRequest): Promise<string | undefined> {
  const session = await getServerSession(authOptions);
  const fromSession = (session?.user as { id?: string } | undefined)?.id;
  if (fromSession) return fromSession;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  return token?.id as string | undefined;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXTAUTH_SECRET) {
      console.error("Checkout: NEXTAUTH_SECRET is not set");
      return NextResponse.json(
        { error: "Server misconfiguration", message: "NEXTAUTH_SECRET is missing" },
        { status: 500 }
      );
    }

    const userId = await resolveUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const priceId = process.env.STRIPE_PRO_PRICE_ID?.trim();
    if (!priceId) {
      return NextResponse.json(
        {
          error: "Stripe is not configured",
          message: "Set STRIPE_PRO_PRICE_ID in your environment (Stripe Dashboard → Product → Price ID).",
        },
        { status: 500 }
      );
    }

    if (priceId.startsWith("prod_")) {
      return NextResponse.json(
        {
          error: "Wrong Stripe ID type",
          message:
            "STRIPE_PRO_PRICE_ID must be a Price ID (starts with price_), not a Product ID (prod_). In Stripe: open your product → under Pricing copy the Price ID.",
        },
        { status: 400 }
      );
    }

    const origin = appOrigin(request);
    const stripe = getStripe();

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/scan?subscription=success`,
      cancel_url: `${origin}/pricing?canceled=true`,
      client_reference_id: userId,
      metadata: { userId },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Checkout failed", message: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Stripe Checkout Error:", e);
    return NextResponse.json(
      { error: "Checkout failed", message },
      { status: 500 }
    );
  }
}
