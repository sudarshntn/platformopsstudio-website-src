"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { isActive, type NavItem } from "@/lib/nav";

type NavLinkProps = {
  readonly item: NavItem;
  readonly variant?: "header" | "drawer";
  readonly onNavigate?: () => void;
};

/**
 * Client-side nav link. Reads the current pathname and sets
 * `aria-current="page"` + active styling when it matches. The
 * `variant` prop drives spacing/type-size differences between the
 * header row and the mobile drawer without duplicating the active-state
 * logic.
 */
export function NavLink({ item, variant = "header", onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const active = isActive(pathname, item);

  const base =
    "font-sans font-semibold transition-colors duration-fast ease-out " + "hover:text-primary";
  const variantClass =
    variant === "header"
      ? "text-sm text-text py-2"
      : "text-2xl text-text py-4 border-b border-border";
  const activeClass = active ? "text-primary" : "";

  return (
    <NextLink
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(base, variantClass, activeClass)}
      {...(onNavigate !== undefined ? { onClick: onNavigate } : {})}
    >
      {item.label}
    </NextLink>
  );
}
