import Link from "next/link";
import ScanSection from "@/components/landing/ScanSection";

export default function ScanPage() {
  return (
    <main style={{ position: "relative" }}>
      {/* Back button — top left */}
      <div style={{ position: "absolute", top: 20, left: 28, zIndex: 10 }}>
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
          }}
        >
          ← Back
        </Link>
      </div>

      <ScanSection />
    </main>
  );
}
