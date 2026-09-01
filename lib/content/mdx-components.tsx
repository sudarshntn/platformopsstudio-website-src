import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Heading, Link, Text } from "@/components/ui";
import type { HeadingProps as PrimHeadingProps } from "@/components/ui";

/**
 * MDX element → design-system primitive map. Applied via
 * next-mdx-remote's `components` prop; every blog and newsletter body
 * inherits token-driven styling without per-page work.
 *
 * MDX bodies should NEVER contain an h1 (each article/edition has
 * exactly one, rendered by the page shell). h1 → Heading h2 is
 * defensive so a stray h1 doesn't collapse unstyled.
 */

type MdxHeadingProps = { children?: ReactNode; id?: string };

function makeHeading(as: PrimHeadingProps["as"], level: NonNullable<PrimHeadingProps["level"]>) {
  return function MdxHeading({ children, id }: MdxHeadingProps) {
    return (
      <Heading as={as} level={level} {...(id !== undefined ? { id } : {})}>
        {children}
      </Heading>
    );
  };
}

type AnchorProps = ComponentPropsWithoutRef<"a">;
type ParaProps = ComponentPropsWithoutRef<"p">;
type CodeProps = ComponentPropsWithoutRef<"code">;

export const mdxComponents = {
  h1: makeHeading("h2", "h2"),
  h2: makeHeading("h2", "h2"),
  h3: makeHeading("h3", "h3"),
  h4: makeHeading("h4", "h4"),
  h5: makeHeading("h5", "h5"),
  h6: makeHeading("h6", "h6"),
  p: ({ children }: ParaProps) => <Text>{children}</Text>,
  a: ({ href, children }: AnchorProps) => {
    if (!href) return <>{children}</>;
    return <Link href={href}>{children}</Link>;
  },
  code: ({ children, className }: CodeProps) => (
    <code
      className={
        className
          ? className
          : "bg-surface-2 text-text rounded px-1.5 py-0.5 font-mono text-[0.9em]"
      }
    >
      {children}
    </code>
  ),
};
