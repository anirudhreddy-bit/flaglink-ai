export default function LandingFooter() {
  return (
    <footer
      style={{
        background: "#ffffff",
        borderTop: "0.5px solid #e2e1db",
        width: "100%",
        padding: "24px 6%",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          width: "100%",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontStyle: "italic",
            fontSize: 12,
            color: "#888",
            marginBottom: 4,
          }}
        >
          Not legal advice. For informational purposes only. Powered by Claude.
        </p>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: "#aaa",
          }}
        >
          © 2026 FlagLink AI
        </p>
      </div>
    </footer>
  );
}
