import type { Metadata } from "next";
import { Container, Heading, Section, Text } from "@/components/ui";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Newsletter · ${slug}`,
    description: `Newsletter edition ${slug} — Platform Ops Studio`,
  };
}

/**
 * Stage 2 stub. Real edition renderer (MDX body, banner, LinkedIn
 * callout, related-issues grid) lands in stage 3 once the content loader
 * exists. For now the slug is echoed so nav wiring can be tested.
 */
export default async function NewsletterEditionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  return (
    <Section spacing="lg">
      <Container>
        <Text
          as="div"
          variant="small"
          className="mb-3 font-mono uppercase tracking-widest text-primary"
        >
          The Platform Pulse · edition stub
        </Text>
        <Heading as="h1" level="h1">
          {slug}
        </Heading>
        <Text variant="muted" className="mt-4 max-w-2xl">
          Individual newsletter edition page. Real content renders from MDX in stage 3.
        </Text>
      </Container>
    </Section>
  );
}
