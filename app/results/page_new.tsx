"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScanResult, Scan } from "@/lib/types";
import RedFlagCard from "@/components/RedFlagCard";

type Phase = "scanning" | "score" | "verdict" | "flags" | "done";

export default function ResultsPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [phase, setPhase] = useState<Phase>("scanning");
  const [displayScore, setDisplayScore] = useState(0);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const stored = sessionStorage.getItem("scanResult");
    if (!stored) {
      router.push("/");
      return;
    }
    try {
      setResult(JSON.parse(stored));
    } catch {
      router.push("/");
    }
  }, [router]);

  // Phase state machine
  useEffect(() => {
    if (!result) return;

    const t1 = setTimeout(() => setPhase("score"), 1500);
    const t2 = setTimeout(() => setPhase("verdict"), 3200);
    const t3 = setTimeout(() => setPhase("flags"), 4000);
    const t4 = setTimeout(() => setPhase("done"), 4000 + result.redFlags.length * 200 + 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [result]);

  // Score counter
  useEffect(() => {
    if (phase !== "score" || !result) return;

    let current = 0;
    const interval = setInterval(() => {
      current += Math.ceil((result.score - current) / 8);
      if (current >= result.score) {
        setDisplayScore(result.score);
        clearInterval(interval);
      } else {
        setDisplayScore(current);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [phase, result]);

  // Canvas animation
  useEffect(() => {
    if (!result || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width;
    let H = canvas.height;
    let t = 0;
    let localPhase = phase;
    let localDisplayScore = displayScore;
    let raf: number;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        W = canvas.width = rect.width;
        H = canvas.height = rect.height;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      size: number;
    }

    let particles: Particle[] = [];
    let hasSpawned = false;

    const spawnBurst = (x: number, y: number, color: string, n: number) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 2 + Math.random() * 4;
        particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          color,
          size: 1.5 + Math.random() * 2,
        });
      }
    };

    const easeOut = (t: number) => 1 - (1 - t) * (1 - t);

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      t += 0.016;
      localPhase = phase;
      localDisplayScore = displayScore;

      const cx = W / 2;
      const cy = H / 2;

      // Particle animation
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life -= 0.018;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw scanning phase
      if (localPhase === "scanning") {
        const dotCount = 3;
        for (let i = 0; i < dotCount; i++) {
          const dp = (Math.sin(t * 3 + i * 1.2) + 1) / 2;
          ctx.globalAlpha = 0.3 + dp * 0.7;
          ctx.fillStyle = "#6366f1";
          ctx.beginPath();
          ctx.arc(cx - 20 + i * 20, cy + 50, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      // Draw score phase
      if (localPhase === "score") {
        const scorePercent = Math.min(1, localDisplayScore / 100);
        const radius = 80;

        // Background arc
        ctx.strokeStyle = "#1a2035";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(cx, cy - 30, radius, -Math.PI / 2, Math.PI * 2 * 1.5, false);
        ctx.stroke();

        // Score arc
        const fillAngle = -Math.PI / 2 + Math.PI * 2 * scorePercent * 0.75;
        const scoreColor = localDisplayScore <= 30 ? "#ef4444" : localDisplayScore <= 65 ? "#f97316" : "#22c55e";
        ctx.strokeStyle = scoreColor;
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(cx, cy - 30, radius, -Math.PI / 2, fillAngle, false);
        ctx.stroke();
        ctx.lineCap = "butt";

        // Score text
        ctx.font = "800 52px sans-serif";
        ctx.fillStyle = scoreColor;
        ctx.textAlign = "center";
        ctx.fillText(String(localDisplayScore), cx, cy - 10);

        ctx.font = "400 12px sans-serif";
        ctx.fillStyle = "#4a5a7a";
        ctx.fillText("RISK SCORE OUT OF 100", cx, cy + 20);
      }

      // Draw verdict phase
      if (localPhase === "verdict") {
        const flash = Math.max(0, 1 - t * 3);
        if (flash > 0) {
          ctx.fillStyle = `rgba(239,68,68,${flash * 0.15})`;
          ctx.fillRect(0, 0, W, H);
        }

        // Spawn particles once
        if (!hasSpawned) {
          const verdictColor = result.score <= 30 ? "#ef4444" : result.score <= 65 ? "#f97316" : "#22c55e";
          spawnBurst(cx, cy - 60, verdictColor, 40);
          hasSpawned = true;
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      hasSpawned = false;
    };
  }, [phase, displayScore, result]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!result) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#060810" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#6b7fa8" }}>
          <svg style={{ height: "20px", width: "20px", animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity={0.25} />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity={0.75} />
          </svg>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>Loading results…</span>
        </div>
      </div>
    );
  }

  const highFlags = result.redFlags.filter((f) => f.severity === "high");
  const mediumFlags = result.redFlags.filter((f) => f.severity === "medium");
  const lowFlags = result.redFlags.filter((f) => f.severity === "low");
  const sortedFlags = [...highFlags, ...mediumFlags, ...lowFlags];

  const verdictColor = result.score <= 30 ? "#ef4444" : result.score <= 65 ? "#f97316" : "#22c55e";
  const verdictText = result.score <= 30 ? "RUN." : result.score <= 65 ? "CAUTION." : "SAFE.";

  return (
    <main style={{ minHeight: "100vh", background: "#060810", position: "relative", overflow: "hidden" }}>
      {/* Canvas for background animation */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'DM Sans', sans-serif" }}>
        {/* PHASE 1: SCANNING */}
        {phase === "scanning" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ textAlign: "center" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: "#6b7fa8", marginBottom: "16px" }}>
              Analyzing your terms...
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#4a5a8a" }}>
              Reading every clause — please wait
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 2: SCORE */}
        {phase === "score" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ textAlign: "center" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#6b7fa8", marginTop: "16px" }}>
              Scanning complete
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 3: VERDICT */}
        {(phase === "verdict" || phase === "flags" || phase === "done") && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase === "verdict" ? 1 : 0.4 }} transition={{ duration: 0.3 }} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <motion.div initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ fontSize: "clamp(72px, 14vw, 140px)", fontWeight: 900, fontFamily: "'Syne', sans-serif", color: verdictColor, letterSpacing: "-4px", lineHeight: 1, textAlign: "center", transform: "none", direction: "ltr", writingMode: "horizontal-tb" }}>
              {verdictText}
            </motion.div>

            {phase === "verdict" && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", color: "#6b7fa8", marginTop: "16px" }}>
                {result.redFlags.length} red flag{result.redFlags.length !== 1 ? "s" : ""} detected
              </motion.p>
            )}
          </motion.div>
        )}

        {/* PHASE 4: FLAGS */}
        {(phase === "flags" || phase === "done") && sortedFlags.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ width: "100%", maxWidth: "700px", marginTop: 40 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#ef4444", letterSpacing: "1px", marginBottom: "20px", textTransform: "uppercase" }}>
              {sortedFlags.length} Red Flag{sortedFlags.length !== 1 ? "s" : ""} Detected
            </motion.div>

            <div style={{ display: "grid", gap: "12px" }}>
              {sortedFlags.map((flag, i) => (
                <RedFlagCard key={i} flag={flag} />
              ))}
            </div>
          </motion.div>
        )}

        {/* PHASE 5: DONE */}
        {phase === "done" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ width: "100%", maxWidth: "700px", marginTop: "40px" }}>
            {result.advice.length > 0 && (
              <motion.div style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: 600, fontFamily: "'Syne', sans-serif", color: "#eef2ff", marginBottom: "16px" }}>What to Do</h2>
                <div>
                  {result.advice.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={{ display: "flex", gap: "12px", paddingTop: "12px", borderTop: "1px solid #1a2238", paddingBottom: "12px" }}>
                      <span style={{ color: "#6366f1", fontWeight: 700, flexShrink: 0 }}>→</span>
                      <p style={{ fontSize: "13px", color: "#6b7fa8", lineHeight: 1.7, margin: 0 }}>{item}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginBottom: "32px" }}>
              <motion.button onClick={handleShare} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-ghost" style={{ padding: "11px 22px", fontSize: "13px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
                {copied ? "✓ Copied!" : "📋 Copy Link"}
              </motion.button>

              {session?.user && (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-ghost" style={{ padding: "11px 22px", fontSize: "13px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
                  💾 Save Scan
                </motion.button>
              )}

              <Link href="/?scan=true" className="btn-primary" style={{ padding: "11px 22px", fontSize: "13px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", display: "inline-block", textDecoration: "none", color: "#fff", cursor: "pointer" }}>
                Scan Again →
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: phase === "done" ? 0.5 : 0 }} style={{ marginTop: "48px", textAlign: "center", maxWidth: "700px" }}>
          <p style={{ fontSize: "11px", color: "#1e2c45", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>
            Not legal advice. For informational purposes only. Powered by Claude.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
