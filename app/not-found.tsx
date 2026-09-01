import NextLink from "next/link";
import { Container, Heading, Section, Text } from "@/components/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";

/**
 * App-level 404. Lives outside any route group so it must render its own
 * chrome (SkipLink + Header + Footer) — the (site) layout doesn't apply
 * to app/not-found.tsx.
 */
export default function NotFound() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1}>
        <Section spacing="lg">
          <Container>
            <Text
              as="div"
              variant="small"
              className="text-primary mb-3 font-mono tracking-widest uppercase"
            >
              404
            </Text>
            <Heading as="h1" level="h1">
              Page not found
            </Heading>
            <Text variant="muted" className="mt-4 max-w-2xl">
              The page you were looking for doesn&apos;t exist here. It may have moved, or the link
              that got you here is stale.
            </Text>
            <div className="mt-8">
              <NextLink
                href="/"
                className="bg-primary text-primary-fg duration-fast inline-flex h-10 items-center justify-center rounded-md px-4 font-sans text-base font-semibold transition-[filter] ease-out hover:brightness-110"
              >
                Take me home
              </NextLink>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
