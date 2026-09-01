/**
 * Primary navigation. Order matters — header and mobile drawer both
 * consume this array so both stay in sync.
 *
 * `matchExact: true` keeps the /  entry from lighting up on every
 * descendant route; the others use prefix-match so /blogs/foo still
 * marks the Blogs link as current.
 */
export type NavItem = {
  readonly label: string;
  readonly href: string;
  readonly matchExact?: boolean;
};

export const primaryNav: readonly NavItem[] = [
  { label: "Home", href: "/", matchExact: true },
  { label: "Blogs", href: "/blogs" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Contact", href: "/contact" },
];

export function isActive(pathname: string, item: NavItem): boolean {
  if (item.matchExact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
