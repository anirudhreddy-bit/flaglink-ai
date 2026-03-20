"use client";

import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo + Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white text-xs font-bold">
                FL
              </div>
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                FlagLink<span className="text-indigo-600"> AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Understand Terms &amp; Conditions before you commit. Scan for hidden risks with AI-powered analysis.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Product</h3>
            <nav className="space-y-2 flex flex-col">
              <a href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">How it works</a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Legal</h3>
            <nav className="space-y-2 flex flex-col">
              <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Contact</a>
            </nav>
          </div>
        </div>

        <div className="h-px bg-slate-200 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            Not legal advice. For informational purposes only. &copy; {new Date().getFullYear()} FlagLink AI
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Powered by</span>
            <span className="font-semibold text-indigo-600">Claude AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
