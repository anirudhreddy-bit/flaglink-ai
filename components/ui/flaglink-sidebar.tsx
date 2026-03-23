"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, History, Zap, CreditCard, Settings,
  HelpCircle, LogOut, User, ChevronDown, ChevronUp, ChevronLeft,
} from "lucide-react";

const NAVBAR_HEIGHT = 58;
const SIDEBAR_EXPANDED = 256;
const SIDEBAR_COLLAPSED = 64;

// ─── Types ───────────────────────────────────────────────────────────────────

interface ScanItem {
  id: string; domain: string; score: number; date: string;
}

export interface FlagLinkSidebarProps {
  user?: { name: string; email: string };
  scansUsed?: number;
  plan?: "free" | "pro";
  recentScans?: ScanItem[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// ─── Animated Hamburger (mobile) ─────────────────────────────────────────────

const AnimatedMenuToggle = ({ toggle, isOpen }: { toggle: () => void; isOpen: boolean }) => (
  <button onClick={toggle} aria-label="Toggle menu" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
    <motion.svg width="22" height="22" viewBox="0 0 24 24" initial="closed" animate={isOpen ? "open" : "closed"} transition={{ duration: 0.3 }}>
      <motion.path fill="transparent" strokeWidth="2.5" stroke="#374151" strokeLinecap="round"
        variants={{ closed: { d: "M 2 5 L 22 5" }, open: { d: "M 3 19 L 19 3" } }} />
      <motion.path fill="transparent" strokeWidth="2.5" stroke="#374151" strokeLinecap="round"
        variants={{ closed: { d: "M 2 12 L 22 12", opacity: 1 }, open: { opacity: 0 } }}
        transition={{ duration: 0.15 }} />
      <motion.path fill="transparent" strokeWidth="2.5" stroke="#374151" strokeLinecap="round"
        variants={{ closed: { d: "M 2 19 L 22 19" }, open: { d: "M 3 3 L 19 19" } }} />
    </motion.svg>
  </button>
);

// ─── Collapsible Section ─────────────────────────────────────────────────────

const CollapsibleSection = ({ title, children, hidden }: { title: string; children: React.ReactNode; hidden?: boolean }) => {
  const [open, setOpen] = useState(false);
  if (hidden) return null;
  return (
    <div style={{ marginBottom: 4 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 16px", borderRadius: 12, border: "none", background: "transparent",
        cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151",
      }}
        onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <span>{title}</span>
        {open ? <ChevronUp size={14} color="#9ca3af" /> : <ChevronDown size={14} color="#9ca3af" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}>
            <div style={{ padding: "4px 8px 8px" }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Label (fades in/out with collapse) ──────────────────────────────────────

const Label = ({ children, collapsed }: { children: React.ReactNode; collapsed?: boolean }) => (
  <AnimatePresence initial={false}>
    {!collapsed && (
      <motion.span
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "auto" }}
        exit={{ opacity: 0, width: 0 }}
        transition={{ duration: 0.2 }}
        style={{ overflow: "hidden", whiteSpace: "nowrap", display: "block" }}
      >
        {children}
      </motion.span>
    )}
  </AnimatePresence>
);

// ─── Sidebar Content ─────────────────────────────────────────────────────────

const SidebarContent = ({
  user, scansUsed = 0, plan = "free", recentScans = [],
  collapsed = false, onToggleCollapse,
}: FlagLinkSidebarProps) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#ffffff", overflow: "hidden" }}>

    {/* ── Profile ── */}
    <div style={{ padding: collapsed ? "16px 12px" : 16, borderBottom: "1px solid #f3f4f6", transition: "padding 0.25s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: collapsed ? 0 : 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", background: "#e0e7ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <User size={18} color="#4f46e5" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              style={{ minWidth: 0, overflow: "hidden" }}
            >
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: "nowrap" }}>
                {user?.name ?? "Guest"}
              </p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, whiteSpace: "nowrap" }}>
                {user?.email ?? "Not signed in"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Usage bar — hidden when collapsed */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden", marginTop: 12 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7280", marginBottom: 4 }}>
              <span>Free scans used</span>
              <span style={{ fontWeight: 600 }}>{scansUsed} / 3</span>
            </div>
            <div style={{ width: "100%", background: "#f3f4f6", borderRadius: 99, height: 6 }}>
              <div style={{
                height: 6, borderRadius: 99, transition: "width 0.5s",
                width: `${Math.min((scansUsed / 3) * 100, 100)}%`,
                backgroundColor: scansUsed >= 3 ? "#ef4444" : scansUsed >= 2 ? "#f59e0b" : "#4f46e5",
              }} />
            </div>
            {scansUsed >= 3 && (
              <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4, fontWeight: 500 }}>
                Limit reached — upgrade for unlimited
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* ── Collapse toggle ── */}
    <button onClick={onToggleCollapse} style={{
      width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "8px 0", borderBottom: "1px solid #f3f4f6", border: "none",
      borderTop: "none", borderLeft: "none", borderRight: "none",
      borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "#f3f4f6",
      background: "transparent", cursor: "pointer",
    }}
      onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
        <ChevronLeft size={16} color="#9ca3af" />
      </motion.div>
    </button>

    {/* ── Nav ── */}
    <nav style={{ flex: 1, padding: 12, overflowY: "auto", overflowX: "hidden" }}>

      {/* New Scan */}
      <a href="/" style={{ display: "block", marginBottom: 4, textDecoration: "none" }}>
        <button style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%",
          fontSize: 13, fontWeight: 600,
          padding: collapsed ? "8px 0" : "8px 16px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: 12, background: "#4f46e5", color: "#ffffff",
          border: "none", cursor: "pointer", transition: "padding 0.25s",
        }}>
          <Zap size={16} style={{ flexShrink: 0 }} />
          <Label collapsed={collapsed}>New Scan</Label>
        </button>
      </a>

      <div style={{ margin: "10px 0", borderTop: "1px solid #f3f4f6" }} />

      {[
        { icon: Home,       label: "Dashboard",    href: "/dashboard" },
        { icon: History,    label: "Scan History", href: "/history"   },
        { icon: CreditCard, label: "Subscription", href: "/pricing"   },
        { icon: Settings,   label: "Settings",     href: "/settings"  },
      ].map(({ icon: Icon, label, href }) => (
        <a href={href} key={label} style={{ display: "block", marginBottom: 2, textDecoration: "none" }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            fontSize: 13, fontWeight: 500,
            padding: collapsed ? "8px 0" : "8px 16px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: 12, background: "transparent", color: "#374151",
            border: "none", cursor: "pointer", transition: "padding 0.25s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <Icon size={16} color="#6b7280" style={{ flexShrink: 0 }} />
            <Label collapsed={collapsed}>{label}</Label>
          </button>
        </a>
      ))}

      <div style={{ margin: "10px 0", borderTop: "1px solid #f3f4f6" }} />

      {/* Collapsibles — hidden when sidebar is collapsed */}
      <CollapsibleSection title="Recent Scans" hidden={collapsed}>
        {recentScans.length === 0 ? (
          <p style={{ fontSize: 11, color: "#9ca3af", padding: "4px 8px" }}>No scans yet</p>
        ) : (
          recentScans.slice(0, 3).map(scan => (
            <a key={scan.id} href={`/report/${scan.id}`} style={{ display: "block", textDecoration: "none" }}>
              <div style={{ padding: 8, borderRadius: 12, cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <p style={{ fontSize: 12, fontWeight: 600, color: "#1f2937", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {scan.domain}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: scan.score >= 70 ? "#ef4444" : scan.score >= 40 ? "#f59e0b" : "#22c55e" }}>
                    Risk: {scan.score}/100
                  </span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{scan.date}</span>
                </div>
              </div>
            </a>
          ))
        )}
        <a href="/history" style={{ display: "block", fontSize: 11, color: "#4f46e5", padding: "8px 8px 0", fontWeight: 500 }}>
          View all scans →
        </a>
      </CollapsibleSection>

      <CollapsibleSection title="My Plan" hidden={collapsed}>
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
              <a href="/pricing" style={{ textDecoration: "none" }}>
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
      <a href="/help" style={{ textDecoration: "none" }}>
        <button style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%",
          fontSize: 13, fontWeight: 500,
          padding: collapsed ? "8px 0" : "8px 16px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: 12, background: "transparent", color: "#4b5563",
          border: "none", cursor: "pointer", transition: "padding 0.25s",
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "#f3f4f6")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <HelpCircle size={16} color="#9ca3af" style={{ flexShrink: 0 }} />
          <Label collapsed={collapsed}>Help &amp; Support</Label>
        </button>
      </a>
      <button style={{
        display: "flex", alignItems: "center", gap: 8, width: "100%",
        fontSize: 13, fontWeight: 500,
        padding: collapsed ? "8px 0" : "8px 16px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 12, background: "transparent", color: "#ef4444",
        border: "none", cursor: "pointer", transition: "padding 0.25s",
      }}
        onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        onClick={() => console.log("sign out")} // TODO: wire to signOut()
      >
        <LogOut size={16} style={{ flexShrink: 0 }} />
        <Label collapsed={collapsed}>Sign out</Label>
      </button>
    </div>
  </div>
);

// ─── Main Export ─────────────────────────────────────────────────────────────

export function FlagLinkSidebar(props: FlagLinkSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed = false, onToggleCollapse } = props;

  return (
    <>
      {/* ── Desktop sidebar — starts below navbar ── */}
      <motion.aside
        animate={{ width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        style={{
          position: "fixed",
          top: NAVBAR_HEIGHT,
          left: 0,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          background: "#ffffff",
          borderRight: "1px solid #f3f4f6",
          boxShadow: "1px 0 4px rgba(0,0,0,0.04)",
          zIndex: 40,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SidebarContent {...props} collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      </motion.aside>

      {/* ── Mobile toggle button ── */}
      <div style={{ position: "fixed", top: 14, right: 16, zIndex: 50 }}>
        <AnimatedMenuToggle isOpen={mobileOpen} toggle={() => setMobileOpen(v => !v)} />
      </div>

      {/* ── Mobile slide-in ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              style={{ position: "fixed", inset: 0, zIndex: 45, background: "rgba(0,0,0,0.35)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              style={{ position: "fixed", top: 0, left: 0, height: "100vh", width: 280, zIndex: 50, boxShadow: "4px 0 24px rgba(0,0,0,0.12)" }}
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <SidebarContent {...props} collapsed={false} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
