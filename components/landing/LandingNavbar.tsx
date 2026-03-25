"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LandingNavbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#ffffff",
        borderBottom: "0.5px solid #e2e1db",
        height: 58,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 6%",
      }}
    >
      {/* Logo */}
      <a href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
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
      </a>

      {/* Auth buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {status === "loading" ? null : session?.user ? (
          // Logged in — show Dashboard + Sign Out
          <>
            <button
              onClick={() => router.push("/scan")}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13, fontWeight: 600,
                color: "#4f46e5", cursor: "pointer",
                padding: "7px 18px", border: "1.5px solid #4f46e5",
                borderRadius: 50, background: "transparent",
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13, fontWeight: 600,
                color: "#ffffff", cursor: "pointer",
                padding: "7px 18px", border: "none",
                borderRadius: 50, background: "#4f46e5",
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          // Logged out — show Sign In
          <button
            onClick={() => router.push("/auth/signin")}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13, fontWeight: 600,
              color: "#ffffff", cursor: "pointer",
              padding: "7px 18px", border: "none",
              borderRadius: 50, background: "#4f46e5",
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
