import { SITE_URL } from "./site-url";

/*
 * JSON-LD builders — small, typed, no runtime dep. Pages render the
 * output via <script type="application/ld+json"> inline; each page
 * decides which types apply.
 *
 * Note: for the person entity we lean on schema.org's Person type
 * and keep it thin (no jobTitle, no employer beyond the site) so the
 * Rich Results Test doesn't ask for optional fields we don't have.
 */
export const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sudarshan Narayanan",
  url: SITE_URL,
  jobTitle: "Platform Engineering & DevSecOps",
  sameAs: [
    "https://www.linkedin.com/in/sudarshannarayanan/",
    "https://medium.com/@ramsudarsan",
    "https://x.com/platformopsstd",
    "https://www.youtube.com/@PlatformOpsStudio",
  ],
} as const;

export const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PlatformOpsStudio",
  url: SITE_URL,
  publisher: person,
  inLanguage: "en-US",
} as const;

export function breadcrumb(items: ReadonlyArray<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function article(input: {
  headline: string;
  description: string;
  datePublished: string;
  url: string;
  tags: readonly string[];
  imageUrl?: string;
  articleSection?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    author: person,
    datePublished: input.datePublished,
    url: input.url,
    ...(input.imageUrl ? { image: [input.imageUrl] } : {}),
    keywords: input.tags.join(", "),
    ...(input.articleSection ? { articleSection: input.articleSection } : {}),
    mainEntityOfPage: input.url,
    publisher: {
      "@type": "Organization",
      name: "PlatformOpsStudio",
      url: SITE_URL,
    },
  };
}

export const contactPage = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact — PlatformOpsStudio",
  url: `${SITE_URL}/contact`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "ramsudarsan@gmail.com",
    telephone: "+1-737-202-8818",
    areaServed: "US",
    availableLanguage: "English",
  },
} as const;

/** Small helper to emit the LD script tag safely in JSX. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
