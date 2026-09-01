import { getAllNewsletters } from "@/lib/content/load";
import { renderRss, SITE_URL } from "@/lib/rss";

/*
 * Newsletter RSS feed at /feed.xml. RSS 2.0 with per-item categories
 * (frontmatter tags). Cached for one hour via ISR.
 */
export const revalidate = 3600;

export function GET(): Response {
  const items = getAllNewsletters().map((issue) => {
    const fm = issue.frontmatter;
    const link = `${SITE_URL}/newsletter/${fm.slug}`;
    return {
      title: `Edition ${fm.edition} — ${fm.title}`,
      link,
      guid: link,
      pubDate: fm.date,
      description: fm.excerpt,
      categories: fm.tags,
    };
  });

  const body = renderRss({
    title: "The Platform Pulse",
    description:
      "A weekly briefing on what's actually changing across Platform Engineering, DevSecOps, AI, and SRE.",
    link: SITE_URL,
    items,
  });

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
