import NextLink from "next/link";
import { Container, Heading, Section, Text } from "@/components/ui";
import { approachCopy } from "@/content/copy/home";

export function Approach() {
  return (
    <Section spacing="lg" surface="bg" ariaLabelledby="approach-heading">
      <Container>
        <div className="max-w-3xl">
          <Text
            as="div"
            variant="small"
            className="text-primary mb-3 font-mono tracking-widest uppercase"
          >
            {approachCopy.eyebrow}
          </Text>
          <Heading as="h2" level="h2" id="approach-heading">
            {approachCopy.heading}
          </Heading>
          <Text variant="muted" className="mt-6 text-lg">
            {approachCopy.body}
          </Text>
          <NextLink
            href={approachCopy.cta.href}
            className="border-border text-text duration-fast hover:border-primary hover:bg-surface-2 mt-8 inline-flex h-11 items-center justify-center rounded-md border bg-transparent px-5 font-sans text-sm font-semibold transition-colors ease-out"
          >
            {approachCopy.cta.label}
          </NextLink>
        </div>
      </Container>
    </Section>
  );
}
