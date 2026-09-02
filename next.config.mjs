import bundleAnalyzer from "@next/bundle-analyzer";

/**
 * Next.js configuration.
 *
 * Deployment target: Hostinger Node.js web app hosting (full Next.js
 * runtime — Route Handlers, Server Actions, ISR all supported).
 *
 * Kept as .mjs (not .ts) so Next never needs to compile TypeScript
 * just to load its own config. On hosts that install with plain npm
 * and don't have pnpm on PATH, a .ts config triggers Next's auto-
 * install path which spawns whichever package manager owns the
 * lockfile — pnpm here — and errors with ENOENT. .mjs bypasses all
 * of that.
 *
 * Legacy static site (index.html, blogs.html, resources/, newsletter/,
 * assets/) still lives at the repo root on this branch so main can
 * keep auto-deploying. Next.js's App Router ignores those root-level
 * *.html files. At cutover in stage 14 they're deleted.
 *
 * Redirects: preserve every legacy /*.html URL so search-engine and
 * external backlinks land on the new clean routes.
 *
 * Bundle analyzer opts in via ANALYZE=1 pnpm build — writes
 * .next/analyze/*.html which we spot-check after any bundle-heavy
 * change. See docs/perf.md for the routine.
 */
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "1",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // AVIF first, WebP fallback. next/image negotiates on request.
  images: {
    formats: ["image/avif", "image/webp"],
    // Content-safe defaults — no runtime SVG sanitization needed
    // because we don't proxy external SVGs.
    dangerouslyAllowSVG: false,
  },

  // Loud-fail on production builds if we accidentally ship a package
  // that pulls in a huge dep. Reviewed at each release.
  experimental: {
    optimizePackageImports: ["lucide-react", "motion", "@react-three/drei"],
  },

  async headers() {
    return [
      {
        // next/image and everything under /_next/static are content-hashed,
        // so we can safely cache for a year.
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Basic hardening — no framing, no MIME sniffing, strict referrer.
        // HSTS is set by the hosting layer once the domain is HTTPS-only.
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/blogs.html", destination: "/blogs", permanent: true },
      { source: "/newsletter.html", destination: "/newsletter", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/legal-notice.html", destination: "/legal-notice", permanent: true },
      { source: "/privacy-policy.html", destination: "/privacy-policy", permanent: true },
      // Legacy blog URLs — old site kept posts under /resources/<slug>.html.
      { source: "/resources.html", destination: "/blogs", permanent: true },
      { source: "/resources/:slug.html", destination: "/blogs/:slug", permanent: true },
      // Legacy newsletter — old site kept these as /newsletter/<slug>.html.
      { source: "/newsletter/:slug.html", destination: "/newsletter/:slug", permanent: true },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
