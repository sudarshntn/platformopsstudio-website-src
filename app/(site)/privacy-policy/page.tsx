import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Container, Heading, Section, Text } from "@/components/ui";
import { getLegalPage } from "@/lib/content/load";
import { mdxComponents } from "@/lib/content/mdx-components";
import { mdxOptions } from "@/lib/content/mdx-options";

export const metadata: Metadata = {
  title: "Privacy & Cookies Policy",
  description: "How PlatformOpsStudio handles information collected via the site.",
};

export default function PrivacyPolicyPage() {
  const page = getLegalPage("privacy-policy");
  if (!page) notFound();
  const fm = page.frontmatter;
  return (
    <Section spacing="lg">
      <Container>
        <div className="max-w-3xl">
          <Heading as="h1" level="h1">
            {fm.title}
          </Heading>
          <Text variant="small" className="text-muted mt-3">
            Last updated{" "}
            <time dateTime={fm.updated}>
              {new Date(fm.updated).toLocaleDateString("en-US", {
                timeZone: "UTC",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </Text>
          <article className="prose mt-8">
            <MDXRemote source={page.body} components={mdxComponents} options={mdxOptions} />
          </article>
        </div>
      </Container>
    </Section>
  );
}
