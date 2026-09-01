import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "neutral" | "primary" | "accent" | "success" | "danger";

type BadgeProps = {
  readonly children: ReactNode;
  readonly variant?: BadgeVariant;
  readonly className?: string;
};

/*
 * Badge uses solid color for status variants (success/danger) so they read
 * at a glance, and translucent-fill for informational ones (primary/accent)
 * so they don't compete with actual CTAs on the page.
 */
const variantClass: Record<BadgeVariant, string> = {
  neutral: "bg-surface-2 text-text border border-border",
  primary: "bg-primary/15 text-primary border border-primary/40",
  accent: "bg-accent/15 text-accent border border-accent/40",
  success: "bg-success/20 text-success border border-success/40",
  danger: "bg-danger/20 text-danger border border-danger/40",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-sans text-xs font-semibold",
        variantClass[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
