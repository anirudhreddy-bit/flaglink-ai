"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ScanResult, Scan } from "@/lib/types";
import RiskBadge from "@/components/RiskBadge";
import { formatDistanceToNow } from "date-fns";

function AccountPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [history, setHistory] = useState<
    (Scan & { result: Omit<ScanResult, "redFlags" | "advice"> })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"account" | "history">("account");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "history" || tab === "account") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/account/history");
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };
    if (session?.user) {
      fetchHistory();
    }
  }, [session]);

  const handleVerifyPassword = async () => {
    setPasswordError("");
    if (!oldPassword) {
      setPasswordError("Current password is required");
      return;
    }
    setVerifyingPassword(true);
    try {
      const res = await fetch("/api/account/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-old-password", oldPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Failed to verify password");
        return;
      }
      setPasswordVerified(true);
    } catch {
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setVerifyingPassword(false);
    }
  };

  const handleResetPassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!newPassword || !confirmPassword) {
      setPasswordError("Both password fields are required");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("/api/account/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-password", newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Failed to reset password");
        return;
      }
      setPasswordSuccess("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordVerified(false);
      setShowPasswordReset(false);
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch {
      setPasswordError("An error occurred. Please try again.");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Loading your account...</span>
        </div>
      </div>
    );
  }

  if (status !== "authenticated" || !session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 py-5 sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Home
          </button>
          <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
            FlagLink<span className="text-indigo-600"> AI</span>
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl w-full px-6 py-14 flex-1">
        {/* Tabs */}
        <div className="flex gap-1 mb-10 bg-slate-100 rounded-lg p-1 max-w-xs">
          {(["account", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "account" ? "Account" : "History"}
            </button>
          ))}
        </div>

        {/* Account Tab */}
        {activeTab === "account" && (
          <section className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Account Details</h1>
              <p className="text-sm text-slate-500">Manage your account settings and password.</p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm space-y-6">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Name
                </label>
                <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                  <p className="text-base text-slate-800">{session.user.name || "Not set"}</p>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Email
                </label>
                <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                  <p className="text-base text-slate-800">{session.user.email}</p>
                </div>
              </div>

              {/* Password */}
              <div className="pt-4 border-t border-slate-100">
                {passwordSuccess && (
                  <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                    {passwordSuccess}
                  </div>
                )}

                {!showPasswordReset ? (
                  <button
                    onClick={() => {
                      setShowPasswordReset(true);
                      setPasswordError("");
                      setPasswordSuccess("");
                      setPasswordVerified(false);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                  >
                    Change Password
                  </button>
                ) : (
                  <div className="space-y-5">
                    <h3 className="text-base font-semibold text-slate-900">Change Password</h3>

                    {!passwordVerified ? (
                      <>
                        <p className="text-sm text-slate-500">Enter your current password to proceed.</p>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                            disabled={verifyingPassword}
                          />
                        </div>
                        {passwordError && (
                          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                            {passwordError}
                          </div>
                        )}
                        <div className="flex gap-3">
                          <button
                            onClick={handleVerifyPassword}
                            disabled={verifyingPassword || !oldPassword}
                            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {verifyingPassword ? "Verifying..." : "Verify"}
                          </button>
                          <button
                            onClick={() => {
                              setShowPasswordReset(false);
                              setOldPassword("");
                              setPasswordError("");
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-slate-500">Password verified. Enter your new password.</p>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                          />
                        </div>
                        {passwordError && (
                          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                            {passwordError}
                          </div>
                        )}
                        <div className="flex gap-3">
                          <button
                            onClick={handleResetPassword}
                            disabled={!newPassword || !confirmPassword}
                            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
                          >
                            Update Password
                          </button>
                          <button
                            onClick={() => {
                              setShowPasswordReset(false);
                              setOldPassword("");
                              setNewPassword("");
                              setConfirmPassword("");
                              setPasswordVerified(false);
                              setPasswordError("");
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <section className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Scan History</h1>
              <p className="text-sm text-slate-500">View your previous scan results.</p>
            </div>

            {history.length === 0 ? (
              <div className="rounded-2xl bg-white border border-slate-200 p-14 text-center shadow-sm">
                <p className="text-slate-400 mb-5">No scans yet.</p>
                <button
                  onClick={() => router.push("/")}
                  className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700"
                >
                  Scan Your First T&amp;C
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((scan) => (
                  <div
                    key={scan.id}
                    className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm transition-all hover:border-slate-300"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 mb-1 truncate">
                          {scan.website}
                        </h3>
                        <p className="text-xs text-slate-400 mb-3">
                          {formatDistanceToNow(new Date(scan.createdAt), { addSuffix: true })}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-slate-900 tabular-nums">
                            {scan.score.toFixed(0)}%
                          </span>
                          <RiskBadge riskLevel={scan.riskLevel} />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          sessionStorage.setItem("allScans", JSON.stringify(history));
                          sessionStorage.setItem("currentScanIndex", history.findIndex(h => h.id === scan.id).toString());
                          sessionStorage.setItem("scanResult", JSON.stringify({
                            riskLevel: scan.riskLevel,
                            score: scan.score,
                            redFlags: scan.redFlags,
                            advice: scan.advice,
                          }));
                          sessionStorage.setItem("scanInput", scan.input);
                          router.push("/results");
                        }}
                        className="shrink-0 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="flex items-center gap-3 text-slate-500">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm">Loading your account...</span>
          </div>
        </div>
      }
    >
      <AccountPageContent />
    </Suspense>
  );
}
