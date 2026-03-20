"use client";

import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer
      className="w-full"
      style={{
        background: "var(--ink)",
        borderTop: "1px solid #1a2238",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      <div className="max-w-7xl mx-auto px-0 py-12">
        {/* Top section */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10"
          style={{ marginBottom: "40px" }}
        >
          {/* Col 1 — Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  background: "var(--run)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="white">
                  <polygon points="0,0 12,6 0,12" />
                </svg>
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "white" }}>FlagLink</span>
                <span style={{ color: "var(--accent)" }}>AI</span>
              </div>
            </div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 300,
                color: "#3a4a6a",
                lineHeight: 1.7,
                maxWidth: "240px",
                margin: 0,
              }}
            >
              Understand Terms & Conditions before you commit. Powered by Claude
              AI.
            </p>
          </div>

          {/* Col 2 — Product */}
          <div>
            <h4
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                color: "#eef2ff",
                marginBottom: "14px",
              }}
            >
              Product
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Features", "Pricing", "Sample Report", "Browser Extension"].map(
                (link) => (
                  <Link
                    key={link}
                    href={link === "Features" ? "#features" : "#"}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      color: "#3a4a6a",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#6b7fa8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#3a4a6a";
                    }}
                  >
                    {link}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Col 3 — Resources */}
          <div>
            <h4
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                color: "#eef2ff",
                marginBottom: "14px",
              }}
            >
              Resources
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Blog", "FAQ", "Help Center"].map((link) => (
                <Link
                  key={link}
                  href="#"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "#3a4a6a",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#6b7fa8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#3a4a6a";
                  }}
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 4 — Company */}
          <div>
            <h4
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                color: "#eef2ff",
                marginBottom: "14px",
              }}
            >
              Company
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["About", "Contact"].map((link) => (
                <Link
                  key={link}
                  href="#"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "#3a4a6a",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#6b7fa8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#3a4a6a";
                  }}
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 5 — Legal */}
          <div>
            <h4
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                color: "#eef2ff",
                marginBottom: "14px",
              }}
            >
              Legal
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Privacy Policy", "Terms", "Cookies"].map((link) => (
                <Link
                  key={link}
                  href="#"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "#3a4a6a",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#6b7fa8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#3a4a6a";
                  }}
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid #1a2238",
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              color: "#1e2c45",
              margin: 0,
            }}
          >
            © 2026 FlagLink AI. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 300,
              color: "#1e2c45",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            Not legal advice. For informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
