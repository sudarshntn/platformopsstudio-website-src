import NextLink from "next/link";
import { Container, Heading, Text } from "@/components/ui";
import { HeroScene } from "@/components/three/HeroScene";
import { heroCopy } from "@/content/copy/home";

/**
 * Home hero. Full-bleed 3D scene behind the copy, always readable
 * because a top-to-bottom gradient overlay fades the scene edges into
 * the page background.
 *
 * The Canvas inside <HeroScene/> is lazily mounted (idle + in-view +
 * WebGL available + not reduced-motion) and pauses its render loop
 * when the tab is hidden. See components/three/HeroScene.tsx for the
 * gating logic. It renders inside the same absolute-positioned box as
 * the static gradient below, so the LCP element (the H1) never moves
 * on Canvas swap-in — zero CLS.
 */
export function Hero() {
  return (
    <section className="bg-bg relative isolate overflow-hidden">
      {/* Static token-colored radial glow behind everything —
          renders in the initial paint, no JS required. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_35%,color-mix(in_oklab,var(--color-primary)_22%,transparent)_0%,transparent_50%),radial-gradient(circle_at_20%_80%,color-mix(in_oklab,var(--color-accent)_16%,transparent)_0%,transparent_45%)]"
      />

      {/* 3D scene layer (client-only, lazy). */}
      <HeroScene />

      {/* Bottom-fade overlay so the scene blends into the About
          section that follows without a hard edge. */}
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
