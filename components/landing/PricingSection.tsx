"use client";

import Link from "next/link";

export default function PricingSection() {
  const plans = [
    {
      tier: "FREE",
      price: "$0",
      period: "/mo",
      description: "3 scans per month. Perfect to try it out.",
      buttonText: "Start Free",
      featured: false,
    },
    {
      tier: "PRO",
      price: "$4.99",
      period: "/mo",
      description: "Unlimited scans. Save history. Share reports.",
      buttonText: "Get Pro",
      featured: true,
    },
    {
      tier: "PER SCAN",
      price: "$1.29",
      period: "/scan",
      description: "Pay only when you need a deep scan. No subscription.",
      buttonText: "Buy a Scan",
      featured: false,
    },
  ];

  return (
    <div className="w-full" id="pricing">
        {/* Header */}
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(24px, 3.5vw, 40px)",
            fontWeight: 900,
            letterSpacing: "-0.015em",
            color: "var(--ink)",
            marginBottom: "12px",
          }}
        >
          Simple pricing. Zero surprises.
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            color: "var(--muted)",
            marginBottom: "40px",
          }}
        >
          Start free. Upgrade when you need more.
        </p>

        {/* 3-column grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <div
              key={i}
              style={{
                background: plan.featured ? "var(--accent-bg)" : "white",
                border: plan.featured ? "2px solid var(--accent)" : "1px solid var(--border)",
                borderRadius: "14px",
                padding: "24px",
                textAlign: "left",
                transition: "all 0.2s",
                animationName: "fadeUp",
                animationDuration: "0.6s",
                animationTimingFunction: "ease",
                animationDelay: `${i * 100}ms`,
                animationFillMode: "both",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Tier label */}
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: plan.featured ? "var(--accent)" : "var(--muted)",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                  fontWeight: 600,
                }}
              >
                {plan.tier}
              </div>

              {/* Price */}
              <div style={{ marginBottom: "12px" }}>
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "32px",
                    fontWeight: 900,
                    color: plan.featured ? "var(--accent)" : "var(--ink)",
                    letterSpacing: "-1.5px",
                  }}
                >
                  {plan.price}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    color: "var(--muted)",
                    marginLeft: "4px",
                  }}
                >
                  {plan.period}
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "var(--muted)",
                  lineHeight: 1.6,
                  marginBottom: "20px",
                }}
              >
                {plan.description}
              </p>

              {/* Button */}
              <button
                className={plan.featured ? "btn-primary" : "btn-ghost"}
                style={{
                  width: "100%",
                  padding: "10px",
                }}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
