import NextLink from "next/link";
import { Badge, Container, Heading, Image, Section, Text } from "@/components/ui";
import { newsletterLatestCopy } from "@/content/copy/home";
import { getAllNewsletters } from "@/lib/content/load";

/**
 * Homepage tie-in for The Platform Pulse. Renders the two most recent
 * editions as cards, with buttons pointing at the full archive and
 * the LinkedIn newsletter subscribe page.
 *
 * Read from the content loader at render time so a new issue lands here
 * automatically the moment its MDX file is added — no manual list edit.
 */
export function NewsletterLatest() {
  const latest = getAllNewsletters().slice(0, 2);
  if (latest.length === 0) return null;

  return (
    <Section spacing="lg" surface="surface" ariaLabelledby="latest-newsletter-heading">
      <Container>
        <Text
          as="div"
          variant="small"
          className="text-primary mb-3 font-mono tracking-widest uppercase"
        >
          {newsletterLatestCopy.eyebrow}
        </Text>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Heading as="h2" level="h2" id="latest-newsletter-heading">
            {newsletterLatestCopy.heading}
          </Heading>
        </div>
        <Text variant="muted" className="mt-4 max-w-2xl">
          {newsletterLatestCopy.body}
        </Text>

        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {latest.map((issue) => {
            const fm = issue.frontmatter;
            return (
              <li key={fm.slug}>
                <NextLink
                  href={`/newsletter/${fm.slug}`}
                  className="group border-border bg-surface-2 duration-fast hover:border-primary/60 flex h-full flex-col overflow-hidden rounded-lg border transition-colors"
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
                    <div className="text-muted mb-2 flex items-center gap-2 text-sm">
                      <Badge variant="primary">Edition {fm.edition}</Badge>
                      <time dateTime={fm.date}>
                        {new Date(fm.date).toLocaleDateString("en-US", {
                          timeZone: "UTC",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <Heading as="h3" level="h4" className="group-hover:text-primary mb-2">
                      {fm.title}
                    </Heading>
                    <Text variant="small" className="text-muted flex-1">
                      {fm.excerpt}
                    </Text>
                  </div>
                </NextLink>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <NextLink
            href={newsletterLatestCopy.archiveCta.href}
            className="bg-primary text-primary-fg duration-fast inline-flex h-11 items-center justify-center rounded-md px-5 font-sans text-sm font-semibold transition-[filter] ease-out hover:brightness-110"
          >
            {newsletterLatestCopy.archiveCta.label}
          </NextLink>
          <a
            href={newsletterLatestCopy.linkedInCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border text-text duration-fast hover:border-primary hover:bg-surface-2 inline-flex h-11 items-center justify-center rounded-md border bg-transparent px-5 font-sans text-sm font-semibold transition-colors ease-out"
          >
            {newsletterLatestCopy.linkedInCta.label} →
          </a>
        </div>
      </Container>
    </Section>
  );
}
