"use client";

export default function LogosBar() {
  const brands = [
    "Spotify",
    "Netflix",
    "Adobe",
    "Dropbox",
    "Slack",
    "GitHub",
    "Figma",
    "OpenAI",
  ];

  return (
    <>
      {/* Label */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          color: "var(--soft)",
          letterSpacing: "2px",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: "28px",
        }}
      >
        Trusted by people signing up for
      </div>

      {/* Pills row */}
      <div
        style={{
          display: "flex",
          gap: "48px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {brands.map((brand) => (
          <div
            key={brand}
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "6px 16px",
              fontFamily: "'Syne', sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--ink3)",
            }}
          >
            {brand}
          </div>
        ))}
      </div>
    </>
  );
}
