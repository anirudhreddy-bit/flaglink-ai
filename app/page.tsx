import LandingNavbar from "@/components/landing/LandingNavbar";
import Hero from "@/components/landing/Hero";
import StatsRow from "@/components/landing/StatsRow";
import LogosBar from "@/components/landing/LogosBar";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5f4f0" }}>
      <LandingNavbar />
      <main className="flex flex-col">
        <Hero />
        <StatsRow />
        <LogosBar />
      </main>
      <LandingFooter />
    </div>
  );
}
