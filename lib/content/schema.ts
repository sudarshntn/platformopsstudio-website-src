import { z } from "zod";

/**
 * Frontmatter contracts for MDX content. Validated at build time by
 * the loaders in ./load.ts — an invalid or missing field fails the
 * build with a clear zod message pointing at the file.
 */

/*
 * YAML 1.1 auto-parses bare `YYYY-MM-DD` into a JS Date via
 * gray-matter → js-yaml. We accept either a Date or a string and
 * normalize to an ISO-8601 string so consumers can use it with
 * `<time dateTime={fm.date}>` without runtime shape checks.
 */
const isoDate = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v))
  .refine((v) => !Number.isNaN(Date.parse(v)), {
    message: "date must be ISO-8601 parseable (YYYY-MM-DD or full ISO string)",
  });

export const BlogFrontmatter = z.object({
  title: z.string().min(3),
  date: isoDate,
  excerpt: z.string().min(20).max(300),
  tags: z.array(z.string()).min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be lowercase-kebab (a-z, 0-9, hyphens)"),
  cover: z.string().optional(),
  /** Optional cross-post — Medium URL for articles that first appeared there. */
  mediumUrl: z.string().url().optional(),
});

export type BlogFrontmatter = z.infer<typeof BlogFrontmatter>;

export const NewsletterFrontmatter = z.object({
  title: z.string().min(3),
  edition: z.number().int().positive(),
  date: isoDate,
  excerpt: z.string().min(20).max(300),
  tags: z.array(z.string()).min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be lowercase-kebab (a-z, 0-9, hyphens)"),
  cover: z.string().optional(),
  /** LinkedIn Pulse URL — every Platform Pulse issue originates on LinkedIn. */
  linkedInUrl: z.string().url(),
});

export type NewsletterFrontmatter = z.infer<typeof NewsletterFrontmatter>;

/**
 * Common shape returned by loaders — frontmatter plus derived fields
 * (reading time in minutes, raw MDX body). Pages read from this, not
 * from the file system directly.
 */
export type LoadedItem<T> = {
  readonly frontmatter: T;
  readonly body: string;
  readonly readingMinutes: number;
};

export type LoadedBlog = LoadedItem<BlogFrontmatter>;
export type LoadedNewsletter = LoadedItem<NewsletterFrontmatter>;

/**
 * Legal-page frontmatter: title + a plain `updated` date string. Legal
 * copy is short and rarely revised, so no tags/excerpt/cover here —
 * every extra field is one more thing that can rot.
 */
export const LegalFrontmatter = z.object({
  title: z.string().min(3),
  updated: isoDate,
});

export type LegalFrontmatter = z.infer<typeof LegalFrontmatter>;
export type LoadedLegal = LoadedItem<LegalFrontmatter>;
