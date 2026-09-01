import type { ReactNode } from "react";
import NextLink from "next/link";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type LinkProps = {
  readonly href: string;
  readonly children: ReactNode;
  readonly showExternalIcon?: boolean;
  readonly className?: string;
  readonly id?: string;
  readonly onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  readonly "aria-label"?: string;
};

/**
 * Isomorphic link primitive.
 *
 * - `href` starts with `/` or `#` or `?` → treated as internal, rendered
 *   with next/link (client-side navigation).
 * - Anything else (http[s]://, mailto:, tel:, etc.) → rendered as a plain
 *   `<a>`. External http(s) links additionally get `target="_blank"`,
 *   `rel="noopener"`, and a trailing external-link icon (unless
 *   `showExternalIcon={false}`).
 *
 * This centralizes the "is this internal or external?" decision so pages
 * never have to think about it.
 *
 * Props are intentionally narrow rather than spreading arbitrary anchor
 * attributes — `exactOptionalPropertyTypes` doesn't tolerate passing
 * `undefined` for optional slots on next/link. Add named props here as
 * genuine needs arise.
 */
export function Link({
  href,
  children,
  showExternalIcon = true,
  className,
  id,
  onClick,
  "aria-label": ariaLabel,
}: LinkProps) {
  const isInternal = href.startsWith("/") || href.startsWith("#") || href.startsWith("?");
  const isHttpExternal = href.startsWith("http://") || href.startsWith("https://");

  const styles = cn(
    "text-primary underline-offset-4 hover:underline decoration-2",
    "transition-colors duration-fast ease-out",
    className
  );

  const commonProps = {
    className: styles,
    ...(id !== undefined ? { id } : {}),
    ...(onClick !== undefined ? { onClick } : {}),
    ...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {}),
  };

  if (isInternal) {
    return (
      <NextLink href={href} {...commonProps}>
        {children}
      </NextLink>
    );
  }

  return (
    <a
      href={href}
      {...commonProps}
      {...(isHttpExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {isHttpExternal && showExternalIcon && (
        <>
          {" "}
          <Icon name="ExternalLink" size={14} className="inline align-baseline" />
        </>
      )}
    </a>
  );
}
