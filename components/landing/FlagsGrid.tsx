"use client";

export default function FlagsGrid() {
  const flags = [
    {
      title: "Forced arbitration",
      body: "You permanently waive your right to sue in court. Disputes handled privately, on their terms.",
      borderColor: "var(--run)",
    },
    {
      title: "Data selling",
      body: "Your personal data shared with or sold to third-party advertising partners.",
      borderColor: "var(--run)",
    },
    {
      title: "Auto-renewal traps",
      body: "Subscription renews automatically with no reminder email before the charge.",
      borderColor: "var(--warn)",
    },
    {
      title: "IP rights grab",
      body: "They claim perpetual license over everything you upload, create, or submit.",
      borderColor: "var(--warn)",
    },
    {
      title: "Unilateral term changes",
      body: "Company can update terms at any time without prior notice to users.",
      borderColor: "#eab308",
    },
    {
      title: "Consent by continued use",
      body: "Using the service = agreeing to terms. No explicit confirmation required.",
      borderColor: "#eab308",
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.015em",
              color: "var(--ink)",
              marginBottom: "12px",
            }}
          >
            What we always look for.
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              color: "var(--muted)",
            }}
          >
            10+ red flag types scanned on every single document.
          </p>
        </div>

        {/* 2-column grid */}
        <div className="grid md:grid-cols-2 gap-3">
          {flags.map((flag, i) => (
            <div
              key={i}
              style={{
                background: "white",
                border: "1px solid var(--border)",
                borderLeft: `4px solid ${flag.borderColor}`,
                borderRadius: "10px",
                padding: "16px 20px",
                transition: "all 0.2s",
                cursor: "pointer",
                animationName: "fadeUp",
                animationDuration: "0.6s",
                animationTimingFunction: "ease",
                animationDelay: `${i * 100}ms`,
                animationFillMode: "both",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "4px",
                  lineHeight: 1.3,
                }}
              >
                {flag.title}
              </h3>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "var(--muted)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {flag.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
