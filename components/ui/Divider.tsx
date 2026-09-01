import { cn } from "@/lib/cn";

type DividerProps = {
  readonly decorative?: boolean;
  readonly className?: string;
};

/**
 * Purely decorative horizontal rule by default — screen readers skip it.
 * Pass `decorative={false}` when the divider carries semantic meaning
 * (rare — usually only when separating unrelated content sections at the
 * page level).
 */
export function Divider({ decorative = true, className }: DividerProps) {
  return (
    <hr
      className={cn("border-border my-6 border-0 border-t", className)}
      {...(decorative ? { role: "presentation" } : {})}
    />
  );
}
