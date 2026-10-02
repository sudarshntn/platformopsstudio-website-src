import type { Metadata } from "next";
import NextLink from "next/link";
import { Badge, Container, Heading, Icon, Image, Section, Text } from "@/components/ui";
import { plannedVideos, videosCopy } from "@/content/copy/videos";
import { socialLinks } from "@/lib/social";

// lucide-react dropped brand icons for trademark reasons, so the YouTube
// mark comes from the same roster the footer renders — one source of
// truth for the path rather than a second copy pasted here.
const youTubeMark = socialLinks.find((s) => s.label === "YouTube");

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Hands-on Platform Engineering and DevSecOps walkthroughs on YouTube — the channel is launching soon. Here's the opening lineup.",
  openGraph: {
    title: "Videos — PlatformOpsStudio",
    description:
      "Hands-on Platform Engineering and DevSecOps walkthroughs. The channel is launching soon.",
    type: "website",
    images: [{ url: videosCopy.banner.src, width: 1200, height: 630 }],
  },
};

export default function VideosPage() {
  return (
    <Section spacing="lg">
      <Container>
        {/* ── Announcement ─────────────────────────────────────── */}
        <div className="max-w-3xl">
          <Text
            as="div"
            variant="small"
            className="text-primary mb-3 font-mono tracking-widest uppercase"
          >
            {videosCopy.eyebrow}
          </Text>
          <div className="flex flex-wrap items-center gap-3">
            <Heading as="h1" level="h1">
              {videosCopy.heading}
            </Heading>
            <Badge variant="primary">{videosCopy.statusBadge}</Badge>
          </div>
          <Text variant="muted" className="mt-4">
            {videosCopy.intro}
          </Text>
        </div>

        <div className="mt-10 max-w-4xl">
          <Image
            src={videosCopy.banner.src}
            alt={videosCopy.banner.alt}
            fill
            aspect="16/9"
            radius="lg"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>

        {/* ── Planned lineup ───────────────────────────────────── */}
        <Heading as="h2" level="h3" className="mt-16">
          First episodes
        </Heading>
        <Text variant="muted" className="mt-3 max-w-2xl">
          Each one pairs with something already written up here, so you don&apos;t have to wait for
          the video to get the material.
        </Text>

        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plannedVideos.map((video) => (
            <li
              key={video.slug}
              className="border-border bg-surface flex h-full flex-col overflow-hidden rounded-lg border"
            >
              {/* Thumbnail stand-in. Mirrors the blog card's gradient
                  fallback so an unshipped episode reads as the same
                  family of card, not a broken image. */}
              <div className="from-surface-2 via-surface to-primary/20 relative flex aspect-[16/9] items-center justify-center bg-gradient-to-br">
                <span className="border-primary/40 bg-bg/60 text-primary flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-sm">
                  <Icon name="Play" size={24} />
                </span>
                <span className="absolute top-3 right-3">
                  <Badge variant="accent">{videosCopy.statusBadge}</Badge>
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <Text
                  as="div"
                  variant="small"
                  className="text-muted mb-2 font-mono text-xs tracking-wider uppercase"
                >
                  {video.runtime}
                </Text>
                <Heading as="h3" level="h5" className="mb-2">
                  {video.title}
                </Heading>
                <Text variant="small" className="text-muted flex-1">
                  {video.description}
                </Text>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {video.tags.map((tag) => (
                    <Badge key={tag} variant="neutral">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {video.companion && (
                  <NextLink
                    href={video.companion.href}
                    className="text-primary duration-fast mt-4 inline-flex items-center gap-1 text-sm font-semibold hover:underline"
                  >
                    {video.companion.label}
                    <span aria-hidden>→</span>
                  </NextLink>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* ── Subscribe ────────────────────────────────────────── */}
        <div className="border-border bg-surface mt-16 flex flex-col gap-5 rounded-lg border p-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <Heading as="h2" level="h4">
              {videosCopy.subscribe.heading}
            </Heading>
            <Text variant="muted" className="mt-2">
              {videosCopy.subscribe.body}
            </Text>
          </div>
          {/* External CTA renders as an anchor, matching the
              "Read on LinkedIn" treatment on newsletter detail pages —
              Button is a real <button> and has no href. */}
          <a
            href={videosCopy.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-fg duration-fast inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md px-6 font-sans text-sm font-semibold transition-[filter] hover:brightness-110"
          >
            {youTubeMark && (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
                <path d={youTubeMark.path} />
              </svg>
            )}
            {videosCopy.subscribe.cta}
          </a>
        </div>

        {/* ── Meanwhile ────────────────────────────────────────── */}
        <div className="mt-10">
          <Heading as="h2" level="h5">
            {videosCopy.meanwhile.heading}
          </Heading>
          <Text variant="muted" className="mt-2">
            {videosCopy.meanwhile.body}
          </Text>
          <div className="mt-4 flex flex-wrap gap-3">
            {videosCopy.meanwhile.links.map((link) => (
              <NextLink
                key={link.href}
                href={link.href}
                className="border-border text-text duration-fast hover:border-primary/60 hover:text-primary inline-flex h-10 items-center rounded-md border px-4 text-sm font-semibold transition-colors"
              >
                {link.label}
              </NextLink>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
