import { describe, expect, it } from "vitest";
import { article, breadcrumb, contactPage, jsonLdScript, person, website } from "@/lib/jsonld";

describe("lib/jsonld builders", () => {
  it("emits valid person schema", () => {
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBeTruthy();
  });

  it("emits valid website schema", () => {
    expect(website["@type"]).toBe("WebSite");
    expect(website.url).toMatch(/^https?:\/\//);
  });

  it("builds an article payload", () => {
    const a = article({
      headline: "Test",
      description: "d",
      datePublished: "2026-01-01",
      url: "https://example.com/x",
      tags: ["a"],
    });
    expect(a["@type"]).toBe("Article");
    expect(a.headline).toBe("Test");
  });

  it("builds a breadcrumb list", () => {
    const b = breadcrumb([
      { name: "Home", url: "https://example.com/" },
      { name: "Blogs", url: "https://example.com/blogs" },
    ]);
    expect(b["@type"]).toBe("BreadcrumbList");
    expect(b.itemListElement).toHaveLength(2);
    expect(b.itemListElement[0]?.position).toBe(1);
  });

  it("exposes contactPage builder", () => {
    expect(contactPage["@type"]).toBe("ContactPage");
  });

  it("escapes closing script tags in json-ld string", () => {
    const injected = jsonLdScript({
      "@context": "https://schema.org",
      "@type": "Test",
      note: "</script><script>alert(1)</script>",
    });
    expect(injected).not.toContain("</script>");
  });
});
