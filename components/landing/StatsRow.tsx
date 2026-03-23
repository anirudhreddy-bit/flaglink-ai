"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Stat = {
  label: string;
  target: number;
  format: (value: number) => string;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function StatsRow() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState<number[]>([0, 0, 0, 0]);

  const stats: Stat[] = useMemo(
    () => [
      {
        label: "Scan speed",
        target: 2,
        format: (v) => (Math.round(v) >= 2 ? "< 2s" : `< ${Math.round(v)}s`),
      },
      {
        label: "Red flag types",
        target: 10,
        format: (v) => `${Math.round(v)}+`,
      },
      {
        label: "Plain English",
        target: 100,
        format: (v) => `${Math.round(v)}%`,
      },
      {
        label: "No card needed",
        target: 1,
        format: (v) => (v >= 0.999 ? "Free" : "—"),
      },
    ],
    []
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const durationMs = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeOutCubic(t);
      setValues(stats.map((s) => s.target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, stats]);

  return (
    <div
      ref={ref}
      style={{
        background: "#ffffff",
        borderTop: "0.5px solid #e2e1db",
        borderBottom: "0.5px solid #e2e1db",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          width: "100%",
          padding: "0 6%",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              textAlign: "center",
              padding: "32px 20px",
              borderLeft: i > 0 ? "0.5px solid #e2e1db" : "none",
            }}
          >
            <div
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(30px, 3vw, 44px)",
                color: "#4f46e5",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                marginBottom: 7,
              }}
            >
              {stat.format(values[i] ?? 0)}
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: 11,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
