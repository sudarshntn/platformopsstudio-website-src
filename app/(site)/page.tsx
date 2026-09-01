import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { Approach } from "@/components/sections/Approach";
import { DualCTA } from "@/components/sections/DualCTA";
import { Hero } from "@/components/sections/Hero";
import { NewsletterLatest } from "@/components/sections/NewsletterLatest";
import { Subscribe } from "@/components/sections/Subscribe";
import { jsonLdScript, person, website } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: {
    // Explicitly override the root layout's template on the home page —
    // the title should just be the site name, not "Home · PlatformOpsStudio".
    absolute: "PlatformOpsStudio — Platform Engineering & DevSecOps",
  },
  description:
    "Blogs, videos, and a weekly newsletter for platform teams shipping in Kubernetes, cloud-native, and agentic-AI environments.",
  openGraph: {
    type: "website",
    title: "PlatformOpsStudio — Platform Engineering & DevSecOps",
    description:
      "Blogs, videos, and a weekly newsletter for platform teams shipping in Kubernetes, cloud-native, and agentic-AI environments.",
    images: [
      {
        url: "/assets/img/banners/banner-mcp-orchestrator.svg",
        width: 1200,
        height: 630,
        alt: "PlatformOpsStudio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlatformOpsStudio — Platform Engineering & DevSecOps",
    description:
      "Blogs, videos, and a weekly newsletter for platform teams shipping in Kubernetes, cloud-native, and agentic-AI environments.",
  },
};

/**
 * Home page. Composed from section components under
 * components/sections/*; all copy in content/copy/home.ts. The
 * Stage-5 3D scene lands behind the Hero without changing this
 * composition.
 */
export default function HomePage() {
  return (
    <>
      {/* JSON-LD: WebSite + Person. Consumed by search engines and
          social crawlers for rich results. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(person) }}
      />
      <Hero />
      <About />
      <Approach />
      <NewsletterLatest />
      <Subscribe />
      <DualCTA />
    </>
  );
}
