import LandingNavbar from "@/components/landing/LandingNavbar";
import Hero from "@/components/landing/Hero";
import StatsRow from "@/components/landing/StatsRow";
import LogosBar from "@/components/landing/LogosBar";
import LandingFooter from "@/components/landing/LandingFooter";
import { FlagLinkSidebar } from "@/components/ui/flaglink-sidebar";

export default function Page() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f4f0" }}>
      {/* Sidebar */}
      <FlagLinkSidebar
        user={{ name: "flaglinkai", email: "user@example.com" }}
        scansUsed={2}
        plan="free"
        recentScans={[
          { id: "1", domain: "spotify.com", score: 72, date: "Today"     },
          { id: "2", domain: "netflix.com", score: 45, date: "Yesterday" },
          { id: "3", domain: "adobe.com",   score: 81, date: "Mar 20"    },
        ]}
      />

      {/* Main content pushed right of sidebar */}
      <div style={{ marginLeft: 256, flex: 1, display: "flex", flexDirection: "column" }}>
        <LandingNavbar />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Hero />
          <StatsRow />
          <LogosBar />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
