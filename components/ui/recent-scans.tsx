"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface ScanItem {
  id: string;
  domain: string;
  score: number;
  verdict: string;
  flags: number;
  time: string;
  icon: string;
  color: "red" | "amber" | "green";
}

interface RecentScansProps {
  scans?: ScanItem[];
  isLoading?: boolean;
  /** When set, each row opens the saved report (dashboard recent list). */
  onScanClick?: (scanId: string) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const scoreColor = (color: string) => {
  if (color === "red")   return "#ef4444";
  if (color === "amber") return "#f59e0b";
  return "#22c55e";
};
const scoreBg = (color: string) => {
  if (color === "red")   return "#fef2f2";
  if (color === "amber") return "#fffbeb";
  return "#f0fdf4";
};
const trackColor = (color: string) => {
  if (color === "red")   return "#fecaca";
  if (color === "amber") return "#fde68a";
  return "#bbf7d0";
};

const CIRC = 2 * Math.PI * 13; // smaller ring radius

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div
    className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 grid gap-2 animate-pulse"
    style={{ gridTemplateColumns: "32px 1fr 36px" }}
  >
    <div className="w-8 h-8 rounded-lg bg-gray-100" />
    <div className="flex flex-col gap-1.5 justify-center">
      <div className="h-2.5 bg-gray-100 rounded-full w-3/5" />
      <div className="h-2 bg-gray-100 rounded-full w-2/5" />
    </div>
    <div className="w-9 h-9 rounded-full bg-gray-100" />
  </div>
);

// ─── Score Ring (compact) ─────────────────────────────────────────────────────
const ScoreRing = ({ score, color, animate }: { score: number; color: string; animate: boolean }) => {
  const offset = animate ? CIRC - (score / 100) * CIRC : CIRC;
  return (
    <div className="relative w-9 h-9 flex-shrink-0">
      <svg width="36" height="36" viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="18" cy="18" r="13" fill="none" stroke={trackColor(color)} strokeWidth="2.5" />
        <circle
          cx="18" cy="18" r="13" fill="none"
          stroke={scoreColor(color)} strokeWidth="2.5"
          strokeLinecap="round" strokeDasharray={CIRC}
          style={{
            strokeDashoffset: offset,
            transition: animate ? "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" : "none",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
        style={{ color: scoreColor(color) }}>
        {score}
      </div>
    </div>
  );
};

// ─── Single Scan Card (compact) ───────────────────────────────────────────────
const ScanCard = ({
  scan,
  index,
  onOpen,
}: {
  scan: ScanItem;
  index: number;
  onOpen?: (id: string) => void;
}) => {
  const [animateRing, setAnimateRing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimateRing(true), index * 60 + 250);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <motion.div
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen ? () => onOpen(scan.id) : undefined}
      onKeyDown={
        onOpen
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen(scan.id);
              }
            }
          : undefined
      }
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, type: "spring", stiffness: 280, damping: 22 }}
      whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
      whileTap={{ scale: 0.99 }}
      className={`relative flex items-center p-3.5 mb-3 bg-white border border-gray-100 rounded-2xl overflow-hidden group ${
        onOpen ? "cursor-pointer" : ""
      }`}
      style={{ borderLeft: `4px solid ${scoreColor(scan.color)}` }}
    >
      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex items-center w-full gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: scoreBg(scan.color), color: scoreColor(scan.color) }}
        >
          {scan.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 py-0.5">
          <p className="text-sm font-semibold text-gray-900 truncate leading-tight mb-1">
            {scan.domain}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <span>{scan.time}</span>
            <span className="text-gray-300">•</span>
            <span style={{ color: scoreColor(scan.color) }}>
              {scan.flags} flag{scan.flags !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Score Ring */}
        <div className="flex-shrink-0">
          <ScoreRing score={scan.score} color={scan.color} animate={animateRing} />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function RecentScans({ scans, isLoading = false, onScanClick }: RecentScansProps) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showCards,    setShowCards]    = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const t1 = setTimeout(() => setShowSkeleton(false), 300);
      const t2 = setTimeout(() => setShowCards(true),     400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isLoading]);

  const data = scans ?? [];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-gray-900">Recent Scans</h3>
        <Link href="/history" className="text-[10px] text-indigo-600 font-medium hover:underline">
          View all →
        </Link>
      </div>

      {/* Skeleton */}
      <AnimatePresence>
        {(isLoading || showSkeleton) && (
          <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex flex-col gap-1.5">
            {[1, 2].map((i) => <SkeletonCard key={i} />)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable card list */}
      {showCards && !isLoading && (
        <div
          className="flex flex-col gap-1.5 overflow-y-auto pr-0.5"
          style={{
            maxHeight: 260,
            scrollbarWidth: "thin",
            scrollbarColor: "#e5e7eb transparent",
          }}
        >
          {data.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">Your scan history will appear here.</p>
          ) : (
            data.map((scan, index) => (
              <ScanCard key={scan.id} scan={scan} index={index} onOpen={onScanClick} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
