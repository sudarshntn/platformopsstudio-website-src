import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/**
 * Standard robots.txt: allow everything except the /design QA surface
 * and the /api/ endpoints (Route Handlers, no useful GET body).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/design", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
