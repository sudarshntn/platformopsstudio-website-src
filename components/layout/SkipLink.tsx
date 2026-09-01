/**
 * WCAG 2.4.1 — Bypass Blocks. Keyboard users hitting Tab from the URL bar
 * get this as the first focusable element; activating it jumps focus to
 * <main id="main">, skipping the header nav.
 *
 * The link is visually hidden until focused. On focus, it lifts into the
 * top-left corner in the accent color with the standard focus ring the
 * design system applies globally.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="focus:bg-primary focus:text-primary-fg sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-semibold focus:shadow-lg"
    >
      Skip to content
    </a>
  );
}
