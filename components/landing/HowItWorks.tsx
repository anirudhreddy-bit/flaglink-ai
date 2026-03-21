"use client";

export default function HowItWorks() {
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

  return (
    <section id="how-it-works" className="w-full bg-[#ffffff]">
      <div className="max-w-[900px] mx-auto px-10 py-20 text-center">
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(26px,3.5vw,40px)",
            color: "#0f172a",
            letterSpacing: "-1.5px",
            marginBottom: 8,
          }}
        >
          How it works
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: 14,
            color: "#94a3b8",
            marginBottom: 48,
            lineHeight: 1.7,
          }}
        >
          Three simple steps to know what you&apos;re agreeing to.
        </p>

        <div className="grid grid-cols-3 gap-[40px] max-w-[800px] mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#eef2ff",
                  border: "2px solid #c7d2fe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#6366f1",
                }}
              >
                {idx + 1}
              </div>
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
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
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: 13,
                  color: "#475569",
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

