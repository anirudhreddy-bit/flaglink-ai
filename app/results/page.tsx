"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScanResult, Scan } from "@/lib/types";
import RiskBadge from "@/components/RiskBadge";
import ScoreMeter from "@/components/ScoreMeter";

// ── Upgrade gate toggle (set true to test Pro view) ───────────────────────
const isPro = false;

// ── Severity helpers ──────────────────────────────────────────────────────
const severityColor = (s: string) => {
  if (s === "critical" || s === "high") return "#ef4444";
  if (s === "medium") return "#f59e0b";
  return "#6b7280";
};

const severityBg = (s: string) => {
  if (s === "critical" || s === "high") return "#fef2f2";
  if (s === "medium") return "#fffbeb";
  return "#f9fafb";
};

// ── Domain extractor ──────────────────────────────────────────────────────
const extractDomain = (input: string) => {
  try {
    const url = new URL(input.trim());
    return url.hostname.replace("www.", "");
  } catch {
    return "Pasted Document";
  }
};

export default function ResultsPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [domain, setDomain] = useState("Document");
  const [copied, setCopied] = useState(false);
  const [allScans, setAllScans] = useState<Scan[]>([]);
  const [currentScanIndex, setCurrentScanIndex] = useState(-1);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("scanResult");
    if (!stored) { router.push("/"); return; }
    try {
      setResult(JSON.parse(stored));
    } catch {
      router.push("/");
    }

    const rawInput = sessionStorage.getItem("scanInput") || "";
    setDomain(extractDomain(rawInput));

    const allScansStored = sessionStorage.getItem("allScans");
    if (allScansStored) {
      try {
        const scans = JSON.parse(allScansStored);
        setAllScans(scans);
        const idx = sessionStorage.getItem("currentScanIndex");
        if (idx !== null) setCurrentScanIndex(parseInt(idx, 10));
      } catch { /* ignore */ }
    }
  }, [router]);

  const handleShare = async () => {
    if (!isPro) return;
    try {
      await navigator.clipboard.writeText(
        `https://flaglink.ai/report/${domain}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navigateScan = (direction: "next" | "prev") => {
    const newIndex = direction === "next" ? currentScanIndex + 1 : currentScanIndex - 1;
    if (newIndex < 0 || newIndex >= allScans.length) return;
    const scan = allScans[newIndex];
    const scanResult = {
      riskLevel: scan.riskLevel,
      score: scan.score,
      redFlags: scan.redFlags,
      advice: scan.advice,
    };
    sessionStorage.setItem("scanResult", JSON.stringify(scanResult));
    sessionStorage.setItem("currentScanIndex", newIndex.toString());
    setCurrentScanIndex(newIndex);
    setResult(scanResult);
    window.scrollTo(0, 0);
  };

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Loading results...</span>
        </div>
      </div>
    );
  }

  const highFlags  = result.redFlags.filter((f) => f.severity === "high");
  const mediumFlags = result.redFlags.filter((f) => f.severity === "medium");
  const lowFlags   = result.redFlags.filter((f) => f.severity === "low");
  const sortedFlags = [...highFlags, ...mediumFlags, ...lowFlags];
  const scanScore  = result.score;
  const hiddenCount = Math.max(sortedFlags.length - 3, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 py-5 sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            onClick={() => {
              const fromHistory = sessionStorage.getItem("fromHistory");
              sessionStorage.removeItem("fromHistory");
              router.push(fromHistory ? "/history" : "/scan");
            }}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>

          <div className="text-center">
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
              FlagLink<span className="text-indigo-600"> AI</span>
            </h1>
            {allScans.length > 0 && currentScanIndex >= 0 && (
              <p className="text-xs text-slate-400 mt-0.5">
                Scan {currentScanIndex + 1} of {allScans.length}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* ── Mechanic 3: Gated Share Button ── */}
            <div className="relative group">
              <button
                onClick={handleShare}
                className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${
                  isPro
                    ? "border-indigo-200 bg-indigo-50 text-[#4f46e5] hover:bg-indigo-100"
                    : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                {copied ? "Copied!" : "Share Report"}
                {!isPro && (
                  <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full font-bold ml-0.5">
                    PRO
                  </span>
                )}
              </button>

              {/* Hover tooltip for free users */}
              {!isPro && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-gray-900 text-white text-xs rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                  <p className="font-semibold mb-1">Pro feature</p>
                  <p className="text-gray-300 leading-relaxed mb-2">
                    Share a public link to this report. Great for warning friends or posting on Reddit.
                  </p>
                  <a href="/pricing" className="text-indigo-400 font-semibold hover:text-indigo-300 pointer-events-auto">
                    Upgrade to Pro →
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={() => router.push("/scan")}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-700 shadow-sm"
            >
              New Scan
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl w-full px-6 py-14 flex-1">

        {/* ── Score + Badge ─────────────────────────────────────────────── */}
        <div className="mb-14 flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-between rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <RiskBadge riskLevel={result.riskLevel} />
            <p className="text-sm text-slate-500">
              {result.redFlags.length} red flag{result.redFlags.length !== 1 && "s"} found
            </p>
          </div>
          <ScoreMeter score={result.score} />
        </div>

        {/* ── Red Flags ─────────────────────────────────────────────────── */}
        {sortedFlags.length > 0 && (
          <section className="mb-6">

            {/* ── Mechanic 3: Scan result header row with gated share ── */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                  Scan result
                </p>
                <h2 className="text-xl font-bold text-slate-900">{domain}</h2>
              </div>
              <p className="text-sm text-slate-500">
                {sortedFlags.length} flag{sortedFlags.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* ── Mechanic 1: Flags list with blur on last 2 for free users ── */}
            <div className="space-y-3">
              {sortedFlags.map((flag, index) => {
                const isLocked = !isPro && index >= 3;

                return (
                  <div key={index} className="relative">

                    {/* Flag card */}
                    <div
                      className="flex items-start gap-3 p-4 rounded-xl border transition-all"
                      style={{
                        background: severityBg(flag.severity),
                        borderColor: severityColor(flag.severity) + "33",
                        filter: isLocked ? "blur(4px)" : "none",
                        userSelect: isLocked ? "none" : "auto",
                        pointerEvents: isLocked ? "none" : "auto",
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: severityColor(flag.severity) }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {flag.clause}
                          </p>
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0"
                            style={{
                              color: severityColor(flag.severity),
                              background: severityColor(flag.severity) + "18",
                            }}
                          >
                            {flag.severity}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {flag.explanation}
                        </p>
                      </div>
                    </div>

                    {/* Lock overlay — only rendered on index 3 (first blurred card) */}
                    {isLocked && index === 3 && (
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center rounded-xl z-10"
                        style={{ background: "rgba(255,255,255,0.85)" }}
                      >
                        <p className="text-sm font-semibold text-gray-800 mb-1">
                          {hiddenCount} more red flag{hiddenCount !== 1 ? "s" : ""} hidden
                        </p>
                        <p className="text-xs text-gray-400 mb-3 text-center max-w-xs">
                          Upgrade to Pro to see every clause flagged in this document
                        </p>
                        <a href="/pricing">
                          <button className="bg-[#4f46e5] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#4338ca] transition-colors">
                            Unlock Full Report →
                          </button>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Mechanic 2: High-risk upgrade prompt ── */}
            {scanScore >= 70 && !isPro && (
              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 text-sm font-bold">!</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-700 mb-1">
                      This service scored {scanScore}/100 — that&apos;s high risk
                    </p>
                    <p className="text-xs text-red-400 leading-relaxed mb-4">
                      Pro users get plain-English negotiation advice, exact clauses to challenge,
                      and a full breakdown of every red flag in this document.
                    </p>

                    {/* Blurred advice preview */}
                    <div className="relative mb-4">
                      <div className="space-y-2 blur-sm pointer-events-none select-none">
                        {[
                          "Ask them to remove the arbitration clause in writing.",
                          "Use a virtual card to prevent surprise renewals.",
                        ].map((tip, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                            {tip}
                          </div>
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                          Pro only
                        </span>
                      </div>
                    </div>

                    <a href="/pricing">
                      <button className="w-full bg-[#4f46e5] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#4338ca] transition-colors">
                        Get Pro — See Full Advice →
                      </button>
                    </a>
                    <p className="text-xs text-red-300 text-center mt-2">
                      $4.99/mo · Cancel anytime · Instant access
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Advice (What to Do) ───────────────────────────────────────── */}
        {result.advice.length > 0 && (
          <section className="mb-14">
            <h2 className="mb-6 text-xl font-bold text-slate-900">What to Do</h2>
            <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
              <ul className="space-y-4">
                {result.advice.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm text-slate-600">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600 border border-emerald-200">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── Disclaimer ────────────────────────────────────────────────── */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-6 py-4 text-center">
          <p className="text-sm text-amber-700">
            <strong>Disclaimer:</strong> Not legal advice. For informational purposes
            only. Always consult a qualified attorney for legal matters.
          </p>
        </div>

        {/* ── Scan navigation ───────────────────────────────────────────── */}
        {allScans.length > 1 && currentScanIndex >= 0 && (
          <div className="mt-14 flex items-center justify-center gap-6">
            <button
              onClick={() => navigateScan("prev")}
              disabled={currentScanIndex === 0}
              className="rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-slate-400 tabular-nums">
              {currentScanIndex + 1} / {allScans.length}
            </span>
            <button
              onClick={() => navigateScan("next")}
              disabled={currentScanIndex === allScans.length - 1}
              className="rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 px-6 py-8 text-center bg-white">
        <p className="text-xs text-slate-400">
          Not legal advice. For informational purposes only. &copy; {new Date().getFullYear()} FlagLink AI
        </p>
      </footer>
    </div>
  );
}
