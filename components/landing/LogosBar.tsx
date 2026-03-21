"use client";

const BRANDS = [
  "Spotify",
  "Netflix",
  "Adobe",
  "Dropbox",
  "Slack",
  "GitHub",
  "Figma",
  "OpenAI",
];

export default function LogosBar() {
  return (
    <section
      className="w-full bg-[#ffffff] border-t border-[#e2e8f0]"
      style={{ padding: "28px 40px" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: "#cbd5e1",
            letterSpacing: "2px",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          TRUSTED BY PEOPLE SIGNING UP FOR
        </div>

        <div
          style={{
            display: "flex",
            gap: 32,
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {BRANDS.map((brand) => (
            <a
              key={brand}
              href="#"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                color: "#cbd5e1",
                letterSpacing: "0.3px",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#94a3b8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#cbd5e1";
              }}
            >
              {brand}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

