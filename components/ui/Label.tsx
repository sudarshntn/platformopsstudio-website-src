import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type LabelProps = {
  readonly htmlFor: string;
  readonly children: ReactNode;
  readonly required?: boolean;
  readonly className?: string;
} & Omit<LabelHTMLAttributes<HTMLLabelElement>, "htmlFor" | "children" | "className">;

/**
 * Form label. Required fields get an accessible red asterisk that is
 * announced by screen readers as "required" via aria-hidden text +
 * visible marker.
 */
export function Label({ htmlFor, children, required = false, className, ...rest }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("text-text mb-1.5 block font-sans text-sm font-semibold", className)}
      {...rest}
    >
      {children}
      {required && (
        <>
          {" "}
          <span aria-hidden className="text-danger">
            *
          </span>
          <span className="sr-only"> required</span>
        </>
      )}
    </label>
  );
}
