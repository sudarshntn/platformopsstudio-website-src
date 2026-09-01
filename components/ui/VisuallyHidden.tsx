/**
 * Visually hides content while keeping it available to assistive tech.
 * Uses the WHATWG/HTML5 Boilerplate `.sr-only` pattern (identical to
 * Tailwind's built-in `sr-only` utility, but exposed as a component so
 * consumers get a semantically-clear name).
 */
export function VisuallyHidden({ children }: { readonly children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
