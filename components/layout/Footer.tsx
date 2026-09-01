import NextLink from "next/link";
import { Container, Image, Text } from "@/components/ui";
import { primaryNav } from "@/lib/nav";
import { socialLinks } from "@/lib/social";

const legalLinks = [
  { label: "Legal Notice", href: "/legal-notice" },
  { label: "Privacy Policy", href: "/privacy-policy" },
] as const;

export function Footer() {
  return (
    <footer className="border-border bg-surface text-text mt-24 border-t">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr] md:py-16">
          {/* Brand + tagline */}
          <div className="max-w-sm">
            <NextLink
              href="/"
              className="flex items-center gap-2"
              aria-label="PlatformOpsStudio, home"
            >
              <Image src="/assets/img/logo.png" alt="" width={36} height={22} />
              <span className="font-display text-lg font-bold">PlatformOpsStudio</span>
            </NextLink>
            <Text variant="small" className="text-muted mt-3">
              Platform Engineering &amp; DevSecOps in Texas — blogs, videos, and a weekly
              newsletter.
            </Text>
          </div>

          {/* Nav column */}
          <div>
            <Text
              as="div"
              variant="small"
              className="text-muted mb-3 font-mono tracking-wider uppercase"
            >
              Explore
            </Text>
            <ul className="space-y-2">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <NextLink
                    href={item.href}
                    className="text-text duration-fast hover:text-primary text-sm transition-colors"
                  >
                    {item.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <Text
              as="div"
              variant="small"
              className="text-muted mb-3 font-mono tracking-wider uppercase"
            >
              Legal
            </Text>
            <ul className="space-y-2">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <NextLink
                    href={item.href}
                    className="text-text duration-fast hover:text-primary text-sm transition-colors"
                  >
                    {item.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row: social + copyright */}
        <div className="border-border flex flex-col items-start justify-between gap-6 border-t py-6 md:flex-row md:items-center">
          <ul className="flex items-center gap-2" aria-label="Social profiles">
            {socialLinks.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={s.label}
                  className="border-border bg-surface-2 text-muted duration-fast hover:border-primary hover:bg-primary hover:text-primary-fg inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ease-out"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <div className="text-muted flex flex-col gap-1 text-sm md:items-end md:text-right">
            <span>© 2026 Platform Ops Studio. All rights reserved.</span>
            <span>
              Texas, United States ·{" "}
              <a href="mailto:ramsudarsan@gmail.com" className="text-text hover:text-primary">
                ramsudarsan@gmail.com
              </a>
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
