"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { Button, Icon, Image, VisuallyHidden } from "@/components/ui";
import { primaryNav } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { NavLink } from "./NavLink";
import { MobileNav } from "./MobileNav";

/**
 * Sticky top-of-page header.
 *
 * Scroll-state transition uses an IntersectionObserver on a 1px sentinel
 * placed above the header — when the sentinel leaves the viewport we
 * know we've scrolled past the top and can add the backdrop-blur
 * background. This is intentionally NOT a scroll listener: IO fires
 * only on state change, not every scroll frame.
 *
 * No layout shift on state change: the header keeps a fixed height and
 * only the background + border change. Everything on the header row
 * (logo, nav, CTA) stays in the same box.
 */
export function Header() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!(entry?.isIntersecting ?? true));
      },
      { threshold: 0 }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* 1px sentinel above the header. When it leaves the viewport,
          the header enters "scrolled" state. */}
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      <header
        className={cn(
          "duration-base sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] ease-out",
          scrolled
            ? "border-border bg-bg/80 border-b backdrop-blur-md"
            : "bg-bg border-b border-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center justify-between gap-4 px-6 md:h-20 md:px-10">
          {/* Brand */}
          <NextLink
            href="/"
            className="flex items-center gap-2"
            aria-label="PlatformOpsStudio, home"
          >
            <Image src="/assets/img/logo.png" alt="" width={42} height={25} priority />
            <span className="font-display text-text text-base font-bold md:text-lg">
              PlatformOpsStudio
            </span>
          </NextLink>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} variant="header" />
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                window.location.href = "/contact";
              }}
              className="hidden md:inline-flex"
            >
              Learn With Me
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="border-border text-text hover:border-primary/60 inline-flex h-10 w-10 items-center justify-center rounded-md border bg-transparent md:hidden"
              aria-haspopup="dialog"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <Icon name="Menu" size={22} />
              <VisuallyHidden>Open navigation</VisuallyHidden>
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
