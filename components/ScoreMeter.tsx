"use client";

export default function ScoreMeter({ score }: { score: number }) {
  const riskPercentage = Math.min(100, Math.max(0, score));

  const getColor = (percentage: number) => {
    if (percentage <= 20) return "text-emerald-500";
    if (percentage <= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getBarColor = (percentage: number) => {
    if (percentage <= 20) return "bg-emerald-500";
    if (percentage <= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const getLabel = (percentage: number) => {
    if (percentage <= 20) return "Looks Safe";
    if (percentage <= 50) return "Proceed with Caution";
    return "High Risk — Be Careful";
  };

  return (
    <div className="w-full max-w-xs text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Risk Score
      </p>
      <p className={`text-5xl font-extrabold tabular-nums ${getColor(riskPercentage)}`}>
        {riskPercentage.toFixed(0)}%
      </p>
      <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(riskPercentage)}`}
          style={{ width: `${riskPercentage}%` }}
        />
      </div>
      <p className="text-sm font-medium text-slate-500 mt-3">
        {getLabel(riskPercentage)}
      </p>
    </div>
  );
}
