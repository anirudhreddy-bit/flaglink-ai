"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "88px 6% 60px",
        background: "#f5f4f0",
      }}
    >
      <div style={{ width: "100%", maxWidth: 640, textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 700,
            fontSize: 32,
            letterSpacing: "-0.02em",
            color: "#0f172a",
            marginBottom: 8,
          }}
        >
          Ready to scan?
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 14,
            color: "#888",
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
            className="w-full min-h-[180px] resize-y rounded-[12px] bg-[#ffffff] border-[0.5px] border-[#e2e1db] px-4 py-4 text-[14px] leading-[1.6] text-[#0f172a] placeholder-[#aaa] outline-none transition-shadow focus:border-[#4f46e5] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.08)]"
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
          className="w-full h-[52px] rounded-[50px] bg-[#4f46e5] text-[#ffffff] border-none flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:bg-[#4338ca] hover:shadow-[0_8px_24px_rgba(79,70,229,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
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

      </div>
    </section>
  );
}

