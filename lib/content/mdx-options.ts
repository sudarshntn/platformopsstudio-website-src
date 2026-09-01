import rehypePrettyCode from "rehype-pretty-code";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";

const prettyCodeOptions: PrettyCodeOptions = {
  // Dark theme baseline — light mode override lives in globals.css.
  // rehype-pretty-code can emit both light + dark spans via a theme
  // object mapping, but a single dark baseline keeps the emitted HTML
  // small and matches our dark-first design.
  theme: "github-dark-default",
  keepBackground: false,
  defaultLang: "plaintext",
};

/**
 * Shared MDXRemote serialize/render options — imported by both the
 * blog and newsletter detail routes so highlighting stays consistent.
 *
 * The plugin-list type coerces to `any` because next-mdx-remote/rsc
 * expects unified's Pluggable[] and pulling that type through would
 * add a devDep for a single opaque handoff. The wrapper module is the
 * only place this cast lives.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PluginList = any[];

export const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [] as PluginList,
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]] as PluginList,
  },
};
