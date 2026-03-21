import LandingNavbar from "@/components/landing/LandingNavbar";
import Hero from "@/components/landing/Hero";
import StatsRow from "@/components/landing/StatsRow";
import HowItWorks from "@/components/landing/HowItWorks";
import ScanSection from "@/components/landing/ScanSection";
import LogosBar from "@/components/landing/LogosBar";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Page({
  searchParams,
}: {
  searchParams: { scan?: string | string[] | undefined };
}) {
  const scanParam = searchParams?.scan;
  const scanEnabled = scanParam === "true" || (Array.isArray(scanParam) && scanParam.includes("true"));

  return (
    <div>
      <LandingNavbar />
      {scanEnabled ? (
        <ScanSection />
      ) : (
        <>
          <Hero />
          <StatsRow />
          <HowItWorks />
          <ScanSection />
          <LogosBar />
        </>
      )}
      <LandingFooter />
    </div>
  );
}
