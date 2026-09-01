import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldErrorProps = {
  readonly id: string;
  readonly children: ReactNode;
  readonly className?: string;
};

/**
 * Inline validation message. Renders as `role="alert"` so assistive tech
 * announces the error the moment it appears. The `id` must be referenced
 * by the associated input via `aria-describedby`.
 */
export function FieldError({ id, children, className }: FieldErrorProps) {
  return (
    <p id={id} role="alert" className={cn("text-danger mt-1.5 font-sans text-sm", className)}>
      {children}
    </p>
  );
}
