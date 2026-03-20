"use client";

import Link from "next/link";

export default function FinalCTA() {
  return (
    <section
      className="w-full"
      style={{
        background: "linear-gradient(135deg, #06080f 0%, #0d1120 50%, #111828 100%)",
        textAlign: "center",
      }}
    >
      <div className="max-w-4xl mx-auto px-10 py-20">
        {/* Label */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "#3a4a6a",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          Get Started Today
        </div>

        {/* H2 */}
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(28px, 5vw, 56px)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#eef2ff",
            marginBottom: "16px",
            lineHeight: 1.15,
          }}
        >
          Stop clicking{" "}
          <span style={{ color: "var(--run)" }}>"I Agree."</span>
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "15px",
            fontWeight: 400,
            color: "#4a5a7a",
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
          Join thousands of people who read before they sign. Free, instant,
          plain English.
        </p>

        {/* Buttons row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          <Link href="/auth/signup" className="btn-primary">
            Start Free Today
          </Link>
          <Link href="mailto:hello@flaglink.ai" className="btn-ghost-dark">
            Book a Demo
          </Link>
        </div>

        {/* Disclaimer */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 300,
            color: "#1e2c45",
            fontStyle: "italic",
            margin: 0,
          }}
        >
          Not legal advice. For informational purposes only. Powered by Claude.
        </p>
      </div>
    </section>
  );
}
