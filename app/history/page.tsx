"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlagLinkSidebar } from "@/components/ui/flaglink-sidebar";

interface Scan {
  id: string;
  website?: string;
  input?: string;
  score: number;
  riskLevel: "green" | "yellow" | "red";
  redFlags: unknown;
  advice: unknown;
  createdAt: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getDomain(scan: Scan) {
  if (scan.website) return scan.website;
  if (scan.input?.startsWith("http")) {
    try { return new URL(scan.input).hostname.replace("www.", ""); } catch {}
  }
  return scan.input?.slice(0, 40) || "Unknown";
}

const RISK_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  red:    { bg: "#fef2f2", text: "#ef4444", label: "High Risk"   },
  yellow: { bg: "#fefce8", text: "#f59e0b", label: "Medium Risk" },
  green:  { bg: "#f0fdf4", text: "#22c55e", label: "Low Risk"    },
};

export default function HistoryPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/account/history")
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => { setScans(data); setLoading(false); })
      .catch(() => { setError("Could not load scan history."); setLoading(false); });
  }, []);

  const openScan = (scan: Scan) => {
    sessionStorage.setItem("scanResult", JSON.stringify({
      riskLevel: scan.riskLevel,
      score: scan.score,
      redFlags: scan.redFlags,
      advice: scan.advice,
    }));
    sessionStorage.setItem("fromHistory", "true");
    router.push("/results");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f4f0" }}>
      <FlagLinkSidebar
        collapsible
        user={{ name: "flaglinkai", email: "user@example.com" }}
        scansUsed={2}
        plan="free"
      />

      <main style={{ flex: 1, padding: "48px 6%", maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 700, fontSize: 28, color: "#0f172a",
            letterSpacing: "-0.02em", marginBottom: 6,
          }}>
            Scan History
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#888" }}>
            Click any scan to see the full results and risky clauses.
          </p>
        </div>

        {/* States */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
            Loading scans...
          </div>
        )}

        {error && (
          <div style={{ padding: "16px 20px", background: "#fef2f2", border: "0.5px solid #fecaca", borderRadius: 12, color: "#ef4444", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
            {error}
          </div>
        )}

        {!loading && !error && scans.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#9ca3af", marginBottom: 20 }}>
              No scans yet. Run your first scan to see results here.
            </p>
            <button
              onClick={() => router.push("/scan")}
              style={{
                background: "#4f46e5", color: "#fff", border: "none", cursor: "pointer",
                padding: "10px 24px", borderRadius: 50, fontFamily: "'Inter', sans-serif",
                fontSize: 13, fontWeight: 600,
              }}
            >
              Start Scanning →
            </button>
          </div>
        )}

        {/* Scan list */}
        {!loading && scans.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {scans.map((scan, i) => {
              const risk = RISK_COLORS[scan.riskLevel] ?? RISK_COLORS.yellow;
              const flagCount = Array.isArray(scan.redFlags) ? scan.redFlags.length : 0;
              return (
                <button
                  key={scan.id}
                  onClick={() => openScan(scan)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", textAlign: "left", padding: "16px 20px",
                    background: "#ffffff", border: "0.5px solid #e2e1db",
                    borderRadius: 14, cursor: "pointer",
                    transition: "box-shadow 0.15s, border-color 0.15s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                    e.currentTarget.style.borderColor = "#c7d2fe";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                    e.currentTarget.style.borderColor = "#e2e1db";
                  }}
                >
                  {/* Left — index + domain */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "#f3f4f6", display: "flex", alignItems: "center",
                      justifyContent: "center", flexShrink: 0,
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 12, fontWeight: 700, color: "#6b7280",
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <p style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 14,
                        fontWeight: 600, color: "#0f172a", margin: 0,
                      }}>
                        {getDomain(scan)}
                      </p>
                      <p style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 11,
                        color: "#9ca3af", margin: "2px 0 0",
                      }}>
                        {formatDate(scan.createdAt)} · {flagCount} flag{flagCount !== 1 ? "s" : ""} found
                      </p>
                    </div>
                  </div>

                  {/* Right — risk badge + score */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 50, fontSize: 11,
                      fontWeight: 600, background: risk.bg, color: risk.text,
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {risk.label}
                    </span>
                    <span style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 16, fontWeight: 700, color: risk.text, minWidth: 36,
                    }}>
                      {scan.score}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
