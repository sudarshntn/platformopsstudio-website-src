import NextLink from "next/link";
import { Container, Heading, Text } from "@/components/ui";
import { subscribeCopy } from "@/content/copy/home";

/**
 * Full-bleed accent band CTA — the "subscribe to advanced content"
 * moment in the current site's flow. Solid --color-primary background
 * so it visually separates from the surrounding surface tiers.
 */
export function Subscribe() {
  return (
    <section className="bg-primary text-primary-fg" aria-labelledby="subscribe-heading">
      <Container>
        <div className="mx-auto max-w-3xl py-16 text-center md:py-20">
          <Heading as="h2" level="h2" id="subscribe-heading" className="text-primary-fg">
            {subscribeCopy.heading}
          </Heading>
          <Text className="text-primary-fg/85 mx-auto mt-4 max-w-2xl">{subscribeCopy.body}</Text>
          <NextLink
            href={subscribeCopy.cta.href}
            className="border-primary-fg/90 text-primary-fg duration-fast hover:bg-primary-fg hover:text-primary mt-8 inline-flex h-12 items-center justify-center rounded-md border-2 bg-transparent px-6 font-sans text-base font-semibold transition-colors ease-out"
          >
            {subscribeCopy.cta.label}
          </NextLink>
        </div>
      </Container>
    </section>
  );
}
