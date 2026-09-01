import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  readonly children: ReactNode;
  readonly elevated?: boolean;
  readonly padding?: "sm" | "md" | "lg";
  readonly className?: string;
};

const paddingClass = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

export function Card({ children, elevated = false, padding = "md", className }: CardProps) {
  return (
    <div
      className={cn(
        "border-border rounded-lg border",
        elevated ? "bg-surface-2 shadow-md" : "bg-surface",
        paddingClass[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
