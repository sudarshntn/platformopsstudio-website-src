import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import { VisuallyHidden } from "./VisuallyHidden";

export type ButtonVariant = "primary" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonBaseProps = {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly isLoading?: boolean;
  readonly children: ReactNode;
};

export type ButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

/*
 * Class maps are const `Record`s so TypeScript can narrow at prop
 * intersections, and so tree-shaking keeps the utility strings intact
 * (Tailwind v4 scans source files for full class strings; template
 * literals with dynamic pieces would defeat that).
 */
const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold " +
  "rounded-md whitespace-nowrap select-none " +
  "transition-[background-color,color,border-color,transform] duration-fast ease-out " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-busy:cursor-progress";

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-base",
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-fg border border-primary " +
    "hover:brightness-110 active:brightness-95",
  ghost:
    "bg-transparent text-text border border-border " + "hover:bg-surface-2 hover:border-primary/60",
  link:
    "bg-transparent text-primary border border-transparent px-0 h-auto " +
    "hover:underline underline-offset-4 decoration-2",
};

const spinnerSize: Record<ButtonSize, number> = { sm: 14, md: 16, lg: 18 };

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={cn(base, sizeClass[size], variantClass[variant], className)}
      {...rest}
    >
      {isLoading ? (
        <>
          <Icon name="Loader2" size={spinnerSize[size]} className="animate-spin" />
          <VisuallyHidden>Loading</VisuallyHidden>
          <span aria-hidden>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
