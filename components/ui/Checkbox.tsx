import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CheckboxProps = {
  readonly id: string;
  readonly children: ReactNode;
  readonly className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "children" | "className">;

/*
 * Native checkbox styled via `accent-color: var(--color-primary)`. Cheap,
 * accessible, and respects the OS focus ring; the global :focus-visible
 * outline still fires for keyboard users.
 *
 * Label text is rendered inside the same `<label>` element so clicking
 * the text toggles the box — a UX affordance many custom-styled
 * checkboxes drop.
 */
export function Checkbox({ id, children, className, ...rest }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "text-text inline-flex cursor-pointer items-start gap-2 font-sans text-sm",
        "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60",
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="border-border bg-surface accent-primary mt-0.5 h-4 w-4 cursor-pointer rounded-sm border disabled:cursor-not-allowed"
        {...rest}
      />
      <span>{children}</span>
    </label>
  );
}
