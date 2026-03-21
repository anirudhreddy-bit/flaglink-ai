"use client";

import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ─── Header ─── */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 py-5 sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ← Back
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-black">
                FL
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                FlagLink
                <span className="text-indigo-600"> AI</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-4xl">
          {/* Title */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
              How It Works
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              FlagLink AI uses advanced natural language processing to analyze Terms & Conditions and identify hidden risks before you agree.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg">
                1
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Paste or Link
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Provide a URL to a Terms & Conditions page or paste the text directly. FlagLink AI handles both formats instantly.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg">
                2
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  AI Analysis
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Our AI scans for 10+ categories of red flags including auto-renewal traps, forced arbitration, data selling, and more. Analysis completes in under 10 seconds.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg">
                3
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Get Results
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Receive a detailed risk score (0-100), a color-coded risk level (Green/Yellow/Red), specific red flags, and actionable advice.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6 items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg">
                4
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Decide Safely
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Make informed decisions about whether to agree to a contract. Your scan history is private and never shared.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-indigo-600 text-white text-lg font-semibold transition-all hover:bg-indigo-700 shadow-md"
            >
              Start Scanning Now
            </Link>
          </div>

          {/* Red Flags Explained */}
          <div className="mt-20 pt-16 border-t border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
              The Red Flags We Look For
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Auto-Renewal Traps",
                  desc: "Automatic charges and hidden cancellation terms"
                },
                {
                  title: "Forced Arbitration",
                  desc: "Waiving your right to sue in court"
                },
                {
                  title: "Data Selling",
                  desc: "Sharing or selling your personal data"
                },
                {
                  title: "IP Grabs",
                  desc: "Company claiming rights to your content"
                },
                {
                  title: "Unilateral Changes",
                  desc: "Company can change terms without consent"
                },
                {
                  title: "Behavior Logging",
                  desc: "Monitoring your activity without clear consent"
                },
                {
                  title: "Asymmetric Liability",
                  desc: "Company not liable but you are"
                },
                {
                  title: "One-Sided Termination",
                  desc: "Company can terminate without cause"
                },
              ].map((flag, i) => (
                <div
                  key={i}
                  className="p-6 rounded-lg bg-white border border-slate-200 hover:border-indigo-200 transition-colors"
                >
                  <h3 className="font-semibold text-slate-900 mb-2">{flag.title}</h3>
                  <p className="text-sm text-slate-600">{flag.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
