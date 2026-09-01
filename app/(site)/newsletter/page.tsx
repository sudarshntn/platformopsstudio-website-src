import type { Metadata } from "next";
import { Container, Heading, Section, Text } from "@/components/ui";

export const metadata: Metadata = {
  title: "Newsletter — The Platform Pulse",
  description:
    "A weekly briefing on what's actually changing across Platform Engineering, DevSecOps, AI, and SRE.",
};

/**
 * Stage 2 stub. Archive listing (5 editions to date) + LinkedIn CTA
 * lands in stage 3.
 */
export default function NewsletterPage() {
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
          DevSecOps, AI, and SRE. Full archive arrives in stage 3.
        </Text>
      </Container>
    </Section>
  );
}
