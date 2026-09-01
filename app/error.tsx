"use client";

import { useEffect } from "react";
import NextLink from "next/link";
import { Button, Container, Heading, Section, Text } from "@/components/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";

/**
 * App-level error boundary. Client component per Next.js's requirement.
 *
 * `reset` re-runs the segment that threw. `error.digest` is the
 * production-only hash Next assigns so the exact stack can be looked up
 * server-side (we surface it in small text for support-ticket triage —
 * users can copy-paste it).
 */
export default function GlobalError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    // Log to observability once wired (stage 12+). For now, console keeps
    // the failure visible in dev.
    console.error("[app error]", error);
  }, [error]);

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
              className="text-danger mb-3 font-mono tracking-widest uppercase"
            >
              Something went wrong
            </Text>
            <Heading as="h1" level="h1">
              We hit an unexpected error
            </Heading>
            <Text variant="muted" className="mt-4 max-w-2xl">
              Try again — most transient issues clear on retry. If it keeps happening,{" "}
              <NextLink href="/contact" className="text-primary underline-offset-4 hover:underline">
                let me know
              </NextLink>{" "}
              and I&apos;ll take a look.
            </Text>
            {error.digest && (
              <Text variant="small" className="text-muted mt-6 font-mono">
                Reference: {error.digest}
              </Text>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="primary" onClick={reset}>
                Try again
              </Button>
              <NextLink
                href="/"
                className="border-border text-text duration-fast hover:border-primary/60 hover:bg-surface-2 inline-flex h-10 items-center justify-center rounded-md border bg-transparent px-4 font-sans text-base font-semibold transition-colors ease-out"
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
