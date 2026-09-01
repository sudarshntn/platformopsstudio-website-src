import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";

/**
 * Chrome shared by every marketing/content page: skip-link, sticky
 * header, main landmark, footer. The QA `/design` route sits outside
 * this group (in the sibling `(design)` group) so it renders naked.
 */
export default function SiteLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="min-h-[calc(100vh-9rem)]">
        {children}
      </main>
      <Footer />
    </>
  );
}
