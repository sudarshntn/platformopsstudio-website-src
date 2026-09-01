import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = {
  readonly as: HeadingLevel;
  /** Visual size — decoupled from `as` so semantics can be h2 with h4 sizing, etc. */
  readonly level?: HeadingLevel;
  readonly children: ReactNode;
  readonly className?: string;
  readonly id?: string;
};

const sizeClass: Record<HeadingLevel, string> = {
  h1: "text-[length:var(--text-h1)] leading-[var(--leading-display)] font-display font-bold tracking-tight",
  h2: "text-[length:var(--text-h2)] leading-[var(--leading-display)] font-display font-bold tracking-tight",
  h3: "text-[length:var(--text-h3)] leading-[var(--leading-heading)] font-sans font-semibold",
  h4: "text-[length:var(--text-h4)] leading-[var(--leading-heading)] font-sans font-semibold",
  h5: "text-[length:var(--text-h5)] leading-[var(--leading-heading)] font-sans font-semibold",
  h6: "text-[length:var(--text-h6)] leading-[var(--leading-heading)] font-sans font-semibold uppercase tracking-wider",
};

/**
 * `as` = the semantic HTML level (heading landmark structure for a11y).
 * `level` = the visual size, defaults to same as `as`. Decouple them
 * whenever a lower-priority heading (e.g. a sidebar sub-heading) needs
 * to look small but still slot into the document outline correctly.
 */
export function Heading({ as, level, children, className, id }: HeadingProps) {
  const Component = as;
  const visualLevel = level ?? as;
  return (
    <Component
      className={cn("text-text", sizeClass[visualLevel], className)}
      {...(id !== undefined ? { id } : {})}
    >
      {children}
    </Component>
  );
}
