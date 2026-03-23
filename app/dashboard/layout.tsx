"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FlagLinkSidebar } from "@/components/ui/flaglink-sidebar";

const SIDEBAR_EXPANDED = 256;
const SIDEBAR_COLLAPSED = 64;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

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
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(v => !v)}
      />
      <motion.main
        animate={{ marginLeft: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        style={{ minHeight: "100vh" }}
      >
        {children}
      </motion.main>
    </div>
  );
}
