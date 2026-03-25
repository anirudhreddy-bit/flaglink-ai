"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Wrap any protected page with this component.
 * If the session expires or the user is not logged in, they are
 * immediately sent to sign-in with a callbackUrl so they return
 * to the right page after logging back in.
 */
export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  // Show nothing while the session is being checked or redirect is in flight
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
      }}>
        <div style={{
          width: 36,
          height: 36,
          border: "3px solid #e5e7eb",
          borderTop: "3px solid #4f46e5",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
