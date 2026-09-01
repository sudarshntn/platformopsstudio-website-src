import type { Metadata } from "next";
import { Container, Heading, Section, Text } from "@/components/ui";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Practical writing on Platform Engineering and DevSecOps — 14 posts, several cross-posted from Medium.",
};

/**
 * Stage 2 stub. Real listing (14 posts, banners, dates) lands in stage 3
 * once the MDX content model is in place.
 */
export default function BlogsPage() {
  return (
    <Section spacing="lg">
      <Container>
        <Heading as="h1" level="h1">
          Blogs
        </Heading>
        <Text variant="muted" className="mt-4 max-w-2xl">
          Practical insights on Platform Engineering and DevSecOps. Full listing arrives in stage 3
          (MDX content model).
        </Text>
      </Container>
    </Section>
  );
}
