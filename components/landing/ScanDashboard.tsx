"use client";

import { useEffect, useRef, useState } from "react";

interface RedFlag {
  clause: string;
  explanation: string;
  severity: "low" | "medium" | "high";
}

interface ScanRecord {
  id: string;
  website: string;
  riskLevel: "green" | "yellow" | "red";
  score: number;
  redFlags: RedFlag[] | null;
  createdAt: string;
}

function useInView(ref: React.RefObject<HTMLDivElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fire immediately if already in viewport, otherwise observe
    const check = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        setInView(true);
        return true;
      }
      return false;
    };
    if (check()) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0, rootMargin: "100px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

function AnimatedNumber({
  target,
  duration = 1400,
  suffix = "",
  active,
}: {
  target: number;
  duration?: number;
  suffix?: string;
  active: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (target === 0) { setValue(0); return; }
    let cancelled = false;
    const startTime = performance.now();
    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { cancelled = true; };
  }, [active, target, duration]);

  return <>{value}{suffix}</>;
}

function AnimatedBar({
  percent,
  color,
  delay = 0,
  active,
}: {
  percent: number;
  color: string;
  delay?: number;
  active: boolean;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!active) return;
    setWidth(0);
    const t = setTimeout(() => {
      requestAnimationFrame(() => setWidth(percent));
    }, delay);
    return () => clearTimeout(t);
  }, [active, percent, delay]);

  return (
    <div
      style={{
        background: "#f1f0ec",
        borderRadius: 999,
        height: 7,
        flex: 1,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 999,
          background: color,
          width: `${width}%`,
          transition: "width 1.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}

function PulsingDot({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        animation: "scan-pulse 2s ease-in-out infinite",
        flexShrink: 0,
      }}
    />
  );
}

export default function ScanDashboard() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);

  useEffect(() => {
    fetch("/api/account/history")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setScans(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = scans.length;
  const avgScore =
    total > 0
      ? Math.round(scans.reduce((s, r) => s + r.score, 0) / total)
      : 0;
  const allFlags = scans.flatMap((s) => s.redFlags ?? []);
  const totalFlags = allFlags.length;

  const greenCount = scans.filter((s) => s.riskLevel === "green").length;
  const yellowCount = scans.filter((s) => s.riskLevel === "yellow").length;
  const redCount = scans.filter((s) => s.riskLevel === "red").length;

  const highFlags = allFlags.filter((f) => f.severity === "high").length;
  const mediumFlags = allFlags.filter((f) => f.severity === "medium").length;
  const lowFlags = allFlags.filter((f) => f.severity === "low").length;

  const riskMax = Math.max(greenCount, yellowCount, redCount, 1);
  const flagMax = Math.max(highFlags, mediumFlags, lowFlags, 1);

  const avgColor =
    avgScore <= 20 ? "#22c55e" : avgScore <= 50 ? "#f59e0b" : "#ef4444";
  const avgBg =
    avgScore <= 20 ? "#f0fdf4" : avgScore <= 50 ? "#fffbeb" : "#fef2f2";

  const recentScans = scans.slice(0, 5);

  if (loading) {
    return (
      <section style={{ padding: "0 6% 80px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
              marginBottom: 10,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  border: "0.5px solid #e2e1db",
                  borderRadius: 16,
                  padding: "20px 22px 18px",
                  height: 110,
                  animation: "skeletonPulse 1.6s ease-in-out infinite",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  border: "0.5px solid #e2e1db",
                  borderRadius: 16,
                  height: 140,
                  animation: "skeletonPulse 1.6s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
        <style>{`
          @keyframes skeletonPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.45; }
          }
        `}</style>
      </section>
    );
  }

  if (total === 0) {
    return (
      <section style={{ padding: "0 6% 80px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div
            style={{
              background: "#fff",
              border: "0.5px solid #e2e1db",
              borderRadius: 16,
              padding: "36px 28px",
              textAlign: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>📊</div>
            <p
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 600,
                fontSize: 16,
                color: "#0f172a",
                margin: "0 0 6px",
              }}
            >
              Your analytics live here
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: "#9ca3af",
                margin: 0,
              }}
            >
              Scan your first document above to unlock your personal risk dashboard.
            </p>
          </div>
        </div>
        <style>{`
          @keyframes scan-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.75); }
          }
        `}</style>
      </section>
    );
  }

  return (
    <>
      <style>{`
        @keyframes scan-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <section ref={containerRef} style={{ padding: "0 6% 88px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Header */}
          <div
            style={{
              marginBottom: 18,
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.45s ease, transform 0.45s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <PulsingDot color="#4f46e5" />
              <h3
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 700,
                  fontSize: 19,
                  color: "#0f172a",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                Your Scan Analytics
              </h3>
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                color: "#9ca3af",
                margin: 0,
                paddingLeft: 16,
              }}
            >
              Aggregated from all {total} document{total > 1 ? "s" : ""} you&apos;ve analyzed
            </p>
          </div>

          {/* Stat cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
              marginBottom: 10,
            }}
          >
            {[
              {
                label: "Documents Analyzed",
                value: total,
                suffix: "",
                color: "#4f46e5",
                bg: "#eef2ff",
                icon: "📄",
                sub: "total scans",
              },
              {
                label: "Avg Risk Score",
                value: avgScore,
                suffix: "",
                color: avgColor,
                bg: avgBg,
                icon: "🎯",
                sub: "out of 100",
              },
              {
                label: "Red Flags Caught",
                value: totalFlags,
                suffix: "",
                color: "#f59e0b",
                bg: "#fffbeb",
                icon: "🚩",
                sub: "total issues",
              },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  border: "0.5px solid #e2e1db",
                  borderRadius: 16,
                  padding: "20px 22px 18px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(18px)",
                  transition: `opacity 0.5s ease ${i * 0.09}s, transform 0.5s ease ${i * 0.09}s`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* faint accent circle */}
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: card.bg,
                    opacity: 0.6,
                    pointerEvents: "none",
                  }}
                />
                <div style={{ fontSize: 20, marginBottom: 10 }}>{card.icon}</div>
                <div
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800,
                    fontSize: 34,
                    color: card.color,
                    lineHeight: 1,
                    marginBottom: 6,
                    letterSpacing: "-0.02em",
                  }}
                >
                  <AnimatedNumber
                    target={card.value}
                    suffix={card.suffix}
                    active={inView}
                  />
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    color: "#374151",
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  {card.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    color: "#9ca3af",
                  }}
                >
                  {card.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row: bars */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 10,
            }}
          >
            {/* Risk Distribution */}
            <div
              style={{
                background: "#ffffff",
                border: "0.5px solid #e2e1db",
                borderRadius: 16,
                padding: "20px 22px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(18px)",
                transition: "opacity 0.5s ease 0.28s, transform 0.5s ease 0.28s",
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "#0f172a",
                  margin: "0 0 16px",
                }}
              >
                Risk Distribution
              </p>
              {[
                { label: "Safe", count: greenCount, color: "#22c55e", bg: "#f0fdf4", delay: 420 },
                { label: "Moderate", count: yellowCount, color: "#f59e0b", bg: "#fffbeb", delay: 580 },
                { label: "High Risk", count: redCount, color: "#ef4444", bg: "#fef2f2", delay: 740 },
              ].map((row, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? 14 : 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: row.color,
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          color: "#6b7280",
                          fontWeight: 500,
                        }}
                      >
                        {row.label}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: row.color,
                        fontWeight: 700,
                        background: row.bg,
                        padding: "2px 7px",
                        borderRadius: 5,
                        border: `1px solid ${row.color}30`,
                      }}
                    >
                      {row.count}
                    </span>
                  </div>
                  <AnimatedBar
                    percent={(row.count / riskMax) * 100}
                    color={row.color}
                    delay={row.delay}
                    active={inView}
                  />
                </div>
              ))}
            </div>

            {/* Flag Severity Breakdown */}
            <div
              style={{
                background: "#ffffff",
                border: "0.5px solid #e2e1db",
                borderRadius: 16,
                padding: "20px 22px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(18px)",
                transition: "opacity 0.5s ease 0.37s, transform 0.5s ease 0.37s",
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "#0f172a",
                  margin: "0 0 16px",
                }}
              >
                Flag Severity Breakdown
              </p>
              {[
                { label: "High Severity", count: highFlags, color: "#ef4444", bg: "#fef2f2", delay: 520 },
                { label: "Medium Severity", count: mediumFlags, color: "#f59e0b", bg: "#fffbeb", delay: 680 },
                { label: "Low Severity", count: lowFlags, color: "#22c55e", bg: "#f0fdf4", delay: 840 },
              ].map((row, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? 14 : 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: row.color,
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          color: "#6b7280",
                          fontWeight: 500,
                        }}
                      >
                        {row.label}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: row.color,
                        fontWeight: 700,
                        background: row.bg,
                        padding: "2px 7px",
                        borderRadius: 5,
                        border: `1px solid ${row.color}30`,
                      }}
                    >
                      {row.count}
                    </span>
                  </div>
                  <AnimatedBar
                    percent={(row.count / flagMax) * 100}
                    color={row.color}
                    delay={row.delay}
                    active={inView}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Recent scans */}
          {recentScans.length > 0 && (
            <div
              style={{
                background: "#ffffff",
                border: "0.5px solid #e2e1db",
                borderRadius: 16,
                padding: "20px 22px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(18px)",
                transition: "opacity 0.5s ease 0.46s, transform 0.5s ease 0.46s",
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "#0f172a",
                  margin: "0 0 14px",
                }}
              >
                Recent Scans
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {recentScans.map((scan, i) => {
                  const sc = scan.score;
                  const scoreColor =
                    sc <= 20 ? "#22c55e" : sc <= 50 ? "#f59e0b" : "#ef4444";
                  const scoreBg =
                    sc <= 20 ? "#f0fdf4" : sc <= 50 ? "#fffbeb" : "#fef2f2";
                  const flagCount = scan.redFlags?.length ?? 0;
                  const dateStr = new Date(scan.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" }
                  );
                  return (
                    <div
                      key={scan.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        background: "#f9f8f5",
                        borderRadius: 10,
                        opacity: inView ? 1 : 0,
                        transform: inView ? "translateX(0)" : "translateX(-14px)",
                        transition: `opacity 0.4s ease ${0.56 + i * 0.07}s, transform 0.4s ease ${0.56 + i * 0.07}s`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 9,
                            background: "#eeedf0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 15,
                            flexShrink: 0,
                          }}
                        >
                          🔍
                        </div>
                        <div>
                          <p
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 600,
                              fontSize: 13,
                              color: "#0f172a",
                              margin: "0 0 2px",
                            }}
                          >
                            {scan.website}
                          </p>
                          <p
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 11,
                              color: "#9ca3af",
                              margin: 0,
                            }}
                          >
                            {flagCount} flag{flagCount !== 1 ? "s" : ""} · {dateStr}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {/* mini bar */}
                        <div
                          style={{
                            width: 60,
                            height: 5,
                            background: "#e5e7eb",
                            borderRadius: 999,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: inView ? `${sc}%` : "0%",
                              background: scoreColor,
                              borderRadius: 999,
                              transition: `width 1.1s cubic-bezier(0.4,0,0.2,1) ${0.7 + i * 0.07}s`,
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 700,
                            fontSize: 13,
                            color: scoreColor,
                            background: scoreBg,
                            padding: "4px 10px",
                            borderRadius: 20,
                            border: `1px solid ${scoreColor}30`,
                            minWidth: 42,
                            textAlign: "center",
                          }}
                        >
                          {sc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
