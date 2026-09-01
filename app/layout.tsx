import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
