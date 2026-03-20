"use client";

import { useEffect, useRef, useState } from "react";

interface StatCell {
  number: string;
  label: string;
  targetValue?: number;
}

function useIntersectionObserver(elementRef: React.RefObject<HTMLDivElement | null>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [elementRef]);

  return isVisible;
}

function CountUp({
  target,
  visible,
  suffix = "",
}: {
  target: number;
  visible: boolean;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;

    let current = 0;
    const increment = target / 60;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, 25);

    return () => clearInterval(interval);
  }, [visible, target]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

export default function StatsRow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(containerRef);

  const stats: StatCell[] = [
    { number: "< 2s", label: "Scan speed" },
    { number: "10+", label: "Red flag types detected" },
    { number: "100%", label: "Plain English output" },
    { number: "Free", label: "To start, no card needed" },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full grid grid-cols-2 md:grid-cols-4 gap-0"
      style={{
        borderRight: "1px solid var(--border)",
      }}
    >
      {stats.map((stat, i) => (
          <div
            key={i}
            className="text-center py-6 md:py-0"
            style={{
              borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none",
              paddingRight: i < stats.length - 1 ? "24px" : "0",
              paddingLeft: i > 0 ? "24px" : "0",
              animationName: isVisible ? "fadeUp" : "none",
              animationDuration: "0.6s",
              animationTimingFunction: "ease",
              animationDelay: `${i * 100}ms`,
              animationFillMode: "both",
            }}
          >
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "36px",
                fontWeight: 900,
                color: "var(--accent)",
                letterSpacing: "-1.5px",
                marginBottom: "4px",
              }}
            >
              {stat.number === "< 2s" && "< 2s"}
              {stat.number === "10+" && "10+"}
              {stat.number === "100%" && "100%"}
              {stat.number === "Free" && "Free"}
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "var(--muted)",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    );
  }
