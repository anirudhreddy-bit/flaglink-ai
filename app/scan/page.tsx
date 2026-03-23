"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FlagLinkSidebar } from "@/components/ui/flaglink-sidebar";
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

// ── Types ─────────────────────────────────────────────────────────────────
interface RedFlag { clause: string; explanation: string; severity: string; }
interface ScanRecord {
  id: string;
  website: string;
  riskLevel: "green" | "yellow" | "red";
  score: number;
  redFlags: RedFlag[] | null;
  createdAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────
const scoreColor = (score: number) => {
  if (score >= 70) return "#ef4444";
  if (score >= 40) return "#f59e0b";
  return "#22c55e";
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const verdictLabel = (r: string) =>
  r === "green" ? "Low Risk" : r === "yellow" ? "Medium Risk" : "High Risk";

const tips = [
  "The average Terms & Conditions is 8,000 words — longer than most short stories.",
  "94% of people never read T&Cs before clicking 'I Agree'.",
  "Forced arbitration clauses appear in over 80% of major app T&Cs.",
  "Auto-renewal traps cost US consumers over $14 billion per year.",
];

// ── Animated counter hook ─────────────────────────────────────────────────
function useCountUp(target: number, active: boolean, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active || target === 0) { setValue(target); return; }
    let cancelled = false;
    const start = performance.now();
    const tick = (now: number) => {
      if (cancelled) return;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { cancelled = true; };
  }, [active, target, duration]);
  return value;
}

// ── Arrow icon ────────────────────────────────────────────────────────────
function ArrowIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8H12.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8.8 3.9L12.3 8L8.8 12.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────
function SkeletonCard({ h = 110, delay = 0 }: { h?: number; delay?: number }) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm"
      style={{ height: h, animationDelay: `${delay}s`, animation: "skPulse 1.6s ease-in-out infinite" }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function ScanPage() {
  const [input, setInput] = useState("");
  const [scanLoading, setScanLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { status } = useSession();

  // history state
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [animated, setAnimated] = useState(false);
  const [barWidths, setBarWidths] = useState<number[]>([]);
  const currentTip = useRef(tips[Math.floor(Math.random() * tips.length)]).current;

  useEffect(() => {
    // Wait until next-auth confirms the session is valid before fetching
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setHistoryLoading(false);
      setTimeout(() => setAnimated(true), 80);
      return;
    }
    fetch("/api/account/history")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setScans(data); })
      .catch(() => {})
      .finally(() => {
        setHistoryLoading(false);
        setTimeout(() => setAnimated(true), 80);
      });
  }, [status]);

  // Animate bar widths after animated=true
  useEffect(() => {
    if (!animated) return;
    const t = setTimeout(() => {
      setBarWidths(topRedFlags.map((f) => Math.round((f.count / (topRedFlags[0]?.count || 1)) * 100)));
    }, 200);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated]);

  // ── Derive stats from real data ─────────────────────────────────────────
  const totalScans = scans.length;
  const avgRiskScore =
    totalScans > 0 ? Math.round(scans.reduce((s, r) => s + r.score, 0) / totalScans) : 0;
  const scansUsed = Math.min(totalScans, 3);

  const recentScans = scans.slice(0, 5).map((s) => ({
    id: s.id,
    domain: s.website || "unknown",
    score: s.score,
    date: formatDate(s.createdAt),
    verdict: verdictLabel(s.riskLevel),
    riskLevel: s.riskLevel,
  }));

  // Aggregate clause occurrences across all scans
  const clauseMap: Record<string, number> = {};
  scans.forEach((s) => {
    (s.redFlags ?? []).forEach((f) => {
      const key = f.clause.trim();
      clauseMap[key] = (clauseMap[key] || 0) + 1;
    });
  });
  const topRedFlags = Object.entries(clauseMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([clause, count]) => ({ clause, count }));

  const chartData = scans
    .slice(0, 6)
    .reverse()
    .map((s) => ({ name: s.website || "unknown", score: s.score }));

  // ── Animated counters ────────────────────────────────────────────────────
  const animTotalScans = useCountUp(totalScans, animated);
  const animAvgScore   = useCountUp(avgRiskScore, animated);
  const animScansLeft  = useCountUp(Math.max(3 - scansUsed, 0), animated);

  // ── Scan handler ──────────────────────────────────────────────────────────
  const handleScan = async () => {
    if (!input.trim()) { setError("Please enter a URL or paste Terms & Conditions text."); return; }
    setError("");
    setScanLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong. Please try again."); return; }
      sessionStorage.setItem("scanResult", JSON.stringify(data));
      sessionStorage.setItem("scanInput", input.trim());
      router.push("/results");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setScanLoading(false);
    }
  };

  // ── CSS keyframes injected once ───────────────────────────────────────────
  const styles = `
    @keyframes skPulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideIn { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
    @keyframes popIn   { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
  `;

  const fadeCard = (delay: number) =>
    animated
      ? { animation: `fadeUp 0.5s ease both`, animationDelay: `${delay}s` }
      : { opacity: 0 };

  return (
    <div className="min-h-screen" style={{ background: "#f5f4f0" }}>
      <style>{styles}</style>

      {/* Sidebar — untouched */}
      <FlagLinkSidebar
        collapsible
        user={{ name: "flaglinkai", email: "user@example.com" }}
        scansUsed={scansUsed}
        plan="free"
        recentScans={recentScans.slice(0, 3).map((s) => ({
          id: s.id, domain: s.domain, score: s.score, date: s.date,
        }))}
      />

      <main className="pt-16 pb-20">

        {/* ── 1. Stats Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-3xl mx-auto px-4">
          {historyLoading ? (
            [0, 1, 2].map((i) => <SkeletonCard key={i} h={90} delay={i * 0.1} />)
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center"
                style={fadeCard(0)}>
                <p className="text-3xl font-bold text-gray-900">{animTotalScans}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Total Scans</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center"
                style={fadeCard(0.07)}>
                <p className="text-3xl font-bold" style={{ color: scoreColor(avgRiskScore) }}>
                  {animAvgScore}
                </p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Avg Risk Score</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center"
                style={fadeCard(0.14)}>
                <p className="text-3xl font-bold text-[#4f46e5]">{animScansLeft}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Scans Left</p>
              </div>
            </>
          )}
        </div>

        {/* ── 2. Scan Input Box ────────────────────────────────────────── */}
        <div className="w-full max-w-3xl mx-auto px-4 mb-4" style={fadeCard(0.18)}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-center font-bold mb-1"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, letterSpacing: "-0.02em", color: "#0f172a" }}>
              Ready to scan?
            </h2>
            <p className="text-center text-xs text-gray-400 mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
              Paste a URL or the full Terms &amp; Conditions below.
            </p>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); if (error) setError(""); }}
              placeholder={"Paste a URL (e.g. https://spotify.com/terms)\nor paste the full T&C text..."}
              disabled={scanLoading}
              rows={5}
              className="w-full resize-y rounded-xl bg-[#f9f8f5] border border-[#e2e1db] px-4 py-3 text-sm leading-relaxed text-[#0f172a] placeholder-[#aaa] outline-none transition-shadow focus:border-[#4f46e5] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.08)] mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            {error && <p className="text-xs text-red-700 mb-3">{error}</p>}
            <button
              type="button"
              onClick={handleScan}
              disabled={scanLoading || !input.trim()}
              className="w-full h-[50px] rounded-full bg-[#4f46e5] text-white flex items-center justify-center gap-2 font-semibold text-sm transition-all hover:bg-[#4338ca] hover:shadow-[0_8px_24px_rgba(79,70,229,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {scanLoading ? (
                <>
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="inline-block w-2 h-2 rounded-full bg-white"
                      style={{ animation: "pulse 1.5s infinite", animationDelay: `${i * 0.2}s` }} />
                  ))}
                  <span className="ml-1" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                    Analyzing…
                  </span>
                </>
              ) : (
                <><span>Scan for Red Flags</span><ArrowIcon /></>
              )}
            </button>
            <p className="text-center mt-3 text-[11px] text-gray-400 italic">
              Not legal advice. For informational purposes only.
            </p>
          </div>
        </div>

        {/* ── 3. Quick Scan Pills ──────────────────────────────────────── */}
        <div className="w-full max-w-3xl mx-auto px-4 mb-8" style={fadeCard(0.22)}>
          <p className="text-xs text-gray-400 mb-2 text-center">Try a popular service:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "Spotify",  url: "https://www.spotify.com/legal/end-user-agreement/" },
              { label: "Netflix",  url: "https://help.netflix.com/legal/termsofuse" },
              { label: "OpenAI",   url: "https://openai.com/policies/terms-of-use" },
              { label: "Adobe",    url: "https://www.adobe.com/legal/terms.html" },
              { label: "Dropbox",  url: "https://www.dropbox.com/terms" },
              { label: "Slack",    url: "https://slack.com/terms-of-service" },
            ].map(({ label, url }, i) => (
              <button
                key={label}
                onClick={() => setInput(url)}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-50 text-[#4f46e5] hover:bg-indigo-100 transition-colors border border-indigo-100"
                style={animated ? { animation: "popIn 0.4s ease both", animationDelay: `${0.26 + i * 0.04}s` } : { opacity: 0 }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 4. Recent Scans + Top Red Flags ──────────────────────────── */}
        <div className="w-full max-w-3xl mx-auto px-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {historyLoading ? (
            <><SkeletonCard h={240} delay={0.1} /><SkeletonCard h={240} delay={0.2} /></>
          ) : (
            <>
              {/* Recent Scans */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                style={fadeCard(0.28)}>
                <h3 className="text-sm font-semibold text-gray-800 mb-4">
                  Recent Scans
                  {totalScans === 0 && (
                    <span className="ml-2 text-xs font-normal text-gray-400">— none yet</span>
                  )}
                </h3>
                {totalScans === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">
                    Your scan history will appear here.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {recentScans.map((scan, i) => (
                      <div key={scan.id}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                        style={animated ? { animation: "slideIn 0.4s ease both", animationDelay: `${0.3 + i * 0.06}s` } : { opacity: 0 }}>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: scoreColor(scan.score) }} />
                          <span className="text-sm font-medium text-gray-800 truncate">{scan.domain}</span>
                          <span className="text-xs text-gray-400 flex-shrink-0">{scan.date}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: scoreColor(scan.score) + "18", color: scoreColor(scan.score) }}>
                            {scan.verdict}
                          </span>
                          <span className="text-sm font-bold w-7 text-right"
                            style={{ color: scoreColor(scan.score) }}>
                            {scan.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Red Flags */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                style={fadeCard(0.34)}>
                <h3 className="text-sm font-semibold text-gray-800 mb-4">
                  Top Red Flags Found
                  {topRedFlags.length === 0 && (
                    <span className="ml-2 text-xs font-normal text-gray-400">— none yet</span>
                  )}
                </h3>
                {topRedFlags.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">
                    Red flag patterns across your scans will appear here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {topRedFlags.map((flag, i) => (
                      <div key={i}
                        style={animated ? { animation: "fadeUp 0.4s ease both", animationDelay: `${0.36 + i * 0.07}s` } : { opacity: 0 }}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-gray-700 font-medium truncate pr-2">{flag.clause}</span>
                          <span className="text-xs font-bold text-gray-400 flex-shrink-0">{flag.count}×</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div className="h-1.5 rounded-full bg-[#ef4444]"
                            style={{
                              width: barWidths[i] !== undefined ? `${barWidths[i]}%` : "0%",
                              transition: `width 0.9s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`,
                            }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── 5. Risk Score Chart + Did You Know ───────────────────────── */}
        <div className="w-full max-w-3xl mx-auto px-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {historyLoading ? (
            <><SkeletonCard h={230} delay={0.15} /><SkeletonCard h={230} delay={0.25} /></>
          ) : (
            <>
              {/* Bar Chart */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                style={fadeCard(0.42)}>
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Risk Score by Domain</h3>
                {chartData.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-12">
                    Chart will populate after your first scan.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 20, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#9ca3af" }}
                        tickLine={false} axisLine={false} interval={0}
                        angle={-30} textAnchor="end" height={44} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }}
                        tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                        formatter={(value) => [`${value}`, "Risk Score"]}
                        cursor={{ fill: "rgba(0,0,0,0.03)" }}
                      />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={30}
                        isAnimationActive={true} animationDuration={900} animationEasing="ease-out">
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={scoreColor(entry.score)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Did You Know */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between"
                style={fadeCard(0.48)}>
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
                    <span className="font-semibold text-gray-600">10,000+</span> documents and counting.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── 6. Upgrade Nudge Banner ──────────────────────────────────── */}
        {!historyLoading && scansUsed >= 2 && (
          <div className="w-full max-w-3xl mx-auto px-4 mb-8" style={fadeCard(0.54)}>
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
