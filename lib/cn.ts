/**
 * Tiny className joiner. Accepts strings, undefined, false, and null;
 * skips falsy values, joins the rest with a single space, dedupes runs of
 * whitespace.
 *
 * We deliberately do NOT reach for `clsx` or `tailwind-merge` at this
 * stage — the primitives keep their variant styling in `const` maps that
 * yield exactly one utility per prop dimension, so class collisions don't
 * happen. If a later stage introduces prop-driven overrides that DO
 * collide (e.g., allowing arbitrary `className` extensions on Button),
 * revisit and add `tailwind-merge`.
 */
export function cn(...classes: ReadonlyArray<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}
