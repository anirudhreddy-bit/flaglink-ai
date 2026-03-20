"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-6 pt-28 pb-24 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Paste any URL. Get red flags instantly.
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
          <span className="text-slate-400 italic font-normal text-3xl sm:text-4xl lg:text-5xl block mb-2">
            I was about to
          </span>
          <span className="line-through decoration-red-400 decoration-3">sign that.</span>
          <br />
          <span className="text-slate-900">FlagLink</span>
          <span className="text-indigo-600"> sees it.</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Paste any Terms &amp; Conditions link. Get instant red flags in plain
          English — before you click &ldquo;I Agree&rdquo;.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/?scan=true"
            className="rounded-lg bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
          >
            Scan for Red Flags
          </Link>
          <a
            href="#features"
            className="rounded-lg border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            See a sample report
          </a>
        </div>

        <p className="text-xs text-slate-400">
          No signup needed · 3 free scans · Not legal advice
        </p>

        {/* Stats Row */}
        <div className="mt-16 mx-auto max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
          {[
            { value: "< 2s", label: "Scan Speed" },
            { value: "10+", label: "Flag Types" },
            { value: "100%", label: "Plain English" },
            { value: "Free", label: "To Start" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white py-6 px-4 text-center">
              <div className="text-2xl font-extrabold text-indigo-600 mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
