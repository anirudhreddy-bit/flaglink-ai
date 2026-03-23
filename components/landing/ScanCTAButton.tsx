"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ScanCTAButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (session?.user) {
      router.push("/scan");
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        background: "#4f46e5",
        color: "#ffffff",
        borderRadius: 50,
        padding: "12px 26px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: 14,
        border: "none",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        transition: "background 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "#4338ca")}
      onMouseLeave={e => (e.currentTarget.style.background = "#4f46e5")}
    >
      Start Scanning →
    </button>
  );
}
