"use client";

export default function LandingFooter() {
  return (
    <footer
      className="w-full"
      style={{
        background: "#0a0d14",
        borderTop: "1px solid #1a2238",
        padding: "28px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 5,
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="8,5 19,12 8,19" fill="#0a0d14" />
          </svg>
        </div>

        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 17,
            letterSpacing: "-0.5px",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#ffffff" }}>FlagLink</span>
          <span style={{ color: "#6366f1" }}>AI</span>
        </div>
      </div>

      {/* Center disclaimer */}
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: 11,
          color: "#1e2c45",
          fontStyle: "italic",
          textAlign: "center",
          flex: "1 1 260px",
        }}
      >
        Not legal advice. For informational purposes only. Powered by Claude.
      </div>

      {/* Right */}
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: 11,
          color: "#1e2c45",
          textAlign: "right",
          flex: "0 0 auto",
        }}
      >
        © 2026 FlagLink AI
      </div>
    </footer>
  );
}

