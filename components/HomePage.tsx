"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

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
            <Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link>
            <Link href="/how-it-works" className="hover:text-slate-900 transition-colors">How it works</Link>
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
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <section className="w-full max-w-4xl">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-4 py-1.5 text-xs font-semibold text-indigo-600 tracking-wide uppercase">
              AI-Powered Legal Scanner
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-8">
              Stop blindly clicking
              <br />
              <span className="text-indigo-600">&ldquo;I Agree.&rdquo;</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Paste any Terms &amp; Conditions URL or text. FlagLink AI reads every clause, flags hidden traps, and tells you — in plain English — whether to sign or run.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/scanner"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]"
              >
                Start Scanning
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
              >
                How it works
              </Link>
            </div>

            {/* Trust info */}
            <p className="text-sm text-slate-500">
              Free forever · No credit card · Not legal advice
            </p>
          </div>
        </section>
      </main>

      {/* ─── Stats Row ─── */}
      <section id="features" className="px-6 py-16 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "< 10s", text: "Scan speed" },
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

      {/* ─── Features ─── */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Why FlagLink AI?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to read the fine print without hiring a lawyer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Analysis",
                desc: "Claude AI reads and understands every clause in any legal document, catching hidden traps you'd miss.",
              },
              {
                title: "Plain English Explanations",
                desc: "No legal jargon. We explain what each red flag means and why it matters to you.",
              },
              {
                title: "Instant Results",
                desc: "Get a risk score, severity breakdown, and actionable advice in under 10 seconds.",
              },
              {
                title: "10+ Red Flags Detected",
                desc: "From auto-renewal traps to forced arbitration, we catch the common tricks companies use.",
              },
              {
                title: "100% Private",
                desc: "Your scans are private. We never share or sell your data. All analysis is confidential.",
              },
              {
                title: "Free Forever",
                desc: "Basic scanning is always free. No credit card required, no hidden charges ever.",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl bg-white border border-slate-200 p-8 hover:border-indigo-200 transition-colors">
                <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">
            Stop guessing. Start knowing.
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Analyze any Terms & Conditions in seconds. Get instant insights on risks before you sign.
          </p>
          <Link
            href="/scanner"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-10 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]"
          >
            Scan a Document Now
          </Link>
        </div>
      </section>

      {/* ─── Trusted Brands ─── */}
      <section className="px-6 py-14 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-medium text-slate-400 tracking-widest uppercase mb-6">
            People use FlagLink to scan agreements from
          </p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 items-center">
            {["Spotify", "Netflix", "Adobe", "Dropbox", "Slack", "GitHub", "Figma", "OpenAI"].map((brand) => (
              <span key={brand} className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200 px-6 py-8 text-center bg-white">
        <p className="text-xs text-slate-400">
          Not legal advice. For informational purposes only. &copy; {new Date().getFullYear()} FlagLink AI
        </p>
      </footer>
    </div>
  );
}
