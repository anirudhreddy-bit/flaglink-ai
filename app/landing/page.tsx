"use client";

import { Suspense } from "react";
import LandingContent from "@/components/LandingContent";

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LandingContent />
    </Suspense>
  );
}
