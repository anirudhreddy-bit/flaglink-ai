"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [dotPulse, setDotPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotPulse((p) => (p + 1) % 3);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center w-full">
        {/* LEFT SIDE */}
        <div>
          {/* Badge */}
          <div
            className="inline-flex gap-1.5 items-center mb-8"
            style={{
              background: "var(--run-bg)",
              border: "1px solid var(--run-border)",
              borderRadius: "100px",
              padding: "5px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: "var(--run)",
              letterSpacing: "1.2px",
              animation: "fadeUp 0.6s ease-out 0.1s both",
            }}
          >
            <span
              className="animate-pulse"
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                background: "var(--run)",
                borderRadius: "50%",
              }}
            />
            AI-POWERED LEGAL SCANNER
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(36px, 4.5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-2px",
              lineHeight: 1.08,
              color: "var(--ink)",
              marginBottom: "24px",
              animation: "fadeUp 0.6s ease-out 0.2s both",
              wordWrap: "break-word",
              overflow: "hidden",
              fontStretch: "normal",
              transform: "none",
              textAlign: "left",
            }}
          >
            Stop{" "}
            <span
              style={{
                textDecoration: "line-through",
                textDecorationColor: "var(--run)",
                textDecorationThickness: "3px",
              }}
            >
              blindly clicking
            </span>
            {" "}
            <span
              style={{
                textDecoration: "line-through",
                textDecorationColor: "var(--run)",
                textDecorationThickness: "3px",
              }}
            >
              "I Agree."
            </span>
            <br />
            <span style={{ 
              color: "var(--accent)",
              fontSize: "clamp(36px, 4.5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-2px",
              lineHeight: 1.08,
              display: "block",
            }}>Know what you sign.</span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              color: "var(--muted)",
              lineHeight: 1.75,
              maxWidth: "440px",
              marginBottom: "32px",
              animation: "fadeUp 0.6s ease-out 0.3s both",
            }}
          >
            Paste any Terms & Conditions URL. FlagLink AI reads every clause,
            flags every trap, and tells you — in plain English — whether to
            sign or run.
          </p>

          {/* Buttons Row */}
          <div
            className="flex flex-col sm:flex-row gap-3 mb-8"
            style={{ animation: "fadeUp 0.6s ease-out 0.4s both" }}
          >
            <Link
              href="/?scan=true"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Scan for Red Flags
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.5 3v10M13 8.5H3" stroke="currentColor" fill="none" strokeWidth="2" />
              </svg>
            </Link>

            <Link href="#features" className="btn-ghost text-center">
              See a sample report
            </Link>
          </div>

          {/* Trust line */}
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 300,
              color: "var(--soft)",
              animation: "fadeIn 0.6s ease-out 0.6s both",
            }}
          >
            Free forever plan · No credit card required · Not legal advice
          </div>
        </div>

        {/* RIGHT SIDE — Mock Browser UI */}
        <div
          className="hidden md:block"
          style={{
            animation: "fadeUp 0.6s ease-out 0.3s both",
            maxWidth: "100%",
            width: "100%",
          }}
        >
          <div
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)",
              overflow: "hidden",
              maxHeight: "500px",
            }}
          >
            {/* Browser bar */}
            <div
              style={{
                background: "#f1f5f9",
                borderBottom: "1px solid var(--border)",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  background: "#ff5f57",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  background: "#febc2e",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  background: "#28c840",
                  borderRadius: "50%",
                }}
              />
              <div style={{ flex: 1, marginLeft: "12px" }}>
                <div
                  style={{
                    background: "white",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: "var(--muted)",
                  }}
                >
                  flaglink.ai/scan
                </div>
              </div>
            </div>

            {/* Content area */}
            <div style={{ padding: "20px" }}>
              {/* URL input row */}
              <div
                style={{
                  background: "var(--bg2)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <input
                  type="text"
                  value="https://spotify.com/legal/end-user-agreement/"
                  readOnly
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: "var(--muted)",
                    outline: "none",
                  }}
                />
                <button
                  style={{
                    background: "var(--accent)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "default",
                  }}
                >
                  Analyzing...
                </button>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: "3px",
                  background: "var(--bg3)",
                  borderRadius: "2px",
                  overflow: "hidden",
                  marginBottom: "6px",
                }}
              >
                <div
                  style={{
                    width: "73%",
                    height: "100%",
                    background: "var(--accent)",
                    backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.2s linear infinite",
                  }}
                />
              </div>

              {/* Status row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: "var(--muted)",
                  marginBottom: "14px",
                }}
              >
                <span>Detecting red flags...</span>
                <span>73%</span>
              </div>

              {/* Verdict card */}
              <div
                style={{
                  background: "var(--ink)",
                  borderRadius: "10px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "36px",
                      fontWeight: 900,
                      color: "var(--run)",
                      letterSpacing: "-1.5px",
                      lineHeight: 1,
                      marginBottom: "2px",
                    }}
                  >
                    RUN.
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "var(--run)",
                      lineHeight: 1,
                    }}
                  >
                    14<span style={{ fontSize: "12px", color: "#3a4a6a" }}>/100</span>
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "9px",
                      color: "#3a4a6a",
                      letterSpacing: "1.5px",
                      marginTop: "2px",
                    }}
                  >
                    RISK SCORE
                  </div>
                </div>
              </div>

              {/* 3 flags */}
              {[
                {
                  label: "Forced arbitration",
                  detail: "waive all court rights",
                  severity: "CRITICAL",
                  color: "var(--run)",
                },
                {
                  label: "Data sold to advertising partners",
                  detail: "3rd party sharing",
                  severity: "HIGH",
                  color: "var(--warn)",
                },
                {
                  label: "Auto-renews annually, no reminder sent",
                  detail: "subscription trap",
                  severity: "HIGH",
                  color: "var(--warn)",
                },
              ].map((flag, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    background: "white",
                    border: "1px solid var(--border)",
                    borderLeft: `3px solid ${flag.color}`,
                    borderRadius: "6px",
                    padding: "8px 12px",
                    fontSize: "11px",
                    color: "var(--ink2)",
                    marginBottom: i < 2 ? "6px" : 0,
                  }}
                >
                  <div
                    style={{
                      width: "5px",
                      height: "5px",
                      background: flag.color,
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ flex: 1 }}>
                    {flag.label}{" "}
                    <span style={{ color: "var(--soft)", fontSize: "9px" }}>
                      — {flag.detail}
                    </span>
                  </span>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "8px",
                      letterSpacing: "1px",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      background:
                        flag.color === "var(--run)"
                          ? "rgba(239,68,68,0.1)"
                          : "rgba(249,115,22,0.1)",
                      color: flag.color,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {flag.severity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
