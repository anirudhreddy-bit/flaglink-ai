"use client";

const steps = [
  {
    title: "Paste a URL or text",
    body: "Drop any Terms & Conditions link or copy-paste the full text into the scanner.",
  },
  {
    title: "AI scans every clause",
    body: "Claude AI reads the entire document, identifying red flags, traps, and hidden terms.",
  },
  {
    title: "Get your verdict",
    body: "Receive a risk score, flagged clauses, and plain-English advice on what to do next.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{ width: "100%", padding: "0 6%" }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 3.5vw, 44px)",
            color: "#0f172a",
            letterSpacing: "-0.02em",
            marginBottom: 10,
          }}
        >
          How it works
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 15,
            color: "#888",
            marginBottom: 56,
            lineHeight: 1.65,
          }}
        >
          Three simple steps to know what you&apos;re agreeing to.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 40,
            maxWidth: 820,
            margin: "0 auto",
          }}
        >
          {steps.map((step, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#eef2ff",
                  border: "1px solid #c7d2fe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#4f46e5",
                }}
              >
                {idx + 1}
              </div>
              <h3
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#0f172a",
                  marginBottom: 8,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  color: "#666",
                  lineHeight: 1.7,
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
