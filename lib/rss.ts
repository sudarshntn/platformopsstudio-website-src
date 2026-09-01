import { SITE_URL } from "./site-url";

type Item = {
  readonly title: string;
  readonly link: string;
  readonly description: string;
  readonly pubDate: string;
  readonly guid: string;
  readonly categories?: readonly string[];
};

/**
 * Minimal RSS 2.0 generator — hand-written so we don't add a
 * dependency for a ~50-line file. Escapes titles/descriptions and
 * uses <![CDATA[...]]> so no fragile inner-encoding is required.
 */
export function renderRss(feed: {
  readonly title: string;
  readonly description: string;
  readonly link: string;
  readonly items: readonly Item[];
}): string {
  const now = new Date().toUTCString();
  const items = feed.items
    .map(
      (i) => `    <item>
      <title><![CDATA[${i.title}]]></title>
      <link>${i.link}</link>
      <guid isPermaLink="true">${i.guid}</guid>
      <pubDate>${new Date(i.pubDate).toUTCString()}</pubDate>
      <description><![CDATA[${i.description}]]></description>${
        i.categories?.map((c) => `\n      <category>${c}</category>`).join("") ?? ""
      }
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${feed.title}]]></title>
    <link>${feed.link}</link>
    <atom:link href="${feed.link}/feed.xml" rel="self" type="application/rss+xml" />
    <description><![CDATA[${feed.description}]]></description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>Next.js — PlatformOpsStudio</generator>
${items}
  </channel>
</rss>`;
}

export { SITE_URL };
