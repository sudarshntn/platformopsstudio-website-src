import type { Metadata } from "next";
import { Card, Container, Heading, Section, Text } from "@/components/ui";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Sudarshan Narayanan about Platform Engineering and DevSecOps.",
};

export default function ContactPage() {
  return (
    <Section spacing="lg">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <Heading as="h1" level="h1">
              Let&apos;s Connect and Collaborate
            </Heading>
            <Text variant="muted" className="mt-4">
              Questions, feedback, or a Platform Engineering / DevSecOps problem you&apos;re
              wrestling with — send a note and I&apos;ll reply.
            </Text>
            <dl className="text-muted mt-8 space-y-3 text-sm">
              <div>
                <dt className="font-mono text-xs tracking-widest uppercase">Email</dt>
                <dd className="text-text mt-1">
                  <a href="mailto:ramsudarsan@gmail.com" className="text-primary hover:underline">
                    ramsudarsan@gmail.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs tracking-widest uppercase">Phone</dt>
                <dd className="text-text mt-1">
                  <a href="tel:+17372028818" className="text-primary hover:underline">
                    +1 737 202 8818
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs tracking-widest uppercase">Location</dt>
                <dd className="text-text mt-1">Texas, United States</dd>
              </div>
            </dl>
          </div>
          <Card elevated padding="lg">
            <ContactForm />
          </Card>
        </div>
      </Container>
    </Section>
  );
}
