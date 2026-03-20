"use client";

import Link from "next/link";

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 h-14 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white text-xs font-bold">
              FL
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              FlagLink<span className="text-indigo-600"> AI</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              How it works
            </a>
          </div>

          {/* CTA */}
          <Link
            href="/?scan=true"
            className="rounded-lg border border-indigo-600 px-5 py-2 text-sm font-semibold text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white"
          >
            Start Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
