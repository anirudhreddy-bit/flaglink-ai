"use client";

import { useSearchParams } from "next/navigation";
import LandingNavbar from "@/components/LandingNavbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import LandingFooter from "@/components/LandingFooter";
import HomePage from "@/components/HomePage";

export default function LandingContent() {
  const searchParams = useSearchParams();
  const showScan = searchParams.get("scan") === "true";

  if (showScan) {
    return <HomePage />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <LandingFooter />
    </div>
  );
}
