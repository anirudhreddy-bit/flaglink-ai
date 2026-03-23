"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function LandingNavbar() {
  const { data: session } = useSession();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 39,
        background: "#ffffff",
        borderBottom: "0.5px solid #e2e1db",
        height: 58,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
        <svg width="140" height="32" viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="#4f46e5"/>
          <rect x="6" y="8" width="16" height="2.2" rx="1.1" fill="white" opacity="0.35"/>
          <rect x="6" y="13" width="20" height="2.2" rx="1.1" fill="white"/>
          <rect x="6" y="18" width="11" height="2.2" rx="1.1" fill="white" opacity="0.35"/>
          <circle cx="22" cy="23" r="4" fill="#4f46e5" stroke="white" strokeWidth="1.8"/>
          <line x1="25" y1="26" x2="27.5" y2="28.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          <text x="40" y="22" fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
            fontSize="14" fontWeight="600" fill="currentColor" letterSpacing="-0.3">FlagLink</text>
          <text x="100" y="22" fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
            fontSize="14" fontWeight="700" fill="#4f46e5" letterSpacing="-0.3">AI</text>
        </svg>
      </Link>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {session?.user ? (
          <Link
            href="/account"
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                color: "#4f46e5",
                flexShrink: 0,
              }}
            >
              {(session.user.name || session.user.email || "FL")
                .split(" ")
                .map((w: string) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: "#444",
                fontWeight: 500,
              }}
            >
              {session.user.name?.split(" ")[0] || session.user.email}
            </span>
          </Link>
        ) : (
          <>
            <Link
              href="/auth/signin"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: "#555",
                textDecoration: "none",
                padding: "7px 16px",
                border: "0.5px solid #e2e1db",
                borderRadius: 50,
                transition: "border-color 0.15s",
              }}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#ffffff",
                textDecoration: "none",
                padding: "7px 18px",
                background: "#4f46e5",
                borderRadius: 50,
                transition: "background 0.15s",
              }}
            >
              Start Free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
