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
      <Link
        href="/"
        style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            background: "#4f46e5",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="8,5 19,12 8,19" fill="#ffffff" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "-0.3px",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#0f172a" }}>FlagLink</span>
          <span style={{ color: "#4f46e5" }}>AI</span>
        </span>
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
