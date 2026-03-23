"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const FLAGS = [
  {
    dot: "#ef4444",
    label: "Forced arbitration",
    sub: "Waives court rights",
    badge: "CRITICAL",
    badgeBg: "#fcebeb",
    badgeColor: "#a32d2d",
  },
  {
    dot: "#f59e0b",
    label: "Data sold to advertisers",
    sub: "Third-party sharing",
    badge: "HIGH",
    badgeBg: "#faeeda",
    badgeColor: "#854f0b",
  },
  {
    dot: "#f59e0b",
    label: "Auto-renews annually",
    sub: "No cancellation reminder",
    badge: "HIGH",
    badgeBg: "#faeeda",
    badgeColor: "#854f0b",
  },
];

const PROGRESS_TARGET = 71;
const FILL_DURATION = 1800;   // ms to fill bar to 71%
const HOLD_DURATION = 1400;   // ms to hold completed state
const RESET_DURATION = 400;   // ms pause after reset before next cycle

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ScanCardDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visibleFlags, setVisibleFlags] = useState<boolean[]>([false, false, false]);

  const runCycle = useCallback(() => {
    // Reset state
    setProgress(0);
    setVisibleFlags([false, false, false]);

    // Short pause before starting fill
    const startDelay = setTimeout(() => {
      const start = performance.now();

      // Animate progress bar
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / FILL_DURATION);
        const eased = easeOutCubic(t);
        setProgress(Math.round(eased * PROGRESS_TARGET));
        if (t < 1) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);

      // Stagger flag items in
      const flagTimings = [600, 1050, 1500];
      const flagTimeouts = flagTimings.map((delay, i) =>
        setTimeout(() => {
          setVisibleFlags((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, delay)
      );

      // Hold completed state, then schedule next cycle
      const holdTimeout = setTimeout(() => {
        runCycle();
      }, FILL_DURATION + HOLD_DURATION);

      return () => {
        flagTimeouts.forEach(clearTimeout);
        clearTimeout(holdTimeout);
      };
    }, RESET_DURATION);

    return () => clearTimeout(startDelay);
  }, []);

  // Trigger on viewport entry
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const cleanup = runCycle();
    return cleanup;
  }, [visible, runCycle]);

  return (
    <div
      ref={ref}
      style={{
        background: "#ffffff",
        borderRadius: 18,
        border: "0.5px solid #e2e1db",
        boxShadow: "0 8px 40px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          background: "#f0efe9",
          borderBottom: "0.5px solid #e2e1db",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
        <div
          style={{
            flex: 1,
            marginLeft: 8,
            background: "#ffffff",
            border: "0.5px solid #e2e1db",
            borderRadius: 6,
            padding: "3px 10px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#999",
          }}
        >
          flaglink.ai/scan
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "14px 14px 16px" }}>
        {/* URL input row */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "#fafaf7",
            border: "0.5px solid #eceae4",
            borderRadius: 9,
            padding: "8px 10px",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              flex: 1,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "#999",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            https://spotify.com/legal/end-user-agreement/
          </span>
          <span
            style={{
              background: "#4f46e5",
              color: "#fff",
              borderRadius: 6,
              padding: "5px 10px",
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              whiteSpace: "nowrap",
              flexShrink: 0,
              animation: "pulse 1.6s ease-in-out infinite",
            }}
          >
            Analyzing...
          </span>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#999" }}>
              Detecting red flags...
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                color: "#4f46e5",
                fontWeight: 600,
                minWidth: 28,
                textAlign: "right",
                transition: "color 0.2s",
              }}
            >
              {progress}%
            </span>
          </div>
          <div style={{ height: 4, background: "#eeece6", borderRadius: 2, overflow: "hidden" }}>
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #6366f1, #4f46e5)",
                borderRadius: 2,
                transition: "width 0.04s linear",
              }}
            />
          </div>
        </div>

        {/* Flag items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {FLAGS.map((flag, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#fafaf7",
                border: "0.5px solid #eceae4",
                borderRadius: 9,
                padding: "8px 10px",
                opacity: visibleFlags[i] ? 1 : 0,
                transform: visibleFlags[i] ? "translateY(0px)" : "translateY(8px)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: flag.dot,
                  display: "inline-block",
                  flexShrink: 0,
                  boxShadow: `0 0 0 3px ${flag.dot}22`,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#0f172a",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {flag.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10,
                    color: "#999",
                    marginTop: 1,
                  }}
                >
                  {flag.sub}
                </div>
              </div>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  padding: "2px 7px",
                  borderRadius: 4,
                  background: flag.badgeBg,
                  color: flag.badgeColor,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {flag.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
