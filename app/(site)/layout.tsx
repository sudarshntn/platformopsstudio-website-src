import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { LenisProvider } from "@/components/scroll/LenisProvider";
import { RouteAnnouncer } from "@/components/a11y/RouteAnnouncer";
import { CookieBanner } from "@/components/consent/CookieBanner";

/**
 * Chrome shared by every marketing/content page: skip-link, sticky
 * header, main landmark, footer, all wrapped in the Lenis smooth-
 * scroll provider (which no-ops for reduced motion + iOS). The QA
 * `/design` route sits outside this group so it renders naked.
 */
export default function SiteLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <LenisProvider>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="min-h-[calc(100vh-9rem)]">
        {children}
      </main>
      <Footer />
      <RouteAnnouncer />
      <CookieBanner />
    </LenisProvider>
  );
}
