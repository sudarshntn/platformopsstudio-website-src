/**
 * Canonical origin — every absolute URL routes through here so
 * production/preview/dev all resolve the right host without any
 * hardcoded domains. Set NEXT_PUBLIC_SITE_URL in the environment;
 * the default is the production URL for local dev convenience.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://platformopsstudio.com";

export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
