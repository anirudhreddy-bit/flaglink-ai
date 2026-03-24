"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SignInContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  const { status } = useSession();

  // If session is still valid, skip sign-in and go straight to scan
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/scan");
    }
  }, [status, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result?.ok) {
      if (result?.error === "CredentialsSignin") {
        setError("Invalid email or password. Please check and try again.");
      } else {
        setError(result?.error || "An error occurred. Please try again.");
      }
      setLoading(false);
      return;
    }

    router.push("/scan");
  };

  const handleGitHubSignIn = () => {
    signIn("github", { callbackUrl: "/" });
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
          FlagLink<span className="text-indigo-600"> AI</span>
        </h1>
        <p className="text-sm text-slate-500">Sign in to your account</p>
      </div>

      {/* Success banner after signup */}
      {justRegistered && (
        <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-center">
          <p className="text-sm font-semibold text-emerald-700 mb-0.5">
            Account created successfully!
          </p>
          <p className="text-xs text-emerald-500">
            Sign in below to get started.
          </p>
        </div>
      )}

      {/* Form Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm space-y-6">
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="you@example.com"
              className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Enter your password"
              className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400">Or continue with</span>
          </div>
        </div>

        {/* GitHub */}
        <button
          onClick={handleGitHubSignIn}
          disabled={loading}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:border-slate-300 disabled:opacity-50"
        >
          GitHub
        </button>

        {/* Sign Up Link */}
        <div className="text-center pt-2">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-16">
      <Suspense fallback={<div className="text-slate-400 text-sm">Loading...</div>}>
        <SignInContent />
      </Suspense>
    </div>
  );
}

