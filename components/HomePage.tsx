"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
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
        setLoading(false);
        return;
      }

      sessionStorage.setItem("scanResult", JSON.stringify(data));
      sessionStorage.setItem("scanInput", input.trim());
      router.push("/results");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ─── Header ─── */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 py-5 sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-black">
              FL
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              FlagLink
              <span className="text-indigo-600"> AI</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
          </nav>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <Link
                href="/account?tab=account"
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                My Account
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 shadow-sm"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-24 bg-white">
          <div className="mx-auto max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — copy */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-4 py-1.5 text-xs font-semibold text-indigo-600 tracking-wide uppercase">
                AI-Powered Legal Scanner
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6">
                Stop blindly clicking
                <br />
                <span className="text-indigo-600">&ldquo;I Agree.&rdquo;</span>
              </h1>

              <p className="text-lg text-slate-500 mb-10 max-w-lg leading-relaxed">
                Paste any Terms &amp; Conditions URL or text. FlagLink AI reads every
                clause, flags hidden traps, and tells you — in plain English — whether
                to sign or run.
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={() =>
                    document.getElementById("scan-box")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-lg bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-[0.98]"
                >
                  Start Scanning
                </button>
                <Link
                  href="#how-it-works"
                  className="rounded-lg border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  How it works
                </Link>
              </div>

              <p className="text-xs text-slate-400">
                Free forever · No credit card · Not legal advice
              </p>
            </div>

            {/* Right — live mockup */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="rounded-2xl bg-white shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    </div>
                    <div className="flex-1 mx-3 rounded bg-slate-100 py-1 text-center text-[11px] text-slate-400 font-mono">
                      flaglink.ai/scan
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-6 space-y-5">
                    <input
                      type="text"
                      value="https://spotify.com/legal/end-user-agreement/"
                      readOnly
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-50 text-slate-700 text-xs border border-slate-200 font-mono"
                    />
                    <div className="w-full px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold text-center">
                      Analyzing...
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Detecting red flags...</span>
                        <span className="text-xs font-bold text-red-500">71%</span>
                      </div>
                      <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: "71%" }} />
                      </div>
                    </div>
                    {/* Mock flags */}
                    <div className="space-y-2.5 pt-1">
                      {[
                        { title: "Forced arbitration", desc: "Waives court rights", severity: "Critical", color: "red" },
                        { title: "Data sold to advertisers", desc: "Third-party sharing", severity: "High", color: "orange" },
                        { title: "Auto-renews annually", desc: "No cancellation reminder", severity: "High", color: "orange" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs">
                          <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${item.color === "red" ? "bg-red-500" : "bg-orange-400"}`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-700">{item.title}</div>
                            <div className="text-slate-400">{item.desc}</div>
                          </div>
                          <span className={`shrink-0 text-[10px] font-bold uppercase ${item.color === "red" ? "text-red-500" : "text-orange-500"}`}>
                            {item.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats Row ─── */}
        <section id="features" className="px-6 py-16 bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "< 2 s", text: "Scan speed" },
                { label: "10+", text: "Red flag types" },
                { label: "100%", text: "Plain English" },
                { label: "Free", text: "No card needed" },
              ].map((stat) => (
                <div key={stat.label} className="text-center py-4">
                  <div className="text-3xl font-extrabold text-indigo-600 mb-1">{stat.label}</div>
                  <div className="text-sm text-slate-500">{stat.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How it works ─── */}
        <section id="how-it-works" className="px-6 py-20 bg-white">
          <div className="mx-auto max-w-4xl text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">How it works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Three simple steps to know what you&apos;re agreeing to.</p>
          </div>
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "Paste a URL or text",
                desc: "Drop any Terms & Conditions link or copy-paste the full text into the scanner.",
              },
              {
                step: "2",
                title: "AI scans every clause",
                desc: "Claude AI reads the entire document, identifying red flags, traps, and hidden terms.",
              },
              {
                step: "3",
                title: "Get your verdict",
                desc: "Receive a risk score, flagged clauses, and plain-English advice on what to do next.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-lg font-bold mb-5">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Scan Input ─── */}
        <section id="scan-box" className="px-6 py-20 bg-slate-50 border-t border-slate-200">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Ready to scan?</h2>
              <p className="text-slate-500 text-sm">Paste a URL or the full Terms &amp; Conditions below.</p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste a URL (e.g. https://spotify.com/terms) or paste the full T&C text..."
                rows={5}
                className="w-full resize-none rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                disabled={loading}
              />

              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-slate-400">
                  {input.length > 0 && `${input.length.toLocaleString()} characters`}
                </p>
                <button
                  onClick={handleScan}
                  disabled={loading || !input.trim()}
                  className="rounded-lg bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Scanning...
                    </span>
                  ) : (
                    "Scan for Red Flags"
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        </section>

        {/* Scan History for logged-in users */}
        {session?.user && (
          <div className="flex justify-center py-10 bg-white">
            <Link
              href="/account?tab=history"
              className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              View Scan History
            </Link>
          </div>
        )}

        {/* ─── Trusted brands ─── */}
        <section className="px-6 py-14 bg-slate-50 border-t border-slate-200">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-medium text-slate-400 tracking-widest uppercase mb-6">
              Trusted by people signing up for
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 items-center">
              {["Spotify", "Netflix", "Adobe", "Dropbox", "Slack", "GitHub", "Figma", "OpenAI"].map((brand) => (
                <span key={brand} className="text-sm font-semibold text-slate-300 hover:text-slate-500 transition-colors">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200 px-6 py-8 text-center bg-white">
        <p className="text-xs text-slate-400">
          Not legal advice. For informational purposes only. &copy; {new Date().getFullYear()} FlagLink AI
        </p>
      </footer>
    </div>
  );
}
