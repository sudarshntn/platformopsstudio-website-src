import { getAllBlogs } from "@/lib/content/load";
import { renderRss, SITE_URL } from "@/lib/rss";

/*
 * Blog RSS feed at /blogs/feed.xml. Same shape as the newsletter
 * feed above; separate URL so RSS clients can subscribe to just one
 * or the other.
 */
export const revalidate = 3600;

export function GET(): Response {
  const items = getAllBlogs().map((post) => {
    const fm = post.frontmatter;
    const link = `${SITE_URL}/blogs/${fm.slug}`;
    return {
      title: fm.title,
      link,
      guid: link,
      pubDate: fm.date,
      description: fm.excerpt,
      categories: fm.tags,
    };
  });

  const body = renderRss({
    title: "PlatformOpsStudio — Blogs",
    description:
      "Practical writing on Platform Engineering, DevSecOps, GitOps, and cloud-native architecture from Sudarshan Narayanan.",
    link: `${SITE_URL}/blogs`,
    items,
  });

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
