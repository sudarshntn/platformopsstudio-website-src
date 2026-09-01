import type { Metadata } from "next";
import { Container, Heading, Section, Text } from "@/components/ui";

export const metadata: Metadata = {
  title: "Legal Notice",
  description: "Business information for Platform Ops Studio.",
};

/**
 * Stage 2 stub. Real page content ports from content/legal/*.mdx in
 * stage 12 (cookie banner + legal pages).
 */
export default function LegalNoticePage() {
  return (
    <Section spacing="lg">
      <Container>
        <Heading as="h1" level="h1">
          Legal Notice
        </Heading>
        <Text variant="muted" className="mt-4 max-w-2xl">
          Full legal notice content lands in stage 12 via MDX under
          <code className="mx-1 font-mono">content/legal/</code>.
        </Text>
      </Container>
    </Section>
  );
}
