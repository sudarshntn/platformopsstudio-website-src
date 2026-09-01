import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge, Container, Heading, Image, Section, Text } from "@/components/ui";
import { getAllBlogs, getBlogBySlug } from "@/lib/content/load";
import { mdxComponents } from "@/lib/content/mdx-components";
import { mdxOptions } from "@/lib/content/mdx-options";

type Params = { slug: string };

// Only slugs returned by generateStaticParams are valid; anything else
// gets a real 404 response instead of rendering the not-found body
// under a 200 status.
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllBlogs().map((b) => ({ slug: b.frontmatter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return { title: "Not found" };
  const fm = post.frontmatter;
  return {
    title: fm.title,
    description: fm.excerpt,
    openGraph: {
      title: fm.title,
      description: fm.excerpt,
      type: "article",
      publishedTime: fm.date,
      tags: [...fm.tags],
      ...(fm.cover ? { images: [{ url: fm.cover, width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();
  const fm = post.frontmatter;

  return (
    <>
      <Section spacing="lg">
        <Container>
          <div className="max-w-3xl">
            <Text
              as="div"
              variant="small"
              className="text-primary mb-3 font-mono tracking-widest uppercase"
            >
              Blogs
            </Text>
            <Heading as="h1" level="h1">
              {fm.title}
            </Heading>
            <div className="text-muted mt-4 flex flex-wrap items-center gap-3 text-sm">
              <time dateTime={fm.date}>
                {new Date(fm.date).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
            </div>
          </div>

          {fm.cover && (
            <div className="mt-10 max-w-4xl">
              <Image
                src={fm.cover}
                alt=""
                fill
                aspect="16/9"
                radius="lg"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </div>
          )}

          {fm.mediumUrl && (
            <div className="border-border border-l-primary bg-surface mt-8 flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-lg border border-l-4 px-5 py-4">
              <Text variant="small" className="text-muted">
                This article was originally published on Medium.
              </Text>
              <a
                href={fm.mediumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-fg duration-fast inline-flex h-9 items-center justify-center rounded-md px-4 font-sans text-sm font-semibold transition-[filter] hover:brightness-110"
              >
                Read on Medium →
              </a>
            </div>
          )}

          <article className="prose mt-12">
            <MDXRemote source={post.body} components={mdxComponents} options={mdxOptions} />
          </article>

          <div className="mt-12 flex max-w-3xl flex-wrap gap-2">
            {fm.tags.map((tag) => (
              <Badge key={tag} variant="neutral">
                {tag}
              </Badge>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
