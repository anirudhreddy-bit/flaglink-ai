"use client";

function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 8H12.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8.8 3.9L12.3 8L8.8 12.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="w-full bg-[#ffffff]">
      <div
        className="max-w-[1100px] mx-auto px-10 pt-20 pb-16 grid grid-cols-2 gap-16 items-center"
        style={{ gridTemplateColumns: "1.1fr 0.9fr", gap: 60, paddingBottom: 60 }}
      >
        {/* LEFT COLUMN */}
        <div>
          {/* Eyebrow badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 100,
              padding: "5px 14px",
              marginBottom: 24,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "#ef4444",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "#ef4444",
                animation: "pulse 1.5s infinite",
              }}
            />
            AI-POWERED LEGAL SCANNER
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(36px, 4vw, 52px)",
              letterSpacing: "-2px",
              lineHeight: 1.1,
              marginBottom: 20,
              animation: "fadeUp 0.6s 0.2s ease both",
              transform: "none",
              direction: "ltr",
              fontStretch: "normal",
              textAlign: "left",
            }}
          >
            <span style={{ display: "block", color: "#0f172a" }}>
              Stop blindly clicking
            </span>
            <span style={{ display: "block", color: "#6366f1" }}>
              {"\"I Agree.\""}
            </span>
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 16,
              color: "#475569",
              lineHeight: 1.75,
              maxWidth: 480,
              marginBottom: 32,
              animation: "fadeUp 0.6s 0.35s ease both",
            }}
          >
            Paste any Terms &amp; Conditions URL or text. FlagLink AI reads every
            clause, flags hidden traps, and tells you — in plain English — whether
            to sign or run.
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 20,
              animation: "fadeUp 0.5s 0.5s ease both",
            }}
          >
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("scan");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else window.location.href = "/?scan=true";
              }}
              style={{
                background: "#6366f1",
                color: "#ffffff",
                border: "none",
                borderRadius: 100,
                padding: "14px 32px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
              }}
              className="hover:bg-[#4f46e5] hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(99,102,241,0.25)]"
              aria-label="Start scanning"
            >
              Start Scanning
              <span style={{ color: "#ffffff" }}>
                <ArrowIcon size={14} />
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("how-it-works");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                background: "transparent",
                color: "#475569",
                border: "1.5px solid #cbd5e1",
                borderRadius: 100,
                padding: "13px 26px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                transition: "border-color 0.2s, color 0.2s",
              }}
              className="hover:border-[#94a3b8] hover:text-[#0f172a]"
              aria-label="How it works"
            >
              How it works
            </button>
          </div>

          {/* Trust / microcopy line */}
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: 12,
              color: "#94a3b8",
              letterSpacing: "0.3px",
              animation: "fadeIn 0.5s 0.7s ease both",
            }}
          >
            Free forever
            <span style={{ margin: "0 8px", opacity: 0.4 }}>·</span>
            No credit card
            <span style={{ margin: "0 8px", opacity: 0.4 }}>·</span>
            Not legal advice
          </div>
        </div>

        {/* RIGHT COLUMN — mock browser */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            boxShadow:
              "0 20px 60px rgba(15,23,42,0.08), 0 4px 16px rgba(15,23,42,0.04)",
            overflow: "hidden",
            animation: "fadeUp 0.8s 0.3s ease both",
          }}
        >
          {/* Browser bar */}
          <div
            style={{
              background: "#f1f5f9",
              borderBottom: "1px solid #e2e8f0",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#ff5f57",
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#febc2e",
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#28c840",
              }}
            />

            <div
              style={{
                flex: 1,
                margin: "0 8px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                padding: "4px 12px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#94a3b8",
              }}
            >
              flaglink.ai/scan
            </div>
          </div>

          {/* Mock body */}
          <div>
            {/* Scan input row */}
            <div
              style={{
                padding: "10px 14px",
                display: "flex",
                gap: 8,
                alignItems: "center",
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                borderRadius: 8,
                margin: "16px 16px 12px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#94a3b8",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                https://spotify.com/legal/end-user-agreement/
              </div>

              <div
                style={{
                  background: "#6366f1",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Analyzing...
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ margin: "0 16px 12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "#94a3b8",
                  marginBottom: 6,
                }}
              >
                <span>Detecting red flags...</span>
                <span>71%</span>
              </div>

              <div
                style={{
                  height: 3,
                  background: "#f1f5f9",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "71%",
                    height: "100%",
                    background: "#6366f1",
                    borderRadius: 2,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "rgba(255,255,255,0.4)",
                      animation: "shimmer 1.2s infinite",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Flag results */}
            <div
              style={{
                padding: "0 12px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {[
                {
                  severity: "CRITICAL",
                  color: "#ef4444",
                  pillBg: "#fef2f2",
                  pillBorder: "#fecaca",
                  pillColor: "#991b1b",
                  label: "Forced arbitration",
                  sub: "Waives court rights",
                },
                {
                  severity: "HIGH",
                  color: "#f97316",
                  pillBg: "#fff7ed",
                  pillBorder: "#fed7aa",
                  pillColor: "#9a3412",
                  label: "Data sold to advertisers",
                  sub: "Third-party sharing",
                },
                {
                  severity: "HIGH",
                  color: "#f97316",
                  pillBg: "#fff7ed",
                  pillBorder: "#fed7aa",
                  pillColor: "#9a3412",
                  label: "Auto-renews annually",
                  sub: "No cancellation reminder",
                },
              ].map((flag, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderLeft: `3px solid ${flag.color}`,
                    borderRadius: 6,
                    padding: "8px 12px",
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: flag.color,
                      display: "inline-block",
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: 11,
                        color: "#0f172a",
                      }}
                    >
                      {flag.label}
                    </div>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400,
                        fontSize: 10,
                        color: "#94a3b8",
                        display: "block",
                        marginTop: 1,
                      }}
                    >
                      {flag.sub}
                    </span>
                  </div>

                  <div
                    style={{
                      marginLeft: "auto",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 8,
                      letterSpacing: "1px",
                      padding: "2px 6px",
                      borderRadius: 3,
                      background: flag.pillBg,
                      color: flag.pillColor,
                      border: `1px solid ${flag.pillBorder}`,
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
    </section>
  );
}

