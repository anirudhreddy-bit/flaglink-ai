"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Hero from "@/components/landing/Hero";
import StatsRow from "@/components/landing/StatsRow";
import LogosBar from "@/components/landing/LogosBar";
import ScanSection from "@/components/landing/ScanSection";
import LandingFooter from "@/components/landing/LandingFooter";

function LandingInner() {
  const searchParams = useSearchParams();
  const showScan = searchParams.get("scan") === "true";

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col">
      <LandingNavbar />
      <main className="flex-1 flex flex-col">
        {showScan ? (
          <ScanSection />
        ) : (
          <>
            <Hero />
            <StatsRow />
            <LogosBar />
          </>
        )}
      </main>
      <LandingFooter />
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#ffffff]" />}>
      <LandingInner />
    </Suspense>
  );
}
