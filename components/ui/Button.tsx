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
 * Stage 6 polish: filled variants get a 1px hover-lift + shadow bump,
 * active state presses back to 0. Uses transform+shadow only per the
 * file's "never animate width/height/top/left" rule. Motion honors
 * the global prefers-reduced-motion media query in globals.css that
 * zeros out transitions.
 */
const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold " +
  "rounded-md whitespace-nowrap select-none " +
  "transition-[background-color,color,border-color,transform,box-shadow] " +
  "duration-fast ease-out " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none " +
  "aria-busy:cursor-progress";

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-base",
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-fg border border-primary shadow-sm " +
    "hover:brightness-110 hover:-translate-y-px hover:shadow-lg " +
    "active:translate-y-0 active:shadow-md active:brightness-95",
  ghost:
    "bg-transparent text-text border border-border " +
    "hover:bg-surface-2 hover:border-primary/60 hover:-translate-y-px " +
    "active:translate-y-0",
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
