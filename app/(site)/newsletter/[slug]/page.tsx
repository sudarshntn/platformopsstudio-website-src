import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge, Container, Heading, Image, Section, Text } from "@/components/ui";
import { getAllNewsletters, getNewsletterBySlug } from "@/lib/content/load";
import { mdxComponents } from "@/lib/content/mdx-components";
import { mdxOptions } from "@/lib/content/mdx-options";

type Params = { slug: string };

// Only known slugs get a page — unknown slugs get a real 404.
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllNewsletters().map((n) => ({ slug: n.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const issue = getNewsletterBySlug(slug);
  if (!issue) return { title: "Not found" };
  const fm = issue.frontmatter;
  return {
    title: `${fm.title} — Edition ${fm.edition}`,
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

export default async function NewsletterEditionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const issue = getNewsletterBySlug(slug);
  if (!issue) notFound();
  const fm = issue.frontmatter;

  return (
    <Section spacing="lg">
      <Container>
        <div className="max-w-3xl">
          <Text
            as="div"
            variant="small"
            className="mb-3 font-mono uppercase tracking-widest text-primary"
          >
            The Platform Pulse · Edition {fm.edition}
          </Text>
          <Heading as="h1" level="h1">
            {fm.title}
          </Heading>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            <time dateTime={fm.date}>
              {new Date(fm.date).toLocaleDateString("en-US", { timeZone: "UTC", 
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span aria-hidden>·</span>
            <span>{issue.readingMinutes} min read</span>
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

        <div className="mt-8 flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-lg border border-border border-l-4 border-l-primary bg-surface px-5 py-4">
          <Text variant="small" className="text-muted">
            This issue was originally published on LinkedIn — subscribe there to get it first,
            every Monday.
          </Text>
          <a
            href={fm.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 font-sans text-sm font-semibold text-primary-fg transition-[filter] duration-fast hover:brightness-110"
          >
            Read on LinkedIn →
          </a>
        </div>

        <article className="prose mt-12">
          <MDXRemote source={issue.body} components={mdxComponents} options={mdxOptions} />
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
  );
}
