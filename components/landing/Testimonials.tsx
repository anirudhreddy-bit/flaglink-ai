"use client";

export default function Testimonials() {
  const testimonials = [
    {
      initials: "MR",
      name: "Marcus R.",
      role: "Product Manager",
      quote:
        "FlagLink caught a forced arbitration clause in a SaaS tool I was about to pay $1,200/year for. Would never have found that myself.",
    },
    {
      initials: "SL",
      name: "Sarah L.",
      role: "Freelance Designer",
      quote:
        "I use this before signing up for every new tool. It flagged that one app was selling my data to 14 different advertising partners.",
    },
    {
      initials: "AK",
      name: "Arjun K.",
      role: "Startup Founder",
      quote:
        "Finally something that reads the fine print for me. Got a RUN verdict on a subscription I nearly signed up for. Saved me from a nightmare cancellation policy.",
    },
  ];

  return (
    <div className="w-full">
      {/* Label */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          color: "#3a4a6a",
          letterSpacing: "2px",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        Don't take our word for it
      </div>

        {/* H2 */}
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(24px, 3.5vw, 38px)",
            fontWeight: 900,
            letterSpacing: "-0.015em",
            textAlign: "center",
            color: "#eef2ff",
            marginBottom: "48px",
          }}
        >
          People who almost clicked "I Agree."
        </h2>

        {/* 3-column grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              style={{
                background: "#111828",
                border: "1px solid #1e2d4a",
                borderRadius: "12px",
                padding: "24px",
                animationName: "fadeUp",
                animationDuration: "0.6s",
                animationTimingFunction: "ease",
                animationDelay: `${i * 100}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Opening quote mark */}
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "32px",
                  color: "#1e2d4a",
                  lineHeight: 0.8,
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                "
              </div>

              {/* Quote text */}
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "#6b7fa8",
                  lineHeight: 1.75,
                  fontStyle: "italic",
                  marginBottom: "20px",
                  margin: 0,
                }}
              >
                {testimonial.quote}
              </p>

              {/* Author row */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--accent)",
                  }}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#c0cce8",
                    }}
                  >
                    {testimonial.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "11px",
                      fontWeight: 400,
                      color: "#3a4a6a",
                    }}
                  >
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
