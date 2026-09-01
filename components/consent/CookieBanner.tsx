"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { Button } from "@/components/ui";
import { getConsent, setConsent } from "@/lib/consent";

/**
 * Cookie / analytics-consent banner.
 *
 * State machine — three positions:
 *   - hidden (initial render, before hydration & preference read)
 *   - visible (no stored preference; user hasn't chosen)
 *   - hidden (preference stored, or user just clicked accept/decline)
 *
 * A "manage-cookies" event on window re-opens the banner — the footer's
 * "Cookie preferences" link dispatches this so users can revise their
 * choice at any time.
 *
 * We deliberately do NOT load analytics on accept today. The site
 * ships zero third-party scripts. This banner exists so that when we
 * eventually opt into analytics, the plumbing is already in place and
 * the consent record has been kept from day one — the spec's
 * "if desired" trigger. See docs/consent.md.
 */
export function CookieBanner() {
  const [state, setState] = useState<"hidden" | "visible">("hidden");
  const declineRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (getConsent() === null) setState("visible");
    const onManage = () => setState("visible");
    window.addEventListener("manage-cookies", onManage);
    return () => window.removeEventListener("manage-cookies", onManage);
  }, []);

  useEffect(() => {
    if (state === "visible") {
      // Focus the decline button (safer default) once shown, so
      // keyboard users can act immediately.
      setTimeout(() => declineRef.current?.focus(), 50);
    }
  }, [state]);

  if (state === "hidden") return null;

  const accept = () => {
    setConsent("accepted");
    setState("hidden");
  };
  const decline = () => {
    setConsent("declined");
    setState("hidden");
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-desc"
      className="border-border bg-surface fixed inset-x-3 bottom-3 z-40 rounded-lg border p-5 shadow-lg backdrop-blur md:right-4 md:bottom-4 md:left-auto md:max-w-md"
    >
      <p id="consent-title" className="font-display text-text text-sm font-bold">
        Cookie preferences
      </p>
      <p id="consent-desc" className="text-muted mt-2 text-sm">
        This site sets one essential preference in your browser and loads no analytics or
        advertising scripts today. Choose whether we can load privacy-respecting analytics in the
        future — we won&apos;t change this without asking again.{" "}
        <NextLink href="/privacy-policy" className="text-primary underline underline-offset-4">
          Privacy policy
        </NextLink>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" size="sm" onClick={accept}>
          Accept
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={decline}
          {...({ ref: declineRef } as unknown as { ref?: React.Ref<HTMLButtonElement> })}
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
