"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function ArrowIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 8H12.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8.8 3.9L12.3 8L8.8 12.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ScanSection() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { data: session } = useSession();

  const handleScan = async () => {
    if (!input.trim()) {
      setError("Please enter a URL or paste Terms & Conditions text.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      sessionStorage.setItem("scanResult", JSON.stringify(data));
      sessionStorage.setItem("scanInput", input.trim());
      router.push("/results");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="scan"
      className="w-full bg-[#f8fafc] border-t border-[#e2e8f0]"
    >
      <div className="max-w-[680px] mx-auto px-6 py-16 text-center">
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: "-1px",
            color: "#0f172a",
            marginBottom: 8,
          }}
        >
          Ready to scan?
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: 14,
            color: "#94a3b8",
            marginBottom: 28,
          }}
        >
          Paste a URL or the full Terms &amp; Conditions below.
        </p>

        <div style={{ marginBottom: 14 }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              "Paste a URL (e.g. https://spotify.com/terms)\nor paste the full T&C text..."
            }
            disabled={loading}
            className="w-full min-h-[140px] resize-y rounded-[12px] bg-[#ffffff] border-[1.5px] border-[#e2e8f0] px-4 py-4 text-[14px] leading-[1.6] text-[#0f172a] placeholder-[#94a3b8] outline-none transition-shadow focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
            }}
          />
        </div>

        {error ? (
          <p
            style={{
              marginTop: 14,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: "#991b1b",
            }}
          >
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleScan}
          disabled={loading || !input.trim()}
          className="w-full h-[52px] rounded-[10px] bg-[#6366f1] text-[#ffffff] border-none flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:bg-[#4f46e5] hover:shadow-[0_8px_24px_rgba(99,102,241,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.2px",
            fontSize: 15,
          }}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    background: "#ffffff",
                    animation: `pulse 1.5s infinite`,
                    animationDelay: `${i * 0.2}s`,
                    opacity: 1,
                  }}
                />
              ))}
            </span>
          ) : (
            <>
              <span>Scan for Red Flags</span>
              <span style={{ color: "#ffffff" }}>
                <ArrowIcon size={16} />
              </span>
            </>
          )}
        </button>

        {loading ? (
          <p
            style={{
              marginTop: 10,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "#6366f1",
            }}
          >
            Analyzing your document...
          </p>
        ) : null}

        <p
          style={{
            marginTop: 14,
            fontFamily: "'DM Sans', sans-serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 11,
            color: "#1e2c45",
            lineHeight: 1.6,
          }}
        >
          Not legal advice. For informational purposes only.
        </p>

        {session?.user ? (
          <Link
            href="/account?tab=history"
            style={{
              display: "block",
              marginTop: 12,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              color: "#94a3b8",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#6366f1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            View Scan History
          </Link>
        ) : null}
      </div>
    </section>
  );
}

