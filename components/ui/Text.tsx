import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TextVariant = "body" | "small" | "muted";
type TextAs = "p" | "span" | "div";

type TextProps = {
  readonly children: ReactNode;
  readonly variant?: TextVariant;
  readonly as?: TextAs;
  readonly className?: string;
};

const variantClass: Record<TextVariant, string> = {
  body: "text-[length:var(--text-body)] leading-[var(--leading-body)] text-text",
  small: "text-[length:var(--text-small)] leading-[var(--leading-body)] text-text",
  muted: "text-[length:var(--text-body)] leading-[var(--leading-body)] text-muted",
};

export function Text({ children, variant = "body", as = "p", className }: TextProps) {
  const Component = as;
  return (
    <Component className={cn("font-sans", variantClass[variant], className)}>{children}</Component>
  );
}
