import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionSpacing = "sm" | "md" | "lg";
type SectionSurface = "bg" | "surface" | "surface-2";

type SectionProps = {
  readonly children: ReactNode;
  readonly spacing?: SectionSpacing;
  readonly surface?: SectionSurface;
  readonly bleed?: boolean;
  readonly className?: string;
  readonly id?: string;
  readonly ariaLabelledby?: string;
};

const spacingClass: Record<SectionSpacing, string> = {
  sm: "py-10 md:py-12",
  md: "py-16 md:py-20",
  lg: "py-20 md:py-28",
};

const surfaceClass: Record<SectionSurface, string> = {
  bg: "bg-bg text-text",
  surface: "bg-surface text-text",
  "surface-2": "bg-surface-2 text-text",
};

/**
 * Vertical rhythm container. Wraps children in a `<Container>` by default
 * so section-level composition doesn't have to remember to do it.
 *
 * `bleed` disables the container wrapping — for full-bleed elements like
 * a hero image or a 3D scene that need to reach viewport edges.
 */
export function Section({
  children,
  spacing = "md",
  surface = "bg",
  bleed = false,
  className,
  id,
  ariaLabelledby,
}: SectionProps) {
  return (
    <section
      className={cn(spacingClass[spacing], surfaceClass[surface], className)}
      {...(id !== undefined ? { id } : {})}
      {...(ariaLabelledby !== undefined ? { "aria-labelledby": ariaLabelledby } : {})}
    >
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}
