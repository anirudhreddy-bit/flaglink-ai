"use client";

export default function SplitScan() {
  return (
    <div className="w-full grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* LEFT — Text side */}
        <div>
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
            Instant Scanning
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
            Paste a URL. Get the truth in 2 seconds.
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
            No reading. No legal degree. No 45 minutes of scrolling. Just paste
            the link and let Claude do what it does best — read everything and
            surface what matters.
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
              "Works with any public Terms & Conditions URL",
              "Also accepts pasted raw text directly",
              "Results in under 2 seconds, every time",
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

        {/* RIGHT — Mock card */}
        <div
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "24px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
            animation: "fadeUp 0.6s ease forwards 0.2s both",
          }}
        >
          {/* URL input */}
          <div
            style={{
              background: "white",
              border: "1.5px solid var(--border)",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "12px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "var(--muted)",
            }}
          >
            https://notion.so/privacy
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
                width: "100%",
                height: "100%",
                background: "var(--safe)",
              }}
            />
          </div>

          {/* Status */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: "var(--soft)",
              marginBottom: "14px",
            }}
          >
            Scan complete · 847 clauses read
          </div>

          {/* Score boxes */}
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              style={{
                flex: 1,
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "8px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "var(--safe)",
                  marginBottom: "2px",
                }}
              >
                74
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  color: "var(--safe)",
                  opacity: 0.7,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Risk Score
              </div>
            </div>
            <div
              style={{
                flex: 1,
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "8px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "var(--safe)",
                  marginBottom: "2px",
                }}
              >
                SAFE
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  color: "var(--safe)",
                  opacity: 0.7,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Verdict
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
