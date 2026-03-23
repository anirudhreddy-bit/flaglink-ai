import { FlagLinkSidebar } from "@/components/ui/flaglink-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
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
      <main style={{ marginLeft: 256, minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
