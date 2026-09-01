import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/*
 * Fonts are self-hosted by next/font at build time (no runtime request
 * to fonts.googleapis.com). Each family exposes a CSS variable that
 * globals.css picks up via @theme.
 *
 * Weight audit (stage 2): only the weights actually used in components
 * are loaded, per the utility-class audit. Adding a weight requires
 * loading it here too. Inter is loaded as a variable font (all weights
 * in one file), so no `weight` prop.
 *
 * `display: swap` prevents FOIT — the fallback (system-ui) shows
 * until the web font arrives, then swaps in with no layout shift
 * because sizes match.
 */
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  // Only 700 is used — Heading H1/H2 apply `font-bold`.
  weight: ["700"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  // Variable font — one file covers 400/500/600/700.
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  // Only 400 is used — code blocks, technical labels. No mono headings.
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "PlatformOpsStudio",
    template: "%s · PlatformOpsStudio",
  },
  description:
    "Platform Engineering & DevSecOps blogs, videos, and a weekly newsletter — The Platform Pulse.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  // Icons — Next 15 auto-detects `app/icon.png` and `app/apple-icon.png`
  // from the file-based convention, so no explicit `icons.icon` needed.
  // We still declare the manifest link (referenced 192/512 PNGs live in
  // /public/, added in stage 4 when the PWA manifest lands).
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
