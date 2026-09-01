import { Container, Heading, Section, Text } from "@/components/ui";

/**
 * Stage 2 stub. Real hero + section composition arrives in stage 4;
 * the 3D scene lands in stage 5.
 */
export default function HomePage() {
  return (
    <Section spacing="lg">
      <Container>
        <Text
          as="div"
          variant="small"
          className="text-primary mb-3 font-mono tracking-widest uppercase"
        >
          Stage 2 · route stub
        </Text>
        <Heading as="h1" level="h1">
          PlatformOpsStudio
        </Heading>
        <Text variant="muted" className="mt-4 max-w-2xl">
          Platform Engineering &amp; DevSecOps in Texas — blogs, videos, and a weekly newsletter.
          Full home composition (hero, about, latest issues, CTA bands) arrives in stage 4.
        </Text>
      </Container>
    </Section>
  );
}
