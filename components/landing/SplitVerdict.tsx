"use client";

export default function SplitVerdict() {
  return (
    <div
      className="w-full grid md:grid-cols-2 gap-12 md:gap-16 items-center"
      style={{ direction: "rtl" }}
    >
        {/* LEFT — Text side (visually on right due to direction: rtl) */}
        <div style={{ direction: "ltr" }}>
          {/* Label */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: "var(--accent)",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "16px",
              animation: "fadeUp 0.6s ease forwards",
            }}
          >
            Verdict Reveal
          </div>

          {/* H2 */}
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.015em",
              lineHeight: 1.25,
              marginBottom: "16px",
              color: "var(--ink)",
              animation: "fadeUp 0.6s ease forwards 0.1s both",
            }}
          >
            One word. No ambiguity. Sign or Run.
          </h2>

          {/* Body */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--muted)",
              lineHeight: 1.8,
              marginBottom: "24px",
              animation: "fadeUp 0.6s ease forwards 0.2s both",
            }}
          >
            Every scan ends with a clear verdict — SAFE, CAUTION, or RUN — plus
            a 0–100 risk score and plain-English explanations of every red flag
            found.
          </p>

          {/* Checklist */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              animation: "fadeUp 0.6s ease forwards 0.3s both",
            }}
          >
            {[
              "Risk score from 0 (run) to 100 (safe)",
              "Every flag ranked by severity: Critical, High, Medium, Low",
              "Shareable report link generated for each scan",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "var(--accent-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    color: "var(--ink2)",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Mock card (visually on left due to direction: rtl) */}
        <div
          style={{
            background: "var(--ink)",
            border: "1px solid #1e2535",
            borderRadius: "14px",
            padding: "24px",
            animation: "fadeUp 0.6s ease forwards 0.2s both",
            direction: "ltr",
          }}
        >
          {/* Top row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "#3a4a6a",
              }}
            >
              spotify.com/legal
            </div>
            <div
              style={{
                background: "rgba(239,68,68,0.12)",
                color: "var(--run)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: "6px",
                padding: "3px 10px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Risky
            </div>
          </div>

          {/* Verdict text */}
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "52px",
              fontWeight: 900,
              color: "var(--run)",
              letterSpacing: "-2.5px",
              lineHeight: 1,
              marginBottom: "4px",
            }}
          >
            RUN.
          </div>

          {/* Subtext */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "#3a4a6a",
              marginBottom: "14px",
            }}
          >
            5 red flags detected
          </div>

          {/* 3 flags */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "Forced arbitration clause", color: "var(--run)" },
              { label: "Data sold to third parties", color: "var(--warn)" },
              { label: "Auto-renewal, no reminder", color: "var(--warn)" },
            ].map((flag, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "7px",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderLeft: `2px solid ${flag.color}`,
                  borderRadius: "5px",
                  padding: "7px 10px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10px",
                  color: "#6b7fa8",
                }}
              >
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    background: flag.color,
                    borderRadius: "50%",
                  }}
                />
                {flag.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
