import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { getAllBlogs, getAllNewsletters } from "@/lib/content/load";

/**
 * Full sitemap — static routes + every MDX-derived slug. `lastModified`
 * comes from the frontmatter date so search engines can prioritize
 * fresh content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/blogs",
    "/newsletter",
    "/contact",
    "/legal-notice",
    "/privacy-policy",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1.0 : 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllBlogs().map((post) => ({
    url: `${SITE_URL}/blogs/${post.frontmatter.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const newsletterRoutes: MetadataRoute.Sitemap = getAllNewsletters().map((issue) => ({
    url: `${SITE_URL}/newsletter/${issue.frontmatter.slug}`,
    lastModified: new Date(issue.frontmatter.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes, ...newsletterRoutes];
}
