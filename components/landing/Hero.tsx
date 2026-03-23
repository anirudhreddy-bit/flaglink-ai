import Link from "next/link";
import ScanCardDemo from "./ScanCardDemo";
import ScanCTAButton from "./ScanCTAButton";

export default function Hero() {
  return (
    <section
      style={{
        background: "#f5f4f0",
        width: "100%",
        padding: "72px 6% 64px",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        {/* ── LEFT COLUMN ── */}
        <div style={{ paddingLeft: "6%" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#ffffff",
              border: "1px solid #c7d2fe",
              borderRadius: 50,
              padding: "4px 13px",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#4f46e5",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                fontWeight: 500,
                color: "#4f46e5",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              AI-Powered Legal Scanner
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(34px, 3.5vw, 54px)",
              lineHeight: 1.08,
              color: "#0f172a",
              marginBottom: 18,
              letterSpacing: "-0.02em",
            }}
          >
            Stop blindly clicking
            <br />
            <span style={{ color: "#4f46e5" }}>&ldquo;I Agree.&rdquo;</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 16,
              color: "#555",
              lineHeight: 1.65,
              maxWidth: 420,
              marginBottom: 32,
            }}
          >
            Paste any Terms &amp; Conditions URL or text. FlagLink AI reads
            every clause, flags hidden traps, and tells you — in plain English —
            whether to sign or run.
          </p>

          {/* CTA Row */}
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <ScanCTAButton />
            <Link
              href="/how-it-works"
              style={{
                background: "transparent",
                color: "#444",
                border: "0.5px solid #ccc",
                borderRadius: 50,
                padding: "11px 22px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                textDecoration: "none",
                transition: "border-color 0.15s",
              }}
            >
              How it works
            </Link>
          </div>

          {/* Trust row */}
          <div
            style={{
              display: "flex",
              gap: 18,
              flexWrap: "wrap",
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: "#888",
            }}
          >
            {["Free forever", "No credit card", "Not legal advice"].map((item) => (
              <span
                key={item}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN — animated scan card ── */}
        <ScanCardDemo />
      </div>
    </section>
  );
}
