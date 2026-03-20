"use client";

import Link from "next/link";
import { useState } from "react";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "#blog" },
  ];

  return (
    <nav
      className="w-full sticky top-0 z-50 h-[60px] backdrop-blur-md flex justify-center"
      style={{
        background: "rgba(255, 255, 255, 0.92)",
        borderBottom: "1px solid var(--border)",
        animation: "slideDown 0.5s ease forwards",
      }}
    >
      <div className="w-full max-w-[1200px] px-6 md:px-10 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div
            className="flex items-center justify-center"
            style={{
              width: "26px",
              height: "26px",
              background: "var(--run)",
              borderRadius: "5px",
            }}
          >
            {/* Play triangle SVG */}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
              <polygon points="0,0 12,6 0,12" />
            </svg>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
            <span style={{ color: "var(--ink)" }}>FlagLink</span>
            <span style={{ color: "var(--accent)" }}>AI</span>
          </div>
        </Link>

        {/* Desktop Nav Links - hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="no-underline"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--muted)",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--ink)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--muted)";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          {/* Sign In */}
          <Link href="/auth/signin" className="btn-ghost hidden sm:inline-block">
            Sign In
          </Link>

          {/* Book Demo */}
          <Link
            href="mailto:hello@flaglink.ai"
            className="btn-ghost hidden sm:inline-block"
          >
            Book Demo
          </Link>

          {/* Start Free Today */}
          <Link href="/auth/signup" className="btn-primary">
            Start Free Today
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div
              style={{
                width: "20px",
                height: "2px",
                background: "var(--ink)",
              }}
            />
            <div
              style={{
                width: "20px",
                height: "2px",
                background: "var(--ink)",
              }}
            />
            <div
              style={{
                width: "20px",
                height: "2px",
                background: "var(--ink)",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute top-[60px] left-0 right-0 bg-white border-b"
          style={{
            borderBottomColor: "var(--border)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="no-underline text-sm"
              style={{
                color: "var(--muted)",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
