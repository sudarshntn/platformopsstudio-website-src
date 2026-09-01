import type { Metadata } from "next";
import { Container, Heading, Section, Text } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Sudarshan Narayanan about Platform Engineering and DevSecOps.",
};

/**
 * Stage 2 stub. Real form (react-hook-form + zod + Resend, honeypot +
 * time-trap) lands in stage 8.
 */
export default function ContactPage() {
  return (
    <Section spacing="lg">
      <Container>
        <Heading as="h1" level="h1">
          Let&apos;s Connect and Collaborate
        </Heading>
        <Text variant="muted" className="mt-4 max-w-2xl">
          Reach out with questions or feedback. Full form (with Resend delivery, honeypot, and
          time-trap) lands in stage 8. Until then, email me at{" "}
          <a
            href="mailto:ramsudarsan@gmail.com"
            className="text-primary underline-offset-4 hover:underline"
          >
            ramsudarsan@gmail.com
          </a>
          .
        </Text>
      </Container>
    </Section>
  );
}
