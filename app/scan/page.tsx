import Link from "next/link";
import ScanSection from "@/components/landing/ScanSection";

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center">
      <div className="w-full max-w-[1100px] px-6 py-8 text-center">
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: 13,
            color: "#475569",
            border: "1.5px solid #cbd5e1",
            borderRadius: 100,
            padding: "8px 16px",
          }}
        >
          ← Back
        </Link>
      </div>
      <ScanSection />
    </main>
  );
}

