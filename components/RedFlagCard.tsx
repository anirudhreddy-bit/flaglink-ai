"use client";

import { RedFlag } from "@/lib/types";

const severityColors = {
  low: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
  medium: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
  },
  high: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
  },
};

export default function RedFlagCard({ flag }: { flag: RedFlag }) {
  const s = severityColors[flag.severity];

  return (
    <div
      className={`rounded-xl border ${s.border} ${s.bg} p-6 transition-all hover:shadow-sm`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${s.badge}`}
        >
          {flag.severity}
        </span>
      </div>
      <h3 className="mb-2 text-sm font-semibold text-slate-800 leading-snug">
        &ldquo;{flag.clause}&rdquo;
      </h3>
      <p className="text-sm leading-relaxed text-slate-500">
        {flag.explanation}
      </p>
    </div>
  );
}
