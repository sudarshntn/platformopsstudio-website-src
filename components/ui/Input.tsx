import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = {
  readonly id: string;
  readonly className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">;

/*
 * All form primitives share the same visual grammar: `--color-surface`
 * fill, `--color-border` border, hover raises border to primary,
 * `aria-invalid="true"` swaps border to danger. Focus ring is handled
 * globally via the `:focus-visible` selector in globals.css.
 */
export const fieldClass =
  "w-full rounded-sm border border-border bg-surface " +
  "px-3 py-2.5 font-sans text-base text-text placeholder:text-muted " +
  "transition-[border-color,box-shadow] duration-fast ease-out " +
  "hover:border-primary/70 " +
  "aria-invalid:border-danger " +
  "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border";

export function Input({ id, className, type = "text", ...rest }: InputProps) {
  return <input id={id} type={type} className={cn(fieldClass, className)} {...rest} />;
}
