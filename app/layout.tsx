import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlagLink AI — Terms & Conditions Scanner",
  description:
    "Scan any Terms & Conditions for red flags, shady clauses, and hidden traps. Powered by Claude AI.",
  openGraph: {
    title: "FlagLink AI — Terms & Conditions Scanner",
    description:
      "Scan any Terms & Conditions for red flags, shady clauses, and hidden traps.",
  },
  icons: {
    icon: [
      { url: "/icon.svg",        type: "image/svg+xml" },
      { url: "/favicon.png",     type: "image/png",  sizes: "180x180" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ colorScheme: "light" }} data-scroll-behavior="smooth">
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
