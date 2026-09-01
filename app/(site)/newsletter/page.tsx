import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Container, Heading, Image, Section, Text } from "@/components/ui";
import { getAllNewsletters } from "@/lib/content/load";

export const metadata: Metadata = {
  title: "Newsletter — The Platform Pulse",
  description:
    "A weekly briefing on what's actually changing across Platform Engineering, DevSecOps, AI, and SRE. Published on LinkedIn every Monday and archived here.",
};

export default function NewsletterPage() {
  const issues = getAllNewsletters();

  return (
    <Section spacing="lg">
      <Container>
        <Text
          as="div"
          variant="small"
          className="mb-3 font-mono uppercase tracking-widest text-primary"
        >
          Newsletter
        </Text>
        <Heading as="h1" level="h1">
          The Platform Pulse
        </Heading>
        <Text variant="muted" className="mt-4 max-w-2xl">
          A weekly briefing on what&apos;s actually changing across Platform Engineering,
          DevSecOps, AI, and SRE. Published on LinkedIn every Monday; each issue is archived
          here shortly after.
        </Text>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://www.linkedin.com/newsletters/the-platform-pulse-7468764234068369410/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 font-sans text-sm font-semibold text-primary-fg transition-[filter] duration-fast hover:brightness-110"
          >
            Subscribe on LinkedIn →
          </a>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {issues.map((issue) => {
            const fm = issue.frontmatter;
            return (
              <li key={fm.slug}>
                <Link
                  href={`/newsletter/${fm.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors duration-fast hover:border-primary/60"
                >
                  {fm.cover && (
                    <Image
                      src={fm.cover}
                      alt=""
                      fill
                      aspect="16/9"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted">
                      <Badge variant="primary">Edition {fm.edition}</Badge>
                      <time dateTime={fm.date}>
                        {new Date(fm.date).toLocaleDateString("en-US", { timeZone: "UTC", 
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <span aria-hidden>·</span>
                      <span>{issue.readingMinutes} min read</span>
                    </div>
                    <Heading as="h2" level="h4" className="mb-2 group-hover:text-primary">
                      {fm.title}
                    </Heading>
                    <Text variant="small" className="flex-1 text-muted">
                      {fm.excerpt}
                    </Text>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
