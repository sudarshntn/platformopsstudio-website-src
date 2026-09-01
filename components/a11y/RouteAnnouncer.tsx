"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * SPA route-change announcer.
 *
 * Next 15's App Router already ships a built-in announcer that speaks the
 * new <title> after client navigations, but it fires only for pushState
 * transitions and it depends on the document title being set before the
 * announcement window closes. Some of our dynamic routes await data
 * before their metadata resolves, so we back it up with our own polite
 * live region that always announces the target pathname the moment the
 * URL changes.
 *
 * The initial render is skipped — the server-rendered page's <title>
 * covers first-load; announcing "loaded /blogs" for the very first paint
 * would be redundant.
 */
export function RouteAnnouncer() {
  const pathname = usePathname();
  const [message, setMessage] = useState<string>("");
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    if (!initialised) {
      setInitialised(true);
      return;
    }
    // Give Next's own announcement a beat to fire; then follow with ours
    // if the title didn't update in time.
    const timer = window.setTimeout(() => {
      const label = document.title || pathname;
      setMessage(`Navigated to ${label}`);
    }, 100);
    return () => window.clearTimeout(timer);
  }, [pathname, initialised]);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
