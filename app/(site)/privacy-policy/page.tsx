import type { Metadata } from "next";
import { Container, Heading, Section, Text } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy & Cookies Policy",
  description: "How PlatformOpsStudio handles information collected via the site.",
};

/**
 * Stage 2 stub. Real content ports from content/legal/*.mdx in stage 12.
 */
export default function PrivacyPolicyPage() {
  return (
    <Section spacing="lg">
      <Container>
        <Heading as="h1" level="h1">
          Privacy &amp; Cookies Policy
        </Heading>
        <Text variant="muted" className="mt-4 max-w-2xl">
          Full policy content lands in stage 12 alongside the Consent Mode–aware cookie banner.
        </Text>
      </Container>
    </Section>
  );
}
