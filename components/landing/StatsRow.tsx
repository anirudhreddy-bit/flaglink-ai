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
        format: (v) => {
          const rounded = Math.round(v);
          if (rounded >= 2) return "< 2s";
          return `< ${rounded}s`;
        },
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
        format: (v) => (v >= 0.999 ? "Free" : "0"),
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

    const durationMs = 1500;
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
      className="w-full bg-[#f8fafc] border-y border-[#e2e8f0]"
    >
      <div className="max-w-[900px] mx-auto px-10 py-12 grid grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`text-center px-[20px] ${
              i < stats.length - 1 ? "border-r border-[#e2e8f0]" : ""
            }`}
          >
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 900,
                fontSize: 36,
                color: "#6366f1",
                letterSpacing: "-1.5px",
              }}
            >
              {stat.format(values[i] ?? 0)}
            </div>
            <div
              style={{
                marginTop: 4,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontSize: 11,
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

