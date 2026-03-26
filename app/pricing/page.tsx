"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, X, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [plan, setPlan] = useState<"free" | "pro" | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      setPlan(null);
      return;
    }
    fetch("/api/account/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.plan === "pro" || data?.plan === "free") setPlan(data.plan);
        else setPlan("free");
      })
      .catch(() => setPlan("free"));
  }, [status]);

  const handleUpgrade = async () => {
    if (status !== "authenticated") {
      router.push("/auth/signin?callbackUrl=/pricing");
      return;
    }
    setCheckoutError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.push("/auth/signin?callbackUrl=/pricing");
        return;
      }
      if (!res.ok) {
        const msg =
          typeof data.message === "string"
            ? data.message
            : typeof data.error === "string"
              ? data.error
              : "Could not start checkout. Check Stripe env vars and try again.";
        setCheckoutError(msg);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setCheckoutError("No checkout URL returned. Verify STRIPE_SECRET_KEY and STRIPE_PRO_PRICE_ID.");
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError("Network error — please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isPro = plan === "pro";
  const sessionLoading = status === "loading";

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <Link
          href={session ? "/scan" : "/"}
          className="text-xs text-indigo-600 font-medium hover:underline mb-6 inline-block"
        >
          ← {session ? "Back to dashboard" : "Home"}
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
          Stop blindly clicking <span className="text-[#4f46e5]">&apos;I Agree.&apos;</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Know what you&apos;re actually signing in 15 seconds. Protect your data, avoid hidden fees, and sign with
          confidence.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Free Tier */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm opacity-90">
          <h3 className="text-xl font-bold text-gray-900">Basic Scanner</h3>
          <p className="text-gray-500 text-sm mt-2">For occasional signups.</p>
          <div className="my-6">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-gray-500">/forever</span>
          </div>
          <ul className="space-y-3 mb-8 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500 shrink-0" /> 3 scans per month
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500 shrink-0" /> Basic red flag detection
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <X className="w-4 h-4 shrink-0" /> No plain-English negotiation advice
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <X className="w-4 h-4 shrink-0" /> No shareable public reports
            </li>
          </ul>
          {sessionLoading ? (
            <button
              disabled
              className="w-full py-3 rounded-xl font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
            >
              Loading…
            </button>
          ) : !session ? (
            <Link
              href="/auth/signin?callbackUrl=/pricing"
              className="block w-full py-3 rounded-xl font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors text-center"
            >
              Sign in to get started
            </Link>
          ) : isPro ? (
            <button
              disabled
              className="w-full py-3 rounded-xl font-semibold bg-gray-100 text-gray-500 cursor-not-allowed"
            >
              Included with Pro
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 rounded-xl font-semibold bg-gray-100 text-gray-600 cursor-not-allowed"
            >
              Your current plan
            </button>
          )}
        </div>

        {/* Pro Tier */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#4f46e5] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              <Zap className="w-3 h-3" /> Most Popular
            </div>
            <h3 className="text-xl font-bold">FlagLink Pro</h3>
            <p className="text-indigo-200 text-sm mt-2">Deep analysis for power users.</p>
            <div className="my-6">
              <span className="text-4xl font-bold">$4.99</span>
              <span className="text-indigo-200">/mo</span>
            </div>
            {checkoutError && (
              <div
                role="alert"
                className="mb-4 rounded-xl bg-white/15 border border-white/25 px-3 py-2 text-left text-xs text-white leading-relaxed"
              >
                {checkoutError}
              </div>
            )}
            <ul className="space-y-3 mb-8 text-sm text-indigo-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white shrink-0" /> Unlimited deep scans
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white shrink-0" /> Detects all 15 hidden trap types
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white shrink-0" /> Plain-English negotiation advice
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white shrink-0" /> Shareable public report links
              </li>
            </ul>
            {isPro ? (
              <button
                disabled
                className="w-full py-3 rounded-xl font-bold bg-white/30 text-white cursor-not-allowed"
              >
                You&apos;re on Pro
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={isLoading || sessionLoading}
                className="w-full py-3 rounded-xl font-bold bg-white text-[#4f46e5] hover:bg-gray-50 transition-colors disabled:opacity-70"
              >
                {isLoading ? "Loading…" : "Upgrade to Pro →"}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
