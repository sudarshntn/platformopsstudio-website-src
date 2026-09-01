import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

/**
 * Max-width wrapper capped at --container-max (1120px). Uses
 * responsive `padding-inline` so content never touches the viewport
 * edge — 24px on mobile, 40px on tablet+.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[var(--container-max)] px-6 md:px-10", className)}>
      {children}
    </div>
  );
}
