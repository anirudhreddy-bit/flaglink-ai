"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

// ── Stub data ──────────────────────────────────────────────────────────────
const scansUsed = 2;
const totalScans = 12;
const avgRiskScore = 64;

const recentScans = [
  { id: "1", domain: "spotify.com",  score: 72, date: "Today",     verdict: "High Risk"   },
  { id: "2", domain: "netflix.com",  score: 45, date: "Yesterday", verdict: "Medium Risk" },
  { id: "3", domain: "adobe.com",    score: 81, date: "Mar 20",    verdict: "High Risk"   },
  { id: "4", domain: "github.com",   score: 22, date: "Mar 18",    verdict: "Low Risk"    },
  { id: "5", domain: "dropbox.com",  score: 58, date: "Mar 15",    verdict: "Medium Risk" },
];

const topRedFlags = [
  { clause: "Forced arbitration",       count: 8 },
  { clause: "Data sold to advertisers", count: 6 },
  { clause: "Auto-renewal hidden",      count: 5 },
  { clause: "IP ownership grab",        count: 3 },
  { clause: "No cancellation reminder", count: 2 },
];

const chartData = [
  { name: "spotify.com",  score: 72 },
  { name: "netflix.com",  score: 45 },
  { name: "adobe.com",    score: 81 },
  { name: "github.com",   score: 22 },
  { name: "dropbox.com",  score: 58 },
  { name: "slack.com",    score: 66 },
];

const tips = [
  "The average Terms & Conditions is 8,000 words — longer than most short stories.",
  "94% of people never read T&Cs before clicking 'I Agree'.",
  "Forced arbitration clauses appear in over 80% of major app T&Cs.",
  "Auto-renewal traps cost US consumers over $14 billion per year.",
];
const currentTip = tips[Math.floor(Math.random() * tips.length)];

const scoreColor = (score: number) => {
  if (score >= 70) return "#ef4444";
  if (score >= 40) return "#f59e0b";
  return "#22c55e";
};

// ── Component ──────────────────────────────────────────────────────────────
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

      {/* ── Header ──────────────────────────────────────────────────────── */}
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
                FlagLink<span className="text-indigo-600"> AI</span>
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

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-1 py-10">

        {/* 1 ─ Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{totalScans}</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
              Total Scans
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-3xl font-bold" style={{ color: scoreColor(avgRiskScore) }}>
              {avgRiskScore}
            </p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
              Avg Risk Score
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-3xl font-bold text-[#4f46e5]">{3 - scansUsed}</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
              Scans Left
            </p>
          </div>
        </div>

        {/* 2 ─ Scan Input Box */}
        <div className="w-full max-w-3xl mx-auto px-4 mb-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <label className="block text-sm font-semibold text-slate-900">
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
              rows={5}
            />
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            <button
              onClick={handleScan}
              disabled={loading || !input.trim()}
              className="w-full px-6 py-3 rounded-lg bg-indigo-600 text-white text-base font-semibold transition-all hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm"
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
          </div>
        </div>

        {/* 3 ─ Quick Scan Pills */}
        <div className="w-full max-w-3xl mx-auto px-4 mb-8">
          <p className="text-xs text-gray-400 mb-2 text-center">Try a popular service:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "Spotify",  url: "https://www.spotify.com/legal/end-user-agreement/" },
              { label: "Netflix",  url: "https://help.netflix.com/legal/termsofuse" },
              { label: "OpenAI",   url: "https://openai.com/policies/terms-of-use" },
              { label: "Adobe",    url: "https://www.adobe.com/legal/terms.html" },
              { label: "Dropbox",  url: "https://www.dropbox.com/terms" },
              { label: "Slack",    url: "https://slack.com/terms-of-service" },
            ].map(({ label, url }) => (
              <button
                key={label}
                onClick={() => setInput(url)}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-50 text-[#4f46e5] hover:bg-indigo-100 transition-colors border border-indigo-100"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 ─ Recent Scans + Top Red Flags */}
        <div className="w-full max-w-3xl mx-auto px-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Recent Scan History */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Recent Scans</h3>
            <div className="space-y-1">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: scoreColor(scan.score) }}
                    />
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {scan.domain}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{scan.date}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: scoreColor(scan.score) + "18",
                        color: scoreColor(scan.score),
                      }}
                    >
                      {scan.verdict}
                    </span>
                    <span
                      className="text-sm font-bold w-7 text-right"
                      style={{ color: scoreColor(scan.score) }}
                    >
                      {scan.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Red Flags */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Top Red Flags Found</h3>
            <div className="space-y-3">
              {topRedFlags.map((flag, i) => {
                const maxCount = topRedFlags[0].count;
                const pct = Math.round((flag.count / maxCount) * 100);
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-700 font-medium truncate pr-2">
                        {flag.clause}
                      </span>
                      <span className="text-xs font-bold text-gray-400 flex-shrink-0">
                        {flag.count}×
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full bg-[#ef4444]"
                        style={{ width: `${pct}%`, transition: "width 0.8s ease" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 5 ─ Risk Score Chart + Did You Know */}
        <div className="w-full max-w-3xl mx-auto px-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Risk Score Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Risk Score by Domain</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 4, bottom: 20, left: -20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={44}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
                  }}
                  formatter={(value: number) => [`${value}`, "Risk Score"]}
                  cursor={{ fill: "rgba(0,0,0,0.03)" }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={30}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={scoreColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Did You Know */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💡</span>
                <h3 className="text-sm font-semibold text-gray-800">Did You Know?</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{currentTip}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-50">
              <p className="text-xs text-gray-400">
                FlagLink AI has analyzed{" "}
                <span className="font-semibold text-gray-600">10,000+</span> documents and
                counting.
              </p>
            </div>
          </div>

        </div>

        {/* 6 ─ Upgrade Nudge Banner (only when scansUsed >= 2) */}
        {scansUsed >= 2 && (
          <div className="w-full max-w-3xl mx-auto px-4 mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold text-sm">
                  You&apos;ve used {scansUsed}/3 free scans
                </p>
                <p className="text-indigo-200 text-xs mt-0.5">
                  Upgrade to Pro for unlimited scans, deeper analysis, and export reports.
                </p>
              </div>
              <button className="flex-shrink-0 bg-white text-indigo-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors whitespace-nowrap">
                Upgrade →
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
