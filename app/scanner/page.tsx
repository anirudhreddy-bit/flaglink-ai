"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ScannerPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const handleScan = async () => {
    if (!input.trim()) {
      setError("Please enter a URL or paste Terms & Conditions text.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("scanResult", JSON.stringify(data));
      sessionStorage.setItem("scanInput", input.trim());
      router.push("/results");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ─── Header ─── */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 py-5 sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ← Back
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-black">
                FL
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                FlagLink
                <span className="text-indigo-600"> AI</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <Link
                href="/account?tab=account"
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                My Account
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 shadow-sm"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── Scanner Section ─── */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl">
          {/* Title */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Ready to Scan
            </h1>
            <p className="text-lg text-slate-600 max-w-lg mx-auto">
              Paste a link to Terms & Conditions or enter the text directly below. We'll analyze it for hidden red flags.
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 space-y-6">
            {/* Text Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                URL or Text
              </label>
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Paste a URL (https://example.com/terms) or paste the full Terms & Conditions text here..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                rows={8}
              />
              <p className="text-xs text-slate-500 mt-2">
                Minimum 50 characters required
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Scan Button */}
            <button
              onClick={handleScan}
              disabled={loading || !input.trim()}
              className="w-full px-6 py-3.5 rounded-lg bg-indigo-600 text-white text-base font-semibold transition-all hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </div>
              ) : (
                "Scan for Red Flags"
              )}
            </button>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">100%</p>
                <p className="text-xs text-slate-500 mt-1">Private & Secure</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">&lt;10s</p>
                <p className="text-xs text-slate-500 mt-1">Analysis Time</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
