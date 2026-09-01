import type { NextConfig } from "next";

/**
 * Next.js configuration.
 *
 * Deployment target for stage 0: Hostinger Node.js web app (full Next.js
 * runtime — Route Handlers, Server Actions, etc. all available). No static
 * export.
 *
 * Legacy static site (index.html, blogs.html, resources/, newsletter/,
 * assets/) still lives at the repo root on this branch so that main can
 * continue to auto-deploy to Hostinger unchanged during the migration.
 * Next.js ignores those root-level *.html files by default — App Router
 * takes precedence for any matching path.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
