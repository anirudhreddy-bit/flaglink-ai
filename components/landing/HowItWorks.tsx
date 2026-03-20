"use client";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Drop in any URL",
      body: "Paste a T&C link or raw text into the scanner. Works with any publicly accessible Terms & Conditions page.",
    },
    {
      number: "02",
      title: "Claude reads it all",
      body: "Our AI reads every clause in under 2 seconds, checking for 10+ red flag types including auto-renewals, arbitration, and data sharing.",
    },
    {
      number: "03",
      title: "Get your verdict",
      body: "Receive a risk score, plain-English flag explanations, and 'what to do' advice. Share the report with anyone who needs to see it.",
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(26px, 3.5vw, 40px)",
              fontWeight: 900,
              letterSpacing: "-0.015em",
              color: "var(--ink)",
              marginBottom: "12px",
            }}
          >
            From concept to verdict, surprisingly fast.
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              color: "var(--muted)",
            }}
          >
            Three steps. One clear answer. No legal degree needed.
          </p>
        </div>

        {/* 3-column grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "28px",
                position: "relative",
                overflow: "hidden",
                animationName: "fadeUp",
                animationDuration: "0.6s",
                animationTimingFunction: "ease",
                animationDelay: `${i * 100}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Step label */}
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  color: "var(--accent)",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                {step.number} — PASTE
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "8px",
                  lineHeight: 1.3,
                }}
              >
                {step.title}
              </h3>

              {/* Body */}
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "var(--muted)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {step.body}
              </p>

              {/* Decorative number */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-16px",
                  right: "8px",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "80px",
                  fontWeight: 900,
                  color: "rgba(99, 102, 241, 0.04)",
                  pointerEvents: "none",
                  lineHeight: 1,
                }}
              >
                {step.number}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
