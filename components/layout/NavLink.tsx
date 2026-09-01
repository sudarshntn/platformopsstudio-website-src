"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/reduced-motion";
import { isActive, type NavItem } from "@/lib/nav";

type NavLinkProps = {
  readonly item: NavItem;
  readonly variant?: "header" | "drawer";
  readonly onNavigate?: () => void;
};

/**
 * Client-side nav link with shared-layout underline animation. The
 * underline moves smoothly between links via `layoutId="nav-underline"`.
 * Reduced motion: still shows the underline on the active item, but
 * with no `layoutId` (so it appears instantly instead of animating).
 */
export function NavLink({ item, variant = "header", onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const active = isActive(pathname, item);
  const reduced = useReducedMotion();

  const base =
    "relative font-sans font-semibold transition-colors duration-fast ease-out hover:text-primary";
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
      {active &&
        variant === "header" &&
        (reduced ? (
          <span className="bg-primary absolute inset-x-0 -bottom-1 h-0.5" />
        ) : (
          <motion.span
            layoutId="nav-underline"
            className="bg-primary absolute inset-x-0 -bottom-1 h-0.5"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        ))}
    </NextLink>
  );
}
