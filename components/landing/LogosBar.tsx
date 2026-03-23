const BRANDS = [
  { name: "Spotify", logoPath: "/logos/spotify.svg" },
  { name: "Netflix", logoPath: "/logos/netflix.svg" },
  { name: "Adobe", logoPath: "/logos/adobe.svg" },
  { name: "Dropbox", logoPath: "/logos/dropbox.svg" },
  { name: "Slack", logoPath: "/logos/slack.svg" },
  { name: "GitHub", logoPath: "/logos/github.svg" },
  { name: "Figma", logoPath: "/logos/figma.svg" },
  { name: "OpenAI", logoPath: "/logos/openai.svg" },
];

export default function LogosBar() {
  return (
    <section
      style={{
        background: "#f5f4f0",
        width: "100%",
        padding: "36px 6%",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            color: "#888",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: 18,
          }}
        >
          Trusted by people signing up for
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {BRANDS.map((brand) => (
            <div
              key={brand.name}
              title={brand.name}
              style={{
                background: "#ffffff",
                border: "0.5px solid #e2e1db",
                borderRadius: 8,
                padding: "8px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "border-color 0.15s",
              }}
            >
              <img
                src={brand.logoPath}
                alt={brand.name}
                style={{
                  height: 18,
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
