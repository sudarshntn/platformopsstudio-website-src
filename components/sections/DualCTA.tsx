import NextLink from "next/link";
import { Card, Container, Heading, Section, Text } from "@/components/ui";
import { dualCtaCopy } from "@/content/copy/home";

/**
 * Two side-by-side cards on wide viewports, stacked on narrow.
 * Contact vs Read More — the two most common next actions from the
 * home page.
 */
export function DualCTA() {
  return (
    <Section spacing="lg" surface="bg" ariaLabelledby="dual-cta-heading">
      <Container>
        <Heading as="h2" level="h6" id="dual-cta-heading">
          <span className="sr-only">Ways to go deeper</span>
        </Heading>
        <div className="grid gap-6 md:grid-cols-2">
          <Card elevated padding="lg">
            <Heading as="h3" level="h4">
              {dualCtaCopy.contact.heading}
            </Heading>
            <Text variant="muted" className="mt-3">
              {dualCtaCopy.contact.body}
            </Text>
            <NextLink
              href={dualCtaCopy.contact.cta.href}
              className="bg-primary text-primary-fg duration-fast mt-6 inline-flex h-11 items-center justify-center rounded-md px-5 font-sans text-sm font-semibold transition-[filter] ease-out hover:brightness-110"
            >
              {dualCtaCopy.contact.cta.label}
            </NextLink>
          </Card>
          <Card elevated padding="lg">
            <Heading as="h3" level="h4">
              {dualCtaCopy.read.heading}
            </Heading>
            <Text variant="muted" className="mt-3">
              {dualCtaCopy.read.body}
            </Text>
            <NextLink
              href={dualCtaCopy.read.cta.href}
              className="border-border text-text duration-fast hover:border-primary hover:bg-surface-2 mt-6 inline-flex h-11 items-center justify-center rounded-md border bg-transparent px-5 font-sans text-sm font-semibold transition-colors ease-out"
            >
              {dualCtaCopy.read.cta.label}
            </NextLink>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
