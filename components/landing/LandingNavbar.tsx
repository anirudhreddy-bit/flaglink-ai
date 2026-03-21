
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

function getInitials(value: string | undefined | null) {
  const cleaned = (value || "").trim();
  if (!cleaned) return "??";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? parts[1]?.[0] : cleaned[1] ?? "";
  return `${first}${second}`.toUpperCase() || "??";
}

export default function LandingNavbar() {
  const { data: session } = useSession();
  const userName =
    (session?.user as { name?: string | null } | undefined)?.name ??
    session?.user?.email ??
    "";
  const initials = getInitials(userName);

  const showName = (() => {
    const trimmed = userName.trim();
    if (!trimmed) return "Account";
    const firstToken = trimmed.split(/\s+/)[0];
    return firstToken;
  })();

  return (
    <nav
      className="w-full sticky top-0 z-50 bg-[#ffffff] border-b border-[#e2e8f0] backdrop-blur-[12px]"
      style={{ height: 56 }}
    >
      <div className="max-w-[1100px] mx-auto px-10 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-[8px]">
          <div
            style={{
              width: 28,
              height: 28,
              background: "#ef4444",
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <polygon points="8,5 19,12 8,19" fill="#ffffff" />
            </svg>
          </div>

          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: "-0.5px",
              lineHeight: 1,
            }}
          >
            <span style={{ color: "#0f172a" }}>FlagLink</span>
            <span style={{ color: "#6366f1" }}>AI</span>
          </div>
        </Link>

        <div className="flex items-center gap-[12px]">
          {!session?.user ? (
            <>
              <Link
                href="/auth/signin"
                style={{
                  background: "transparent",
                  color: "#475569",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: 100,
                  padding: "7px 18px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  textDecoration: "none",
                  transition: "transform 0.15s",
                }}
                aria-label="Sign In"
              >
                Sign In
              </Link>

              <Link
                href="/auth/signup"
                style={{
                  background: "#6366f1",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 100,
                  padding: "8px 22px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: "none",
                  transition: "transform 0.15s, background-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4f46e5";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#6366f1";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Start Free Today
              </Link>
            </>
          ) : (
            <Link
              href="/account"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
              }}
              aria-label="Go to your account"
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "#eef2ff",
                  color: "#6366f1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                {initials}
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  color: "#475569",
                }}
              >
                {showName}
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

