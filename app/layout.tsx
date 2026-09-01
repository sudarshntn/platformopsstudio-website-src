import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

/*
 * Fonts are self-hosted by next/font at build time (no runtime request
 * to fonts.googleapis.com). Each family exposes a CSS variable that
 * globals.css picks up via @theme.
 *
 * Weight audit (stage 2, per file): only the weights actually used in
 * components are loaded, per the utility-class audit. Adding a weight
 * requires loading it here too. Inter is loaded as a variable font (all
 * weights in one file), so no `weight` prop.
 *
 * `display: swap` prevents FOIT — the fallback (system-ui) shows
 * until the web font arrives, then swaps in with no layout shift
 * because sizes match.
 */
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["700"],
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
  weight: ["400"],
});

import type { Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "PlatformOpsStudio",
    template: "%s · PlatformOpsStudio",
  },
  description:
    "Platform Engineering & DevSecOps blogs, videos, and a weekly newsletter — The Platform Pulse.",
  metadataBase: new URL(SITE_URL),
};

// `themeColor` and viewport-scaling live in the separate viewport export
// per Next 15 conventions (moved out of `metadata` since Next 14).
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0b10" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

/*
 * Root layout wraps every route including the QA `/design` surface and
 * any future non-marketing routes. Header/footer/skip-link only apply
 * under the `(site)` route group — see app/(site)/layout.tsx.
 */
export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
