import Link from "next/link";
import HowItWorks from "@/components/landing/HowItWorks";

export default function HowItWorksPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f4f0",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Back button — top left */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 28,
          zIndex: 10,
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            textDecoration: "none",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 13,
            color: "#555",
            border: "0.5px solid #e2e1db",
            borderRadius: 50,
            padding: "7px 16px",
            background: "#ffffff",
            transition: "border-color 0.15s",
          }}
        >
          ← Back
        </Link>
      </div>

      {/* Content fills the rest */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <HowItWorks />
      </div>
    </main>
  );
}
