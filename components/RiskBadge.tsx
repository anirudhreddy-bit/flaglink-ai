"use client";

import { ScanResult } from "@/lib/types";

const colorMap = {
  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    label: "Low Risk",
  },
  yellow: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    label: "Medium Risk",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    label: "High Risk",
  },
};

export default function RiskBadge({
  riskLevel,
}: {
  riskLevel: ScanResult["riskLevel"];
}) {
  const c = colorMap[riskLevel];

  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-full border ${c.border} ${c.bg} px-5 py-2.5`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
      <span className={`text-sm font-bold uppercase tracking-wider ${c.text}`}>
        {c.label}
      </span>
    </div>
  );
}
