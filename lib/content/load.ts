import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { ZodTypeAny } from "zod";
import {
  BlogFrontmatter,
  LegalFrontmatter,
  NewsletterFrontmatter,
  type LoadedBlog,
  type LoadedLegal,
  type LoadedNewsletter,
} from "./schema";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const NEWSLETTER_DIR = path.join(process.cwd(), "content", "newsletter");
const LEGAL_DIR = path.join(process.cwd(), "content", "legal");

/**
 * Read every .mdx file in `dir`, parse frontmatter, validate against
 * `schema`, and return typed loaded items. Sorted newest first.
 *
 * Any zod validation error is thrown with the filename in the message
 * so `pnpm build` (which invokes generateStaticParams which invokes
 * this) surfaces exactly which file broke.
 */
function loadAll<T>(
  dir: string,
  schema: ZodTypeAny
): ReadonlyArray<{
  frontmatter: T;
  body: string;
  readingMinutes: number;
}> {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const items = files.map((filename) => {
    const raw = fs.readFileSync(path.join(dir, filename), "utf8");
    const parsed = matter(raw);
    const result = schema.safeParse(parsed.data);
    if (!result.success) {
      const first = result.error.issues[0];
      const pathStr = first?.path?.join(".") ?? "(unknown)";
      const msg = first?.message ?? "invalid frontmatter";
      throw new Error(`[content] ${filename}: frontmatter.${pathStr} — ${msg}`);
    }
    return {
      frontmatter: result.data as T,
      body: parsed.content,
      readingMinutes: Math.max(1, Math.round(readingTime(parsed.content).minutes)),
    };
  });

  // Sort newest first by frontmatter.date (both schemas expose it).
  return items.sort((a, b) => {
    const da = new Date((a.frontmatter as { date: string }).date).getTime();
    const db = new Date((b.frontmatter as { date: string }).date).getTime();
    return db - da;
  });
}

export function getAllBlogs(): ReadonlyArray<LoadedBlog> {
  return loadAll(BLOG_DIR, BlogFrontmatter) as ReadonlyArray<LoadedBlog>;
}

export function getBlogBySlug(slug: string): LoadedBlog | null {
  return getAllBlogs().find((b) => b.frontmatter.slug === slug) ?? null;
}

export function getAllNewsletters(): ReadonlyArray<LoadedNewsletter> {
  return loadAll(NEWSLETTER_DIR, NewsletterFrontmatter) as ReadonlyArray<LoadedNewsletter>;
}

export function getNewsletterBySlug(slug: string): LoadedNewsletter | null {
  return getAllNewsletters().find((n) => n.frontmatter.slug === slug) ?? null;
}

/**
 * Load one legal-page MDX by basename (e.g. "privacy-policy" →
 * content/legal/privacy-policy.mdx). Returns null when the file
 * doesn't exist — callers 404.
 */
export function getLegalPage(basename: string): LoadedLegal | null {
  const filePath = path.join(LEGAL_DIR, `${basename}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const result = LegalFrontmatter.safeParse(parsed.data);
  if (!result.success) {
    const first = result.error.issues[0];
    const pathStr = first?.path?.join(".") ?? "(unknown)";
    const msg = first?.message ?? "invalid frontmatter";
    throw new Error(`[content] ${basename}.mdx: frontmatter.${pathStr} — ${msg}`);
  }
  return {
    frontmatter: result.data,
    body: parsed.content,
    readingMinutes: Math.max(1, Math.round(readingTime(parsed.content).minutes)),
  };
}
