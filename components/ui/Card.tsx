import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  readonly children: ReactNode;
  readonly elevated?: boolean;
  readonly padding?: "sm" | "md" | "lg";
  readonly interactive?: boolean;
  readonly className?: string;
};

const paddingClass = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

/*
 * `interactive: true` opts into the hover treatment for cards that
 * wrap a link/button. Border shifts to primary/40 alpha on hover;
 * scale stays at exactly 1 per the file's "no scale > 1.01" rule
 * (I read that literally as "don't scale"; the shift is border-only).
 */
export function Card({
  children,
  elevated = false,
  padding = "md",
  interactive = false,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "border-border duration-fast rounded-lg border transition-colors ease-out",
        elevated ? "bg-surface-2 shadow-md" : "bg-surface",
        interactive && "hover:border-primary/40",
        paddingClass[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
