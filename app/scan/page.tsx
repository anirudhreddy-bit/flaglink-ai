"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FlagLinkSidebar } from "@/components/ui/flaglink-sidebar";
import { SessionGuard } from "@/components/SessionGuard";
import { motion } from "framer-motion";
import { RecentScans, ScanItem as RScanItem } from "@/components/ui/recent-scans";


// ── Types ─────────────────────────────────────────────────────────────────
interface RedFlag { clause: string; explanation: string; severity: string; }
interface ScanRecord {
  id: string;
  input: string;
  website: string | null;
  riskLevel: "green" | "yellow" | "red";
  score: number;
  redFlags: RedFlag[] | null;
  advice: string[] | unknown;
  createdAt: string;
}

function pushSavedScanToResults(
  scan: Pick<ScanRecord, "website" | "input" | "riskLevel" | "score" | "redFlags" | "advice">,
  router: { push: (href: string) => void }
) {
  sessionStorage.setItem(
    "scanResult",
    JSON.stringify({
      domain: scan.website,
      riskLevel: scan.riskLevel,
      score: scan.score,
      redFlags: scan.redFlags,
      advice: scan.advice,
    })
  );
  sessionStorage.setItem("scanInput", scan.input || scan.website || "");
  router.push("/results");
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

const domainIcon = (domain: string): string => {
  const d = domain.toLowerCase();
  if (d.includes("spotify"))  return "🎵";
  if (d.includes("netflix"))  return "🎬";
  if (d.includes("youtube"))  return "▶️";
  if (d.includes("google"))   return "🔍";
  if (d.includes("amazon"))   return "📦";
  if (d.includes("apple"))    return "🍎";
  if (d.includes("github"))   return "🐙";
  if (d.includes("slack"))    return "💬";
  if (d.includes("discord"))  return "🎮";
  if (d.includes("twitter") || d.includes("x.com")) return "🐦";
  if (d.includes("instagram")) return "📸";
  if (d.includes("tiktok"))   return "🎵";
  if (d.includes("adobe"))    return "🎨";
  if (d.includes("dropbox"))  return "📂";
  if (d.includes("openai") || d.includes("chatgpt")) return "🤖";
  if (d.includes("notion"))   return "📝";
  if (d.includes("figma"))    return "✏️";
  if (d.includes("zoom"))     return "📹";
  if (d.includes("linkedin")) return "💼";
  if (d === "pasted text" || d.startsWith("[file]") || d.includes("pasted")) return "📄";
  return "🌐";
};

const recentCases = [
  {
    company: "Adobe",
    logo: "/logos/adobe.svg",
    year: "2024",
    amount: "FTC lawsuit",
    clause: "Hidden cancellation fees",
    what: "FTC sued Adobe for burying a $291 early termination fee in fine print. Users who tried to cancel were hit with charges they never knew about.",
    outcome: "Ongoing — FTC demanding refunds for millions of users",
    color: "#ef4444",
  },
  {
    company: "Google",
    logo: "/logos/github.svg",
    year: "2022",
    amount: "$391.5M",
    clause: "Secret location tracking",
    what: "40 US states settled with Google after it continued tracking users' locations even after they turned off 'Location History' — hidden in a separate setting.",
    outcome: "Settled for $391.5 million — largest privacy settlement ever at the time",
    color: "#f59e0b",
  },
  {
    company: "Spotify",
    logo: "/logos/spotify.svg",
    year: "2023",
    amount: "Class action",
    clause: "Unilateral price hike",
    what: "Spotify raised Premium prices by 10–17% citing a clause that lets them change pricing 'at any time.' Users filed a class action arguing they were locked into annual plans with no recourse.",
    outcome: "Case ongoing — users seeking refunds for locked-in contracts",
    color: "#22c55e",
  },
  {
    company: "Zoom",
    logo: "/logos/openai.svg",
    year: "2023",
    amount: "$85M",
    clause: "Data shared with Facebook & Google",
    what: "Zoom's privacy policy allowed it to share user data with third parties including Facebook, without clear disclosure. A class action followed after the practice was exposed.",
    outcome: "Settled for $85 million — $15–25 per affected user",
    color: "#3b82f6",
  },
  {
    company: "Dropbox",
    logo: "/logos/dropbox.svg",
    year: "2023",
    amount: "$10.25M",
    clause: "Auto-renewal trap",
    what: "Users sued Dropbox for automatically billing annual plan renewals with no reminder email, making cancellation deliberately difficult to find in account settings.",
    outcome: "Settled for $10.25 million",
    color: "#0ea5e9",
  },
  {
    company: "Slack",
    logo: "/logos/slack.svg",
    year: "2022",
    amount: "FTC warning",
    clause: "Forced arbitration + class action waiver",
    what: "Slack's T&Cs required all disputes to go to private arbitration and waived users' rights to class action lawsuits — even for data breaches affecting millions.",
    outcome: "Pressure led to updated terms; FTC issued guidance on such clauses",
    color: "#7c3aed",
  },
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
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { status } = useSession();
  const [sidebarPlan, setSidebarPlan] = useState<"free" | "pro">("free");

  // history state
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [animated, setAnimated] = useState(false);
  const [barWidths, setBarWidths] = useState<number[]>([]);
  const [caseIndex, setCaseIndex] = useState(() => Math.floor(Math.random() * recentCases.length));

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

  useEffect(() => {
    if (status !== "authenticated") {
      setSidebarPlan("free");
      return;
    }
    fetch("/api/account/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setSidebarPlan(data?.plan === "pro" ? "pro" : "free"))
      .catch(() => setSidebarPlan("free"));
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

  // ── Animated counters ────────────────────────────────────────────────────
  const animTotalScans = useCountUp(totalScans, animated);
  const animAvgScore   = useCountUp(avgRiskScore, animated);
  const animScansLeft  = useCountUp(Math.max(3 - scansUsed, 0), animated);

  // ── Scan stage cycling ────────────────────────────────────────────────────
  const scanStages = [
    "Fetching document…",
    "Identifying clauses…",
    "Scanning for red flags…",
    "Assessing risk level…",
    "Building your report…",
  ];
  const [stageIndex, setStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  useEffect(() => {
    if (!scanLoading) {
      setStageIndex(0);
      setCompletedStages([]);
      return;
    }
    setStageIndex(0);
    setCompletedStages([]);
    const interval = setInterval(() => {
      setStageIndex((prev) => {
        const next = prev + 1;
        if (next >= scanStages.length - 1) {
          clearInterval(interval);
          // Mark the step we're leaving (e.g. "Assessing risk level") done before showing the final stage.
          setCompletedStages((c) => (c.includes(prev) ? c : [...c, prev]));
          return scanStages.length - 1;
        }
        setCompletedStages((c) => [...c, prev]);
        return next;
      });
    }, 1800);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanLoading]);

  // ── Scan handler ──────────────────────────────────────────────────────────
  const MAX_FILE_BYTES = 100 * 1024 * 1024;

  const handleScan = async () => {
    if (!file && !input.trim()) {
      setError("Please enter a URL, paste text, or attach a file / photo.");
      return;
    }
    if (file && file.size > MAX_FILE_BYTES) {
      setError(`File is too large. Maximum size is ${MAX_FILE_BYTES / (1024 * 1024)} MB.`);
      return;
    }
    setError("");
    setScanLoading(true);
    try {
      let res: Response;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        res = await fetch("/api/scan", { method: "POST", body: fd });
      } else {
        res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: input.trim() }),
        });
      }
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong. Please try again."); return; }
      sessionStorage.setItem("scanResult", JSON.stringify(data));
      sessionStorage.setItem("scanInput", file ? (file.name ?? "") : input.trim());
      router.push("/results");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setScanLoading(false);
    }
  };

  // ── File / image helpers ──────────────────────────────────────────────────
  const handleDocFile = (f: File | null) => {
    setFile(f);
    setImagePreview(null);
    setInput("");
    if (error) setError("");
  };

  const handleImageFile = (f: File | null) => {
    setFile(f);
    setImagePreview(null);
    setInput("");
    if (error) setError("");
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  // ── CSS keyframes injected once ───────────────────────────────────────────
  const styles = `
    @keyframes skPulse   { 0%,100%{opacity:1} 50%{opacity:0.45} }
    @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideIn   { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
    @keyframes popIn     { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
    @keyframes spin      { to{transform:rotate(360deg)} }
    @keyframes orbitA    { from{transform:rotate(0deg) translateX(28px)} to{transform:rotate(360deg) translateX(28px)} }
    @keyframes orbitB    { from{transform:rotate(120deg) translateX(28px)} to{transform:rotate(480deg) translateX(28px)} }
    @keyframes orbitC    { from{transform:rotate(240deg) translateX(28px)} to{transform:rotate(600deg) translateX(28px)} }
    @keyframes scanPulse { 0%,100%{opacity:0.5;transform:scaleX(0.7)} 50%{opacity:1;transform:scaleX(1)} }
    @keyframes fadeInUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes checkPop  { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
    @keyframes overlayIn { from{opacity:0} to{opacity:1} }
    @keyframes progressFill { from{width:0%} to{width:100%} }
  `;

  const fadeCard = (delay: number) =>
    animated
      ? { animation: `fadeUp 0.5s ease both`, animationDelay: `${delay}s` }
      : { opacity: 0 };

  return (
    <SessionGuard>
    <div className="min-h-screen" style={{ background: "#f5f4f0" }}>
      <style>{styles}</style>

      {/* ── Analyzing Overlay ──────────────────────────────────────────── */}
      {scanLoading && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(15,23,42,0.82)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "overlayIn 0.3s ease",
        }}>
          <div style={{
            background: "#ffffff", borderRadius: 24,
            padding: "40px 36px", width: "100%", maxWidth: 400,
            boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
            animation: "fadeInUp 0.35s ease",
          }}>
            {/* Orbital spinner */}
            <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto 28px" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "linear-gradient(135deg,#ede9fe,#e0e7ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="6" fill="#4f46e5"/>
                  <rect x="4" y="5.5" width="10" height="1.5" rx=".75" fill="white" opacity=".35"/>
                  <rect x="4" y="9" width="13" height="1.5" rx=".75" fill="white"/>
                  <rect x="4" y="12.5" width="7" height="1.5" rx=".75" fill="white" opacity=".35"/>
                  <circle cx="16" cy="16" r="3" fill="#4f46e5" stroke="white" strokeWidth="1.2"/>
                  <line x1="18" y1="18" x2="20" y2="20" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
              {/* Orbiting dots */}
              {["orbitA","orbitB","orbitC"].map((anim, i) => (
                <div key={i} style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: 8, height: 8, marginTop: -4, marginLeft: -4,
                  borderRadius: "50%",
                  background: i === 0 ? "#4f46e5" : i === 1 ? "#7c3aed" : "#06b6d4",
                  animation: `${anim} ${1.4 + i * 0.2}s linear infinite`,
                  transformOrigin: "center center",
                }} />
              ))}
            </div>

            {/* Title */}
            <h3 style={{
              textAlign: "center", fontSize: 18, fontWeight: 700,
              color: "#0f172a", marginBottom: 6,
              fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.02em",
            }}>
              Analyzing your document
            </h3>
            <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginBottom: 28 }}>
              Claude AI is scanning every clause for red flags
            </p>

            {/* Stage list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {scanStages.map((stage, i) => {
                const done = completedStages.includes(i);
                const active = i === stageIndex;
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    opacity: i > stageIndex ? 0.3 : 1,
                    transition: "opacity 0.4s",
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: done ? "#22c55e" : active ? "#4f46e5" : "#f1f5f9",
                      border: active && !done ? "2px solid #4f46e5" : "none",
                      transition: "background 0.3s",
                    }}>
                      {done ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                          style={{ animation: "checkPop 0.3s ease" }}>
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : active ? (
                        <div style={{
                          width: 8, height: 8, borderRadius: "50%",
                          border: "2px solid transparent",
                          borderTopColor: "white",
                          animation: "spin 0.7s linear infinite",
                        }} />
                      ) : (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#cbd5e1" }} />
                      )}
                    </div>
                    <span style={{
                      fontSize: 13, color: done ? "#22c55e" : active ? "#0f172a" : "#94a3b8",
                      fontWeight: active || done ? 600 : 400,
                      transition: "color 0.3s",
                    }}>
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div style={{ width: "100%", background: "#f1f5f9", borderRadius: 99, height: 5, overflow: "hidden" }}>
              <div style={{
                height: 5, borderRadius: 99,
                background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
                width: `${Math.round(((completedStages.length) / scanStages.length) * 100)}%`,
                transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Sidebar — reads session automatically */}
      <FlagLinkSidebar
        collapsible
        scansUsed={scansUsed}
        plan={sidebarPlan}
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
            <p className="text-center text-xs text-gray-400 mb-5">
              Paste a URL, type text, or attach a file or photo.
            </p>

            {/* Hidden file inputs */}
            <input ref={fileInputRef}   type="file" accept=".txt,.pdf,.docx" hidden
              onChange={(e) => { handleDocFile(e.target.files?.[0] ?? null); e.target.value = ""; }} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden
              onChange={(e) => { handleImageFile(e.target.files?.[0] ?? null); e.target.value = ""; }} />

            {/* ── Compose box ──────────────────────────────────────────── */}
            <div style={{
              position: "relative",
              border: `1.5px solid ${error ? "#fca5a5" : "#e2e1db"}`,
              borderRadius: 16,
              background: "#f9f8f5",
              transition: "border-color 0.2s",
              marginBottom: 4,
            }}>

              {/* Attachment preview strip (shown when file selected) */}
              {file && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 12px 0",
                }}>
                  {imagePreview ? (
                    // Image thumbnail
                    <div style={{ position: "relative", display: "inline-block" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="preview"
                        style={{ height: 56, width: 56, borderRadius: 8, objectFit: "cover", display: "block", border: "1px solid #e2e1db" }} />
                      <button onClick={() => { setFile(null); setImagePreview(null); }}
                        style={{
                          position: "absolute", top: -6, right: -6,
                          width: 18, height: 18, borderRadius: "50%",
                          background: "#ef4444", border: "none", color: "#fff",
                          fontSize: 10, fontWeight: 700, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>✕</button>
                    </div>
                  ) : (
                    // File chip
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: "#ede9fe", borderRadius: 8, padding: "4px 10px",
                    }}>
                      <span style={{ fontSize: 14 }}>
                        {file.name.endsWith(".pdf") ? "📄" : file.name.endsWith(".docx") ? "📝" : "📃"}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#4f46e5", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {file.name}
                      </span>
                      <span style={{ fontSize: 10, color: "#a5b4fc" }}>
                        {file.size >= 1024 * 1024
                          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                          : `${(file.size / 1024).toFixed(0)} KB`}
                      </span>
                      <button onClick={() => { setFile(null); setImagePreview(null); }}
                        style={{
                          background: "none", border: "none", color: "#a5b4fc",
                          fontSize: 13, cursor: "pointer", padding: "0 0 0 2px", lineHeight: 1,
                        }}>✕</button>
                    </div>
                  )}
                </div>
              )}

              {/* Text area — hidden when a file/image is attached */}
              {!file && (
                <textarea
                  value={input}
                  onChange={(e) => { setInput(e.target.value); if (error) setError(""); }}
                  placeholder="Paste a URL (e.g. https://spotify.com/terms) or T&C text…"
                  disabled={scanLoading}
                  rows={4}
                  style={{
                    width: "100%", resize: "none", background: "transparent",
                    border: "none", outline: "none",
                    padding: "14px 52px 14px 14px",
                    fontSize: 13, lineHeight: 1.6,
                    color: "#0f172a", fontFamily: "'DM Sans', sans-serif",
                    boxSizing: "border-box",
                  }}
                />
              )}

              {/* Spacer row with icons when file attached */}
              {file && <div style={{ height: 12 }} />}

              {/* Bottom icon row */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "6px 8px 8px",
              }}>

                {/* Left: + button with popup */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowAttachMenu((v) => !v)}
                    title="Attach"
                    style={{
                      width: 34, height: 34, borderRadius: "50%", border: "none",
                      background: showAttachMenu ? "#4f46e5" : "#ede9fe",
                      color: showAttachMenu ? "#fff" : "#4f46e5",
                      fontSize: 20, fontWeight: 300, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background 0.18s, color 0.18s",
                      lineHeight: 1,
                    }}
                  >
                    {showAttachMenu ? "×" : "+"}
                  </button>

                  {/* Popup menu */}
                  {showAttachMenu && (
                    <div style={{
                      position: "absolute", bottom: "calc(100% + 8px)", left: 0,
                      background: "#fff", border: "1px solid #e5e7eb",
                      borderRadius: 14, boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
                      overflow: "hidden", zIndex: 20, minWidth: 180,
                      animation: "popIn 0.18s ease",
                    }}>
                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowAttachMenu(false);
                        }}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          width: "100%", padding: "11px 16px", border: "none",
                          background: "transparent", cursor: "pointer",
                          fontSize: 13, fontWeight: 500, color: "#374151",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <span style={{
                          width: 30, height: 30, borderRadius: 8, background: "#ede9fe",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0,
                        }}>📎</span>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: 12 }}>Upload file</p>
                          <p style={{ margin: 0, fontSize: 10, color: "#9ca3af" }}>
                            PDF, DOCX, TXT — up to 100 MB
                          </p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: camera button */}
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  title="Take photo"
                  style={{
                    width: 34, height: 34, borderRadius: "50%", border: "none",
                    background: imagePreview ? "#4f46e5" : "#ede9fe",
                    color: imagePreview ? "#fff" : "#4f46e5",
                    fontSize: 16, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.18s",
                  }}
                >
                  📷
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-600 mt-1 mb-3 px-1">{error}</p>}

            <button
              type="button"
              onClick={handleScan}
              disabled={scanLoading || (!file && !input.trim())}
              className="w-full h-[50px] rounded-full bg-[#4f46e5] text-white flex items-center justify-center gap-2 font-semibold text-sm transition-all hover:bg-[#4338ca] hover:shadow-[0_8px_24px_rgba(79,70,229,0.25)] disabled:opacity-60 disabled:cursor-not-allowed mt-4"
            >
              <span>Scan for Red Flags</span><ArrowIcon />
            </button>
            <p className="text-center mt-3 text-[11px] text-gray-400 italic">
              Not legal advice. For informational purposes only.
            </p>
          </div>
        </div>

        {/* ── 3. Quick Scan Pills ──────────────────────────────────────── */}
        <div className="w-full max-w-3xl mx-auto px-4 mb-8" style={fadeCard(0.22)}>
          <p className="text-xs text-gray-400 mb-3 text-center">Try a popular service:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "Spotify",  logo: "/logos/spotify.svg",  url: "https://www.spotify.com/legal/end-user-agreement/" },
              { label: "Netflix",  logo: "/logos/netflix.svg",  url: "https://help.netflix.com/legal/termsofuse" },
              { label: "OpenAI",   logo: "/logos/openai.svg",   url: "https://openai.com/policies/terms-of-use" },
              { label: "Adobe",    logo: "/logos/adobe.svg",    url: "https://www.adobe.com/legal/terms.html" },
              { label: "Dropbox",  logo: "/logos/dropbox.svg",  url: "https://www.dropbox.com/terms" },
              { label: "Slack",    logo: "/logos/slack.svg",    url: "https://slack.com/terms-of-service" },
            ].map(({ label, logo, url }, i) => (
              <button
                key={label}
                onClick={() => { setInput(url); setFile(null); setImagePreview(null); }}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "7px 14px 7px 10px",
                  borderRadius: 99,
                  background: "#ffffff",
                  border: "1.5px solid #e5e7eb",
                  cursor: "pointer",
                  fontSize: 12, fontWeight: 600, color: "#374151",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
                  ...(animated ? { animation: "popIn 0.4s ease both", animationDelay: `${0.26 + i * 0.04}s` } : { opacity: 0 }),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#a5b4fc";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(79,70,229,0.12)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt={label} style={{ width: 18, height: 18, objectFit: "contain", flexShrink: 0 }} />
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
              {/* Recent Scans — animated component */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                style={fadeCard(0.28)}>
                <RecentScans
                  isLoading={historyLoading}
                  onScanClick={(id) => {
                    const s = scans.find((r) => r.id === id);
                    if (!s) return;
                    pushSavedScanToResults(s, router);
                  }}
                  scans={recentScans.map((s): RScanItem => ({
                    id: s.id,
                    domain: s.domain,
                    score: s.score,
                    verdict: s.verdict,
                    flags: (scans.find((r) => r.id === s.id)?.redFlags ?? []).length,
                    time: s.date,
                    icon: domainIcon(s.domain),
                    color: s.score >= 56 ? "red" : s.score >= 31 ? "amber" : "green",
                  }))}
                />
              </div>

              {/* Top Red Flags */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                style={fadeCard(0.34)}>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-gray-900">Top Red Flags Found</h3>
                  {topRedFlags.length > 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Occurrences
                    </span>
                  )}
                </div>

                {topRedFlags.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">
                    Red flag patterns across your scans will appear here.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {topRedFlags.map((flag, i) => {
                      const maxCount = topRedFlags[0]?.count || 1;
                      const percent = Math.round((flag.count / maxCount) * 100);
                      return (
                        <div key={i} className="group">
                          <div className="flex justify-between items-end mb-2 gap-4">
                            <p className="text-sm font-medium text-gray-600 truncate group-hover:text-gray-900 transition-colors duration-200">
                              {flag.clause}
                            </p>
                            <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 shadow-sm flex-shrink-0">
                              {flag.count}x
                            </span>
                          </div>
                          <div className="w-full bg-gray-50 rounded-full h-1.5 overflow-hidden border border-gray-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: animated ? `${percent}%` : "0%" }}
                              transition={{ duration: 1, delay: i * 0.1, ease: [0.34, 1.2, 0.64, 1] }}
                              className="bg-gradient-to-r from-red-400 to-red-500 h-full rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── 5. Real Lawsuits (full width) ────────────────────────────── */}
        <div className="w-full max-w-3xl mx-auto px-4 mb-8">
          {historyLoading ? (
            <SkeletonCard h={230} delay={0.15} />
          ) : (
            (() => {
              const c = recentCases[caseIndex];
              return (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col"
                  style={fadeCard(0.42)}>

                  {/* Header */}
                  <div style={{ padding: "14px 20px 10px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>⚖️</span>
                      <h3 className="text-sm font-semibold text-gray-800">Real Lawsuits</h3>
                    </div>
                    {/* Dot nav */}
                    <div style={{ display: "flex", gap: 5 }}>
                      {recentCases.map((_, i) => (
                        <button key={i} onClick={() => setCaseIndex(i)}
                          style={{ width: i === caseIndex ? 16 : 6, height: 6, borderRadius: 99, border: "none", cursor: "pointer", transition: "width 0.2s, background 0.2s", background: i === caseIndex ? "#4f46e5" : "#e2e8f0" }} />
                      ))}
                    </div>
                  </div>

                  {/* Case content */}
                  <div style={{ padding: "18px 20px", flex: 1 }}>
                    {/* Company + year + amount */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.logo} alt={c.company} style={{ width: 26, height: 26, objectFit: "contain", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{c.company}</span>
                          <span style={{ fontSize: 11, color: "#9ca3af" }}>{c.year}</span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: c.color, background: c.color + "15", padding: "2px 9px", borderRadius: 99 }}>
                          {c.amount}
                        </span>
                      </div>
                    </div>

                    {/* Clause tag */}
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", background: "#f1f5f9", padding: "3px 10px", borderRadius: 6 }}>
                        🚩 {c.clause}
                      </span>
                    </div>

                    {/* What happened */}
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.65, marginBottom: 10 }}>{c.what}</p>

                    {/* Outcome */}
                    <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "8px 12px" }}>
                      <p style={{ fontSize: 12, color: "#15803d", fontWeight: 600, margin: 0 }}>📋 {c.outcome}</p>
                    </div>
                  </div>

                  {/* Footer nav */}
                  <div style={{ padding: "10px 20px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button onClick={() => setCaseIndex((caseIndex - 1 + recentCases.length) % recentCases.length)}
                      style={{ fontSize: 12, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>
                      ← Prev
                    </button>
                    <span style={{ fontSize: 11, color: "#cbd5e1" }}>{caseIndex + 1} / {recentCases.length}</span>
                    <button onClick={() => setCaseIndex((caseIndex + 1) % recentCases.length)}
                      style={{ fontSize: 12, color: "#4f46e5", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>
                      Next →
                    </button>
                  </div>
                </div>
              );
            })()
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
    </SessionGuard>
  );
}
