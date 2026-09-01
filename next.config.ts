import type { NextConfig } from "next";

/**
 * Next.js configuration.
 *
 * Deployment target: Hostinger Node.js web app hosting (full Next.js
 * runtime — Route Handlers, Server Actions, ISR all supported).
 *
 * Legacy static site (index.html, blogs.html, resources/, newsletter/,
 * assets/) still lives at the repo root on this branch so main can
 * keep auto-deploying. Next.js's App Router ignores those root-level
 * *.html files. At cutover in stage 14 they're deleted.
 *
 * Redirects: preserve every legacy /*.html URL so search-engine and
 * external backlinks land on the new clean routes.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

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

export default nextConfig;
