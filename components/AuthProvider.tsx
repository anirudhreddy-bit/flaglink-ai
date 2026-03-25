"use client";

import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      // Re-check the session when the user switches back to the tab
      refetchOnWindowFocus={true}
      // Re-check every 5 minutes so expiry is caught quickly
      refetchInterval={5 * 60}
    >
      {children}
    </SessionProvider>
  );
}
