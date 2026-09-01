import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { fieldClass } from "./Input";

type TextareaProps = {
  readonly id: string;
  readonly className?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">;

export function Textarea({ id, className, rows = 5, ...rest }: TextareaProps) {
  return (
    <textarea
      id={id}
      rows={rows}
      className={cn(fieldClass, "min-h-[120px] resize-y", className)}
      {...rest}
    />
  );
}
