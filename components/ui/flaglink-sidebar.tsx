"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  History,
  Zap,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────
interface ScanItem {
  id: string;
  domain: string;
  score: number;
  date: string;
  // full data for navigation to results page
  riskLevel?: string;
  redFlags?: unknown;
  advice?: unknown;
}

interface FlagLinkSidebarProps {
  user?: { name: string; email: string };
  scansUsed?: number;
  plan?: "free" | "pro";
  recentScans?: ScanItem[];
  collapsible?: boolean; // pop-out mode — hidden by default, toggled open
}

// ─── Animated Hamburger Toggle ───────────
const AnimatedMenuToggle = ({
  toggle,
  isOpen,
}: {
  toggle: () => void;
  isOpen: boolean;
}) => (
  <button onClick={toggle} aria-label="Toggle menu" className="focus:outline-none">
    <motion.svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      transition={{ duration: 0.3 }}
      className="text-gray-800"
    >
      <motion.path
        fill="transparent"
        strokeWidth="2.5"
        stroke="currentColor"
        strokeLinecap="round"
        variants={{
          closed: { d: "M 2 5 L 22 5" },
          open: { d: "M 3 19 L 19 3" },
        }}
      />
      <motion.path
        fill="transparent"
        strokeWidth="2.5"
        stroke="currentColor"
        strokeLinecap="round"
        variants={{
          closed: { d: "M 2 12 L 22 12", opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.15 }}
      />
      <motion.path
        fill="transparent"
        strokeWidth="2.5"
        stroke="currentColor"
        strokeLinecap="round"
        variants={{
          closed: { d: "M 2 19 L 22 19" },
          open: { d: "M 3 3 L 19 19" },
        }}
      />
    </motion.svg>
  </button>
);

// ─── Collapsible Section ─────────────────
const CollapsibleSection = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-2">
      <button
        className="w-full flex items-center justify-between py-2 px-4 rounded-xl hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        {open
          ? <ChevronUp className="h-4 w-4 text-gray-400" />
          : <ChevronDown className="h-4 w-4 text-gray-400" />
        }
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function formatScanDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Sidebar Content (shared mobile+desktop) ─
const SidebarContent = ({
  scansUsed = 0,
  plan = "free",
  recentScans: propScans = [],
}: FlagLinkSidebarProps) => {
  const [liveScans, setLiveScans] = useState<ScanItem[]>(propScans);
  const router = useRouter();
  const { data: session } = useSession();

  // Use real session data — fall back gracefully while loading
  const userName  = session?.user?.name  ?? session?.user?.email?.split("@")[0] ?? "Guest";
  const userEmail = session?.user?.email ?? "";

  useEffect(() => {
    fetch("/api/account/history")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!Array.isArray(data)) return;
        const mapped: ScanItem[] = data.slice(0, 3).map((s: {
          id: string; website?: string; input?: string; score: number;
          createdAt: string; riskLevel?: string; redFlags?: unknown; advice?: unknown;
        }) => ({
          id: s.id,
          domain: s.website || (s.input?.startsWith("http")
            ? (() => { try { return new URL(s.input!).hostname.replace("www.", ""); } catch { return s.input?.slice(0, 24) || "Unknown"; } })()
            : s.input?.slice(0, 24) || "Unknown"),
          score: s.score,
          date: formatScanDate(s.createdAt),
          riskLevel: s.riskLevel,
          redFlags: s.redFlags,
          advice: s.advice,
        }));
        setLiveScans(mapped);
      })
      .catch(() => {});
  }, []);

  const recentScans = liveScans;
  return (
  <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#ffffff", color: "#000000" }}>

    {/* ── Profile + Scan Usage ── */}
    <div style={{ padding: 16, borderBottom: "1px solid #f3f4f6" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", background: "#e0e7ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <User className="h-5 w-5 text-indigo-600" />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {userName}
          </p>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {userEmail || "Not signed in"}
          </p>
        </div>
      </div>

      {/* Scan usage progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7280", marginBottom: 4 }}>
          <span>Free scans used</span>
          <span style={{ fontWeight: 600 }}>{scansUsed} / 3</span>
        </div>
        <div style={{ width: "100%", background: "#f3f4f6", borderRadius: 99, height: 6 }}>
          <div
            style={{
              height: 6,
              borderRadius: 99,
              transition: "width 0.5s",
              width: `${Math.min((scansUsed / 3) * 100, 100)}%`,
              backgroundColor:
                scansUsed >= 3 ? "#ef4444" : scansUsed >= 2 ? "#f59e0b" : "#4f46e5",
            }}
          />
        </div>
        {scansUsed >= 3 && (
          <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4, fontWeight: 500 }}>
            Limit reached — upgrade for unlimited
          </p>
        )}
      </div>
    </div>

    {/* ── Navigation ── */}
    <nav style={{ flex: 1, padding: 12, overflowY: "auto" }}>

      {/* New Scan — highlighted */}
      <a href="/" style={{ display: "block", marginBottom: 4, textDecoration: "none" }}>
        <button style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%",
          fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 12,
          background: "#4f46e5", color: "#ffffff", border: "none", cursor: "pointer",
        }}>
          <Zap className="h-4 w-4" />
          New Scan
        </button>
      </a>

      <div style={{ margin: "12px 0", borderTop: "1px solid #f3f4f6" }} />

      {/* Regular nav links */}
      {[
        { icon: Home,       label: "Dashboard",    href: "/scan" },
        { icon: History,    label: "Scan History", href: "/history"   },
        { icon: CreditCard, label: "Subscription", href: "/pricing"   },
        { icon: Settings,   label: "Settings",     href: "/settings"  },
      ].map(({ icon: Icon, label, href }) => (
        <a href={href} key={label} style={{ display: "block", marginBottom: 2, textDecoration: "none" }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            fontSize: 13, fontWeight: 500, padding: "8px 16px", borderRadius: 12,
            background: "transparent", color: "#374151", border: "none", cursor: "pointer",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <Icon className="h-4 w-4 text-gray-500" />
            {label}
          </button>
        </a>
      ))}

      <div style={{ margin: "12px 0", borderTop: "1px solid #f3f4f6" }} />

      {/* ── My Plan collapsible ── */}
      <CollapsibleSection title="My Plan">
        <div style={{ padding: "4px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1f2937" }}>
              {plan === "pro" ? "Pro Plan" : "Free Plan"}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
              background: plan === "pro" ? "#ede9fe" : "#f3f4f6",
              color: plan === "pro" ? "#4f46e5" : "#6b7280",
            }}>
              {plan === "pro" ? "Active" : "Limited"}
            </span>
          </div>
          {plan === "free" && (
            <>
              <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 10, lineHeight: 1.6 }}>
                3 scans / month · Basic red flags only
              </p>
              <a href="/pricing" style={{ display: "block", textDecoration: "none" }}>
                <button style={{
                  width: "100%", fontSize: 12, fontWeight: 600, padding: "8px 0",
                  borderRadius: 12, background: "#4f46e5", color: "#ffffff",
                  border: "none", cursor: "pointer",
                }}>
                  Upgrade to Pro →
                </button>
              </a>
            </>
          )}
          {plan === "pro" && (
            <p style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6 }}>
              Unlimited scans · Deep analysis · Priority support
            </p>
          )}
        </div>
      </CollapsibleSection>
    </nav>

    {/* ── Footer ── */}
    <div style={{ padding: 12, borderTop: "1px solid #f3f4f6", display: "flex", flexDirection: "column", gap: 4 }}>
      <a href="/help" style={{ display: "block", textDecoration: "none" }}>
        <button style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%",
          fontSize: 13, fontWeight: 500, padding: "8px 16px", borderRadius: 12,
          background: "transparent", color: "#4b5563", border: "none", cursor: "pointer",
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <HelpCircle className="h-4 w-4 text-gray-400" />
          Help &amp; Support
        </button>
      </a>
      <button
        style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%",
          fontSize: 13, fontWeight: 500, padding: "8px 16px", borderRadius: 12,
          background: "transparent", color: "#ef4444", border: "none", cursor: "pointer",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  </div>
  );
};

// ─── Main Export ─────────────────────────
export function FlagLinkSidebar({ collapsible = false, ...props }: FlagLinkSidebarProps) {
  const [open, setOpen] = useState(false);

  // ── COLLAPSIBLE (pop-out) mode ──────────────────────────────────────────
  if (collapsible) {
    return (
      <>
        {/* Toggle button — always visible in top-left */}
        <button
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
          style={{
            position: "fixed", top: 16, left: 16, zIndex: 60,
            width: 40, height: 40, borderRadius: 10,
            background: open ? "#4f46e5" : "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "background 0.2s",
          }}
        >
          <motion.svg
            width="18" height="18" viewBox="0 0 24 24"
            initial="closed" animate={open ? "open" : "closed"}
            transition={{ duration: 0.25 }}
          >
            <motion.path fill="transparent" strokeWidth="2.5"
              stroke={open ? "#ffffff" : "#374151"} strokeLinecap="round"
              variants={{ closed: { d: "M 2 5 L 22 5" }, open: { d: "M 3 19 L 19 3" } }}
            />
            <motion.path fill="transparent" strokeWidth="2.5"
              stroke={open ? "#ffffff" : "#374151"} strokeLinecap="round"
              variants={{ closed: { d: "M 2 12 L 22 12", opacity: 1 }, open: { opacity: 0 } }}
              transition={{ duration: 0.15 }}
            />
            <motion.path fill="transparent" strokeWidth="2.5"
              stroke={open ? "#ffffff" : "#374151"} strokeLinecap="round"
              variants={{ closed: { d: "M 2 19 L 22 19" }, open: { d: "M 3 3 L 19 19" } }}
            />
          </motion.svg>
        </button>

        {/* Dark overlay */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="overlay"
              style={{ position: "fixed", inset: 0, zIndex: 45, background: "rgba(0,0,0,0.35)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Slide-in sidebar */}
        <AnimatePresence>
          {open && (
            <motion.aside
              key="sidebar"
              style={{
                position: "fixed", top: 0, left: 0, height: "100vh", width: 272,
                background: "#ffffff", borderRight: "1px solid #e5e7eb",
                boxShadow: "4px 0 32px rgba(0,0,0,0.12)",
                zIndex: 50, display: "flex", flexDirection: "column",
                overflowY: "auto",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <SidebarContent {...props} />
            </motion.aside>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ── ALWAYS-VISIBLE (default) mode ───────────────────────────────────────
  return (
    <>
      <aside style={{
        position: "fixed", top: 0, left: 0, height: "100vh", width: 256,
        borderRight: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        zIndex: 40, display: "flex", flexDirection: "column", overflowY: "auto",
      }}>
        <SidebarContent {...props} />
      </aside>

      {/* Mobile slide-in */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.4)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              style={{ position: "fixed", top: 0, left: 0, height: "100vh", width: 288, zIndex: 50, boxShadow: "4px 0 24px rgba(0,0,0,0.12)" }}
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <SidebarContent {...props} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
