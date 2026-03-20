"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScanResult, Scan } from "@/lib/types";
import RiskBadge from "@/components/RiskBadge";
import RedFlagCard from "@/components/RedFlagCard";
import ScoreMeter from "@/components/ScoreMeter";

export default function ResultsPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [allScans, setAllScans] = useState<Scan[]>([]);
  const [currentScanIndex, setCurrentScanIndex] = useState(-1);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("scanResult");
    if (!stored) {
      router.push("/");
      return;
    }
    try {
      setResult(JSON.parse(stored));
    } catch {
      router.push("/");
    }

    const allScansStored = sessionStorage.getItem("allScans");
    if (allScansStored) {
      try {
        const scans = JSON.parse(allScansStored);
        setAllScans(scans);
        const currentIndex = sessionStorage.getItem("currentScanIndex");
        if (currentIndex !== null) {
          setCurrentScanIndex(parseInt(currentIndex, 10));
        }
      } catch {
        // ignore
      }
    }
  }, [router]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
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

  const highFlags = result.redFlags.filter((f) => f.severity === "high");
  const mediumFlags = result.redFlags.filter((f) => f.severity === "medium");
  const lowFlags = result.redFlags.filter((f) => f.severity === "low");
  const sortedFlags = [...highFlags, ...mediumFlags, ...lowFlags];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 py-5 sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            onClick={() => allScans.length > 0 ? router.push("/account") : router.push("/")}
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
            <button
              onClick={handleShare}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              {copied ? "Copied!" : "Share"}
            </button>
            <button
              onClick={() => router.push("/")}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-700 shadow-sm"
            >
              New Scan
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl w-full px-6 py-14 flex-1">
        {/* Top: Badge + Score */}
        <div className="mb-14 flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-between rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <RiskBadge riskLevel={result.riskLevel} />
            <p className="text-sm text-slate-500">
              {result.redFlags.length} red flag{result.redFlags.length !== 1 && "s"} found
            </p>
          </div>
          <ScoreMeter score={result.score} />
        </div>

        {/* Red Flags */}
        {sortedFlags.length > 0 && (
          <section className="mb-14">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Red Flags
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {sortedFlags.map((flag, i) => (
                <RedFlagCard key={i} flag={flag} />
              ))}
            </div>
          </section>
        )}

        {/* Advice */}
        {result.advice.length > 0 && (
          <section className="mb-14">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              What to Do
            </h2>
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

        {/* Disclaimer */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-6 py-4 text-center">
          <p className="text-sm text-amber-700">
            <strong>Disclaimer:</strong> Not legal advice. For informational purposes
            only. Always consult a qualified attorney for legal matters.
          </p>
        </div>

        {/* Scan navigation */}
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
