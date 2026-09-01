import * as LucideIcons from "lucide-react";

type LucideIconName = keyof {
  [K in keyof typeof LucideIcons as (typeof LucideIcons)[K] extends React.ComponentType<never>
    ? K
    : never]: unknown;
};

type IconBaseProps = {
  readonly name: LucideIconName;
  readonly size?: number;
  readonly strokeWidth?: number;
  readonly className?: string;
};

type LabeledIconProps = IconBaseProps & { readonly label: string };
type DecorativeIconProps = IconBaseProps & { readonly label?: undefined };

export type IconProps = LabeledIconProps | DecorativeIconProps;

/**
 * Thin, accessible wrapper over lucide-react.
 *
 * - No `label`  → decorative. Rendered with `aria-hidden="true"`.
 * - With `label` → semantic. Rendered with `role="img"` and the label
 *   becomes the accessible name.
 *
 * This is the ONLY icon primitive in the codebase. Don't import lucide
 * icons directly from anywhere else — routing everything through here
 * guarantees the a11y wiring is consistent.
 */
export function Icon({ name, size = 20, strokeWidth = 1.75, className, label }: IconProps) {
  const Component = LucideIcons[name] as React.ComponentType<{
    size: number;
    strokeWidth: number;
    className?: string;
    "aria-hidden"?: boolean;
    role?: string;
    "aria-label"?: string;
  }>;

  if (!Component) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Icon] Unknown lucide icon name: "${String(name)}"`);
    }
    return null;
  }

  if (label !== undefined) {
    return (
      <Component
        size={size}
        strokeWidth={strokeWidth}
        {...(className !== undefined ? { className } : {})}
        role="img"
        aria-label={label}
      />
    );
  }

  return (
    <Component
      size={size}
      strokeWidth={strokeWidth}
      {...(className !== undefined ? { className } : {})}
      aria-hidden
    />
  );
}
