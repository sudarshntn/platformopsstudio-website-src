import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Container, Heading, Image, Section, Text } from "@/components/ui";
import { getAllBlogs } from "@/lib/content/load";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Practical writing on Platform Engineering and DevSecOps — 14 posts, several cross-posted from Medium.",
};

// ISR — rebuild the list at most once an hour so a new MDX file picked
// up between deploys still surfaces without a full site rebuild.
export const revalidate = 3600;

export default function BlogsPage() {
  const posts = getAllBlogs();

  return (
    <Section spacing="lg">
      <Container>
        <Heading as="h1" level="h1">
          Blogs
        </Heading>
        <Text variant="muted" className="mt-4 max-w-2xl">
          Practical insights on Platform Engineering, DevSecOps, GitOps, and cloud-native
          architecture. Reading times shown per post.
        </Text>

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const fm = post.frontmatter;
            return (
              <li key={fm.slug}>
                <Link
                  href={`/blogs/${fm.slug}`}
                  className="group border-border bg-surface duration-fast hover:border-primary/60 flex h-full flex-col overflow-hidden rounded-lg border transition-colors"
                >
                  {fm.cover ? (
                    <Image
                      src={fm.cover}
                      alt=""
                      fill
                      aspect="16/9"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="from-surface-2 via-surface to-primary/20 aspect-[16/9] bg-gradient-to-br" />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="text-muted mb-2 flex items-center gap-2 text-sm">
                      <time dateTime={fm.date}>
                        {new Date(fm.date).toLocaleDateString("en-US", {
                          timeZone: "UTC",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      <span aria-hidden>·</span>
                      <span>{post.readingMinutes} min read</span>
                    </div>
                    <Heading as="h2" level="h4" className="group-hover:text-primary mb-2">
                      {fm.title}
                    </Heading>
                    <Text variant="small" className="text-muted flex-1">
                      {fm.excerpt}
                    </Text>
                    {fm.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {fm.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="neutral">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
