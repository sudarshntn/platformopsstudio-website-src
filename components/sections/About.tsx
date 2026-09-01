import NextLink from "next/link";
import { Container, Heading, Section, Text } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { aboutCopy } from "@/content/copy/home";

export function About() {
  return (
    <Section spacing="lg" surface="surface" ariaLabelledby="about-heading">
      <Container>
        <Reveal className="max-w-3xl">
          <Text
            as="div"
            variant="small"
            className="text-primary mb-3 font-mono tracking-widest uppercase"
          >
            {aboutCopy.eyebrow}
          </Text>
          <Heading as="h2" level="h2" id="about-heading">
            {aboutCopy.heading}
          </Heading>
          <Text variant="muted" className="mt-6 text-lg">
            {aboutCopy.body}{" "}
            <NextLink
              href={aboutCopy.emailLink.href}
              className="text-primary underline-offset-4 hover:underline"
            >
              {aboutCopy.emailLink.label}
            </NextLink>
            .
          </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
