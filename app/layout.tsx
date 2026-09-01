import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/*
 * Fonts are self-hosted by next/font at build time (no runtime request
 * to fonts.googleapis.com). Each family exposes a CSS variable that
 * globals.css picks up via @theme.
 *
 * `display: swap` prevents FOIT — the fallback (system-ui) shows
 * until the web font arrives, then swaps in with no layout shift
 * because sizes match.
 */
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["500", "700"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "PlatformOpsStudio",
  description:
    "Platform Engineering & DevSecOps blogs, videos, and a weekly newsletter — The Platform Pulse.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
