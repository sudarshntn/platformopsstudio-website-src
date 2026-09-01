import NextLink from "next/link";
import { Container, Heading, Text } from "@/components/ui";
import { heroCopy } from "@/content/copy/home";

/**
 * Home hero. Two-column-ish on wide viewports (copy hugs left, the
 * gradient area breathes on the right), stacked on narrow ones.
 *
 * The full-bleed `bg-hero-gradient` div is the placeholder that
 * Stage 5's <HeroScene/> Canvas will replace. It renders behind the
 * hero copy at the same size so the LCP element (the H1) stays
 * exactly where it is when the 3D scene mounts — the swap is
 * transparent to the page layout, no CLS.
 */
export function Hero() {
  return (
    <section className="bg-bg relative isolate overflow-hidden">
      {/* Placeholder for the Stage 5 Canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_35%,color-mix(in_oklab,var(--color-primary)_22%,transparent)_0%,transparent_50%),radial-gradient(circle_at_20%_80%,color-mix(in_oklab,var(--color-accent)_16%,transparent)_0%,transparent_45%)]"
      />
      <div
        aria-hidden
        className="to-bg pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent"
      />

      <Container>
        <div className="py-20 md:py-28 lg:py-36">
          <Text
            as="div"
            variant="small"
            className="text-primary mb-4 font-mono tracking-[0.2em] uppercase"
          >
            {heroCopy.eyebrow}
          </Text>
          <Heading as="h1" level="h1" className="max-w-4xl">
            {heroCopy.headline}
          </Heading>
          <Text variant="muted" className="mt-6 max-w-2xl text-lg">
            {heroCopy.subhead}
          </Text>
          <div className="mt-10 flex flex-wrap gap-3">
            <NextLink
              href={heroCopy.primaryCta.href}
              className="bg-primary text-primary-fg duration-fast inline-flex h-12 items-center justify-center rounded-md px-6 font-sans text-base font-semibold transition-[filter] ease-out hover:brightness-110"
            >
              {heroCopy.primaryCta.label}
            </NextLink>
            <NextLink
              href={heroCopy.secondaryCta.href}
              className="border-border text-text duration-fast hover:border-primary/60 hover:bg-surface-2 inline-flex h-12 items-center justify-center rounded-md border bg-transparent px-6 font-sans text-base font-semibold transition-colors ease-out"
            >
              ✉ {heroCopy.secondaryCta.label}
            </NextLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
