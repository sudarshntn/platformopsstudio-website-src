# PlatformOpsStudio — Discovery (stage 0)

Snapshot of the live static site at [platformopsstudio.com](https://platformopsstudio.com) as
of **1 September 2026**, captured before the Next.js 15 rebuild begins. This document is the
source of truth for stages 1–13: any page can be rebuilt from what's below without going back
to the live site.

The live site is served from Hostinger, deployed via Git-based auto-deploy from the `main`
branch of `sudarshntn/platformopsstudio-website-src`. Rebuild work lives on the `next-rebuild`
branch; `main` continues to ship static HTML until we're ready to cut over.

Legacy static source (index.html, blogs.html, resources/, newsletter/, assets/) is still
present at the repo root on this branch for reference and for main-branch continuity — Next.js
ignores those root-level \*.html files and the app router takes precedence for any matching
path. **Do not link to them from Next.js pages; they will be deleted at cutover.**

---

## 1. Sitemap

```
/                              Home
/blogs                         Blog index (14 posts)
  /blogs/<slug>                Individual blog post (see §5 for slugs)
/newsletter                    "The Platform Pulse" landing + issue archive
  /newsletter/<slug>           Individual newsletter issue (see §6 for slugs)
/contact                       Contact form
/legal-notice                  Business info block
/privacy-policy                Privacy & cookies policy
/*                             404 (custom)
```

**Legacy URL redirects to preserve** (currently a client-side meta-refresh on the static
site — reimplement as `next.config.ts` `redirects()` on Next):

| From                                                                                        | To                                                            | Status                 |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------- |
| `/resources.html`                                                                           | `/blogs`                                                      | 301                    |
| `/index.html`, `/blogs.html`, `/contact.html`, `/legal-notice.html`, `/privacy-policy.html` | `/`, `/blogs`, `/contact`, `/legal-notice`, `/privacy-policy` | 301                    |
| `/resources/<slug>.html`                                                                    | `/blogs/<slug>`                                               | 301 (14 slugs, see §5) |
| `/newsletter/<slug>.html`                                                                   | `/newsletter/<slug>`                                          | 301 (5 slugs, see §6)  |

---

## 2. Global chrome

### Header (all pages)

Order matters:

1. **Location strip** — full-width blue bar. Copy: `📍 Texas, United States`. Background
   `--color-accent`, white text, `0.8rem`, centered.
2. **Sticky container**, white background, `1px` bottom border in `--color-border-light`,
   `z-index: 50`. Contains:
   - **Brand** (left) — logo image (`assets/img/logo.png`, 1019×598 → displayed at 42px
     height) + wordmark "PlatformOpsStudio" (Inconsolata bold, 1.1rem, `--color-text-dark`).
     Links to `/`.
   - **Main nav** (center on desktop, hamburger on <860px) — Home, Blogs, Newsletter, Contact.
     Active state uses `--color-accent`. On mobile, tapping the hamburger toggles a `nav-open`
     class on the header, which reveals the same nav vertically below the strip.
   - **Learn With Me** primary button (right) — links to `/contact`. Hidden on <860px viewports.

### Footer (all pages)

Three horizontal rows inside `.container`, dark background (`--color-bg-dark`):

1. **Top row** — brand+wordmark (left) and link list (right): Blogs, Newsletter, Contact,
   Legal Notice, Privacy Policy.
2. **Social row** — 5 circular icon buttons (36×36, `--color-bg-dark-2` bg, muted border,
   hover fills with `--color-accent`). Each is an inline SVG of the real brand mark:
   - Facebook — https://www.facebook.com/profile.php?id=61583515224881
   - Instagram — https://www.instagram.com/platformopsstudio/
   - YouTube — https://www.youtube.com/@PlatformOpsStudio
   - X — https://x.com/platformopsstd
   - LinkedIn — https://www.linkedin.com/in/sudarshannarayanan/

   All `target="_blank" rel="noopener"` with correct `aria-label` per platform.

3. **Bottom row** — copyright + secondary text (`© 2026 Platform Ops Studio. All rights
reserved.` and `Texas, United States · ramsudarsan@gmail.com`).

### Cookie banner (all pages)

Fixed bottom-left card, max-width 420px. Copy: heading `We respect your privacy`, body
`By continuing to use our website, you agree to our cookies policy.`, single `Accept`
button. Dismissal is persisted in `localStorage['pos-cookie-consent'] = 'accepted'` and the
banner is hidden on subsequent loads until that key clears.

**Rebuild note**: Next.js version should replace this with a Consent Mode compliant banner
(distinguish essential vs. analytics/marketing cookies) once analytics is wired in stage 8+.

---

## 3. Per-page content outlines

### 3.1 `/` — Home

Sections top-to-bottom:

1. **Hero** — full-width, dark background image (`assets/img/hero.jpg`, 1536×1024) with a
   linear-gradient overlay from `rgba(6,7,11,0.88)` → `rgba(6,7,11,0.92)`. Left-aligned inside
   `.container`, max-width 820px.
   - H1 (Inconsolata bold, clamp 2rem–2.75rem): _"Empowering Your Platform Engineering &
     DevSecOps Journey With Insightful Content and Expert Tutorials"_
   - Primary button: `✉ Send Message` → `/contact`
2. **About / Approach split** — `.section-alt` background (`#fff`), two-column grid.
   - Left column: eyebrow "ABOUT", H2 "Dynamic Engineering Hub in Texas", one-paragraph
     description ending with an inline `mailto:ramsudarsan@gmail.com` link.
   - Right column: eyebrow "APPROACH", H2 "Authentic Learning and Connection", one-paragraph
     description, outline button "See the Details" → `/contact`.
3. **Latest Newsletter** — `.section-dark`, showcases the 2 most recent Platform Pulse
   issues. Header: eyebrow "THE PLATFORM PULSE", H2 "Latest Newsletter", one-paragraph
   description. Two post-cards below (currently editions 12 and 11), then buttons: primary
   "Browse Full Archive" → `/newsletter`, outline "Subscribe on LinkedIn" → LinkedIn newsletter
   URL.
4. **CTA band** — solid `--color-accent` background, centered. H2 "Unlock Advanced Tech
   Knowledge Instantly", supporting paragraph, light button "Subscribe Now" → `/contact`.
5. **Split cards** — `.section-dark`, two dark-card variants side by side:
   - "Connect Directly With Me" + primary button → `/contact`
   - "Uncover the World of PlatformOps" + outline button → `/blogs`

**Rebuild note**: sections 4 (CTA band) and 5 (split cards) overlap in intent (both push to
contact/subscribe). Consider merging in the redesign — they exist in the current site because
they were separate sections in the UENI template. Open question for design lead.

### 3.2 `/blogs` — Blog index

- Small hero (`.hero-small`, same dark background image, 64px vertical padding). H1 "Discover
  Expert Insights and Guidance", lead paragraph.
- `.post-grid` (CSS grid, `repeat(auto-fit, minmax(300px, 1fr))`, 32px gap) with 14 blog
  cards. Each card:
  - 16:9 media area with the topic banner SVG as an `<img>` behind an absolutely-positioned
    tag chip
  - Body: date (small, muted, only for Medium-cross-posts), H3 title, one-line excerpt,
    "Read More →" affordance in accent color
- **Reach Out Now** section — `.section-dark`, two-column: left = contact CTA copy, right =
  the same contact form as `/contact` (see §4).

### 3.3 `/newsletter` — Landing

- Small hero, dark. Eyebrow "NEWSLETTER" (in accent-light), H1 "The Platform Pulse",
  descriptive lead, two buttons: primary "Subscribe on LinkedIn →" (external), light
  "Browse the Archive" (jump link to `#archive`).
- **"Why this lives in two places"** — `.section-alt`, narrow container (max 780px). Two
  paragraphs explaining LinkedIn-first, site-archive-after model. Inline `.signup-form` for
  email capture with a `signup-note` disclaimer that the form currently opens a `mailto:`
  because no ESP is wired yet.
- **Archive** (`#archive`) — `.section-dark`, eyebrow "ARCHIVE", H2 "Every Issue, In Order",
  `.post-grid` with 5 issue cards (editions 8 through 12).
- **CTA band** — accent bg. H2 "Don't wait for the archive", supporting copy, light button
  "Subscribe on LinkedIn".

### 3.4 `/newsletter/<slug>` — Individual issue (5 pages)

Template shared across all 5:

- Small `.section-alt` header — eyebrow `The Platform Pulse · Edition NN · Monday, <date>`,
  H1 issue title.
- Banner block — full-width (within container) SVG banner for the issue.
- **`.medium-callout`** — light gray background, accent left-border, copy "This issue was
  originally published on LinkedIn — subscribe there to get it first, every Monday.", primary
  button "Read the Original on LinkedIn →" pointing at the specific pulse post.
- Article body — original summary + "Why this matters for platform teams" commentary. Deliberately
  distinct from the LinkedIn version (see §7 SEO note).
- Tag list (7–9 hashtag-style chips).
- **`.newsletter-band`** — dark card with H3 "Get the next issue first", body copy, two
  buttons (primary Subscribe on LinkedIn, outline Browse All Issues → `/newsletter`).
- Related section (`.section-dark`) — 3 issue cards, "More Issues" heading.

### 3.5 `/blogs/<slug>` — Individual blog post (14 pages)

Two flavors depending on whether the post cross-posts from Medium:

- **Header**: eyebrow (`Blogs` or `Blogs · From Medium`), H1, optional date/publisher line.
- **Banner** (topic SVG).
- **`.medium-callout`** (Medium cross-posts only) — same styling as the newsletter callout,
  pointing at the Medium URL.
- **Body** — original summary + commentary. For non-cross-posts, fuller original prose.
- Tag list.
- Related section — 3 sibling post cards.

### 3.6 `/contact` — Contact

- Small dark hero. H1 "Let's Connect and Collaborate", lead.
- **`.contact-grid`** (`.section-dark`) — two columns:
  - Left: contact info (eyebrow, H2, description, `mailto:` email, `tel:` phone `+1 737 202
8818`, location "Texas, United States")
  - Right: `.form-card` (light card on the dark bg) with 4 fields (message, name, email,
    phone), consent note, primary "Send Message" button, `.form-status` element for
    post-submit messaging.

Current form behavior (see `assets/js/main.js`): on submit, opens `mailto:ramsudarsan@gmail.com`
with the fields concatenated into the body. **Stage 6 target**: swap for a Route Handler that
uses Resend (`RESEND_API_KEY`, `CONTACT_TO_EMAIL` env vars — see `.env.example`) and returns a
proper success/error state, keeping the mailto fallback if the API is misconfigured.

### 3.7 `/legal-notice`

Narrow container (max 780px). H1 "Legal Notice", then a definition list:

| Term                    | Value                 |
| ----------------------- | --------------------- |
| Business Name           | Platform Ops Studio   |
| Registered Company Name | Platform Ops Studio   |
| Address                 | Texas, United States  |
| Phone Number            | +1 737 202 8818       |
| Email                   | ramsudarsan@gmail.com |

### 3.8 `/privacy-policy`

Narrow container. H1 "Privacy & Cookies Policy", followed by 3 short sections:

1. **Information we collect** — one paragraph on contact-form data usage.
2. **Cookies** — one paragraph noting only an essential dismissal-state cookie.
3. **Contacting us** — one-liner with email link.

### 3.9 404

Centered `.section-alt`, minimalist. Eyebrow "404", H1 "Page Not Found", one-paragraph body,
primary button "Back to Home". Only the header brand + a short footer are shown (no nav).

---

## 4. Contact form spec (rebuild target)

Fields (all required except phone):

| Name      | Type     | Notes                       |
| --------- | -------- | --------------------------- |
| `message` | textarea | min 120px, autosize desired |
| `name`    | text     |                             |
| `email`   | email    | HTML5 validation            |
| `phone`   | tel      | optional                    |

Consent copy: _"I agree with the Privacy & Cookies Policy of Platform Ops Studio."_ — the
link goes to `/privacy-policy`.

**Behavior contract for stage 6:**

- Server action or `POST /api/contact` route handler.
- Rate-limit by IP (implementation open — Redis/KV or in-memory for MVP).
- Send via Resend (`from: contact@platformopsstudio.com` once domain is verified, else
  Resend's onboarding sender) to `CONTACT_TO_EMAIL`.
- Return JSON `{ ok: true }` or `{ ok: false, error }`; UI shows `.form-status` inline.
- Fall back to `mailto:` if `RESEND_API_KEY` is not set (dev / preview mode).

---

## 5. Blog inventory (14 posts)

Slugs come from `resources/*.html` on the legacy site — they redirect to `/blogs/<slug>` on
the new site. Chronological where a date is known.

| Slug                                                                                       | Title                                                                              | Date       | Source                                                                                                                             | Banner                                  |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `the-mcp-orchestrator-the-conductor-your-ai-stack-has-been-missing`                        | The MCP Orchestrator: The Conductor Your AI Stack Has Been Missing                 | 2026-07-01 | Medium ([lhync](https://medium.com/@ramsudarsan/the-mcp-orchestrator-the-conductor-your-ai-stack-has-been-missing-e064ce2149cd))\* | `banner-mcp-orchestrator.svg`           |
| `why-i-wrote-an-ebook-about-gitops-teams-and-what-i-wish-someone-had-told-me-earlier`      | Why I Wrote an eBook About GitOps Teams…                                           | 2026-06-03 | Medium                                                                                                                             | `banner-gitops-ebook.svg`               |
| `empowering-teams-training-and-onboarding-in-the-gitops-framework`                         | Empowering Teams: Training and Onboarding in the GitOps Framework                  | —          | Original (book announcement)                                                                                                       | (none / default)                        |
| `gitops-release-management-building-enterprise-promotion-pipelines-with-kargo-and-argo-cd` | GitOps Release Management: Enterprise Promotion Pipelines with Kargo & Argo CD     | 2026-03-05 | Medium                                                                                                                             | `banner-gitops-release-management.svg`  |
| `from-commit-to-production-gitops-promotion-workflows-with-kargo-argo-cd`                  | From Commit to Production: GitOps Promotion Workflows with Kargo & Argo CD         | —          | Original (long-form companion to Medium piece)                                                                                     | `banner-gitops-release-management.svg`  |
| `embracing-agile-platform-engineering-revolutionizes-project-management`                   | Embracing Agile: Platform Engineering Revolutionizes Project Management            | 2025-11-08 | Original                                                                                                                           | (none / default)                        |
| `how-devsecops-transforms-modern-software-development-practices`                           | How DevSecOps Transforms Modern Software Development Practices                     | 2025-11-02 | Original                                                                                                                           | (none / default)                        |
| `seamlessly-connect-confluent-cloud-kafka-to-self-hosted-kafka-with-cluster-linking`       | Seamlessly Connect Confluent Cloud Kafka to Self-Hosted Kafka with Cluster Linking | 2025-06-26 | Medium                                                                                                                             | `banner-kafka-cluster-linking.svg`      |
| `turning-nginx-open-source-into-a-lightweight-api-gateway-using-lua`                       | Turning NGINX Open Source into a Lightweight API Gateway Using Lua                 | 2025-06-17 | Medium                                                                                                                             | `banner-nginx-lua-gateway.svg`          |
| `managing-multi-cluster-deployments-with-argocd-mcp`                                       | Managing Multi-Cluster Deployments with ArgoCD MCP                                 | 2025-05-29 | Medium                                                                                                                             | `banner-argocd-mcp-multicluster.svg`    |
| `blueprint-for-success-designing-scalable-azure-subscriptions-the-right-way`               | Blueprint for Success: Designing Scalable Azure Subscriptions the Right Way        | 2025-05-07 | Medium                                                                                                                             | `banner-azure-subscriptions.svg`        |
| `mastering-gitops-argocd-deployment-patterns-for-scalable-kubernetes-delivery`             | Mastering GitOps: ArgoCD Deployment Patterns for Scalable Kubernetes Delivery      | 2025-04-13 | Medium                                                                                                                             | `banner-argocd-deployment-patterns.svg` |
| `bridging-the-mesh-integrating-istio-ambient-with-kong-konnect-and-kong-gateway`           | Bridging the Mesh: Integrating Istio Ambient with Kong Konnect and Kong Gateway    | 2025-04-12 | Medium                                                                                                                             | `banner-istio-kong.svg`                 |
| `seamless-api-management-integrating-istio-ambient-mesh-with-azure-apim`                   | Seamless API Management: Integrating Istio Ambient Mesh with Azure APIM            | 2025-04-11 | Medium                                                                                                                             | `banner-istio-azure-apim.svg`           |

<sub>\* Medium URLs for all cross-posts are catalogued in §8 external links.</sub>

**Content-shape rebuild target (stage 5)**: migrate each `resources/*.html` article to
Markdown/MDX under `content/blog/<slug>.md`, extracting the front-matter (title, date, tags,
banner, medium URL, excerpt). Prose in each is already original (not scraped from Medium) —
safe to move verbatim.

---

## 6. Newsletter inventory (5 issues)

Source: [The Platform Pulse](https://www.linkedin.com/newsletters/the-platform-pulse-7468764234068369410/).
LinkedIn publishes first every Monday; site archives after.

| Edition | Slug                                                   | Title                                                                      | Published  | Banner                                  | LinkedIn URL                                                                                                            |
| ------- | ------------------------------------------------------ | -------------------------------------------------------------------------- | ---------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 12      | `edition-12-policy-as-code-opa-kyverno-cedar`          | Policy as Code: OPA, Kyverno, Cedar — Which Wins in 2026?                  | 2026-08-17 | `banner-newsletter-policy-as-code.svg`  | [pulse/…lhync](https://www.linkedin.com/pulse/policy-code-opa-kyverno-cedar-which-wins-2026-sudarshan-narayanan-lhync)  |
| 11      | `edition-11-golden-paths-developers-actually-use`      | Golden Paths That Developers Actually Use                                  | 2026-08-10 | `banner-newsletter-golden-paths.svg`    | [pulse/…vmdyc](https://www.linkedin.com/pulse/golden-paths-developers-actually-use-sudarshan-narayanan-vmdyc)           |
| 10      | `edition-10-gitops-at-scale-argo-cd-flux-500-clusters` | GitOps at Scale: Argo CD, Flux, and the Patterns That Survive 500 Clusters | 2026-08-03 | `banner-newsletter-gitops-at-scale.svg` | [pulse/…vcsgc](https://www.linkedin.com/pulse/gitops-scale-argo-cd-flux-patterns-survive-500-sudarshan-narayanan-vcsgc) |
| 9       | `edition-09-the-end-of-on-call-as-we-know-it`          | The End of On-Call As We Know It                                           | 2026-07-27 | `banner-newsletter-end-of-on-call.svg`  | [pulse/…rmxzc](https://www.linkedin.com/pulse/end-on-call-we-know-sudarshan-narayanan-rmxzc)                            |
| 8       | `edition-08-llmops-production-grade-2026`              | LLMOps: What Production-Grade Looks Like in 2026                           | 2026-07-20 | `banner-newsletter-llmops.svg`          | [pulse/…npeuc](https://www.linkedin.com/pulse/llmops-what-production-grade-looks-like-2026-sudarshan-narayanan-npeuc)   |

**Editions 1–7 have not been syndicated to the site.** LinkedIn shows earlier posts (SBOMs
Are Mandatory Now; FinOps Meets Platform Engineering; SLOs in 2026) under "More from this
author" — these may or may not be Platform Pulse editions. **Open question**: are those
earlier editions of The Platform Pulse or standalone Sudarshan Narayanan posts? Confirm
with editor before back-filling.

---

## 7. SEO & content strategy

- **Canonical policy for newsletter issues**: no `rel="canonical"` override to LinkedIn.
  Site copy is intentionally distinct from the LinkedIn version (own summary + "why this
  matters for platform teams" section) so each site page can index and rank independently
  while LinkedIn owns the syndication-first channel.
- **Canonical policy for Medium-cross-post blog posts**: same — the site copy is original,
  written from the outline, not scraped. No canonical override.
- **Sitemap.xml / robots.txt**: not present on the static site. Add both in stage 4 (SEO).
- **OG images**: currently the same 1200×630 topic SVG banners double as content banners and
  OG images. In stage 4, generate proper OG images per page (either via `@vercel/og` at build
  time or hand-authored PNGs from the SVGs).
- **Structured data (JSON-LD)**: none present. Add `Article`, `BlogPosting`, and
  `Newsletter` schemas in stage 4.
- **Redirects from legacy `.html` URLs** — see §1.

---

## 8. External links inventory

Every off-site link across the current site, so we can audit them in stage N:

| Category                                 | URL                                                                                                            | Where used                      |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Google Fonts                             | `https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&family=Karla:wght@400;500;700&display=swap` | Every page `<head>`             |
| Fonts preconnect                         | `https://fonts.googleapis.com`, `https://fonts.gstatic.com`                                                    | Every page `<head>`             |
| Facebook profile                         | `https://www.facebook.com/profile.php?id=61583515224881`                                                       | Every footer                    |
| Instagram                                | `https://www.instagram.com/platformopsstudio/`                                                                 | Every footer                    |
| YouTube                                  | `https://www.youtube.com/@PlatformOpsStudio`                                                                   | Every footer                    |
| X                                        | `https://x.com/platformopsstd`                                                                                 | Every footer                    |
| LinkedIn (personal)                      | `https://www.linkedin.com/in/sudarshannarayanan/`                                                              | Every footer                    |
| LinkedIn (newsletter)                    | `https://www.linkedin.com/newsletters/the-platform-pulse-7468764234068369410/`                                 | Newsletter landing, issue pages |
| LinkedIn Pulse (issues 8–12)             | See §6                                                                                                         | Newsletter issue callouts       |
| Medium (author profile-referenced posts) | `https://medium.com/@ramsudarsan/<slug>-<hash>`                                                                | 3+ blog callouts (see §5)       |

**Rebuild note**: Google Fonts is a third-party runtime dependency. In stage 3 (design
system), swap for `next/font` to self-host the two families and eliminate the preconnect
hops.

---

## 9. Contact endpoints

| Channel            | Value                                      | Used at                                                                                   |
| ------------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Email              | `ramsudarsan@gmail.com`                    | `mailto:` links on Home, Contact, Blogs, Newsletter, Legal Notice, Privacy Policy, footer |
| Phone              | `+1 737 202 8818` (`tel:+17372028818`)     | Contact, Legal Notice                                                                     |
| Location           | Texas, United States                       | Every header (location strip), footer, Legal Notice, Contact                              |
| LinkedIn subscribe | The Platform Pulse newsletter URL (see §6) | Newsletter landing, all issue pages, homepage tie-in                                      |

---

## 10. Image inventory

**Stage 2 update**: all 18 assets are now mirrored under `public/assets/img/` with identical
filenames. The legacy `assets/img/` at the repo root is retained untouched so `main` can
continue to auto-deploy the static site until stage-14 cutover. See `docs/assets.md` for the
full migration and favicon strategy.

### 10.1 Raster

| File                            | Size      | Dimensions                   | Where                                                  |
| ------------------------------- | --------- | ---------------------------- | ------------------------------------------------------ |
| `public/assets/img/logo.png`    | 15,569 B  | 1019×598 (PNG-8, palette)    | Every header brand + footer brand                      |
| `public/assets/img/hero.jpg`    | 124,115 B | 1536×1024 (progressive JPEG) | Home hero, blogs/contact/legal/privacy small heroes    |
| `public/assets/img/favicon.png` | 95,277 B  | 1250×1250 (PNG RGBA)         | Source for the favicon set below (not directly served) |
| `app/icon.png`                  | 3,360 B   | 32×32                        | Browser tab favicon (Next 15 auto-linked)              |
| `app/apple-icon.png`            | 22,265 B  | 180×180                      | iOS home-screen icon (Next 15 auto-linked)             |
| `public/icon-192.png`           | 23,931 B  | 192×192                      | Android/PWA (referenced by manifest in stage 4)        |
| `public/icon-512.png`           | 73,704 B  | 512×512                      | Android/PWA (referenced by manifest in stage 4)        |

**Rebuild notes**:

- `logo.png` is palette-indexed — fine at current display size but limits color fidelity.
  If a rebranded logo lands, prefer SVG.
- `hero.jpg` is 124 KB progressive JPEG — acceptable for `next/image` with `priority` on
  home only.

### 10.2 SVG banners (all 1200×630, ~2.2 KB each)

Under `public/assets/img/banners/`:

**Blog banners** (10):

- `banner-mcp-orchestrator.svg`
- `banner-gitops-ebook.svg`
- `banner-gitops-release-management.svg` (used by 2 posts)
- `banner-kafka-cluster-linking.svg`
- `banner-nginx-lua-gateway.svg`
- `banner-argocd-mcp-multicluster.svg`
- `banner-azure-subscriptions.svg`
- `banner-argocd-deployment-patterns.svg`
- `banner-istio-kong.svg`
- `banner-istio-azure-apim.svg`

**Newsletter banners** (5):

- `banner-newsletter-policy-as-code.svg`
- `banner-newsletter-golden-paths.svg`
- `banner-newsletter-gitops-at-scale.svg`
- `banner-newsletter-end-of-on-call.svg`
- `banner-newsletter-llmops.svg`

All were programmatically generated (see `code-steps/gen_banners.py`, `gen_newsletter_banners.py`
in the parent workspace) — each has a category pill, 3-line title, topic icon, and a footer
identifying the site or newsletter. Aspect ratio 1200×630 was picked to double as OpenGraph
images.

---

## 11. Design tokens

Currently in `assets/css/style.css` as `:root` custom properties. Ported to Tailwind v4
`@theme` block in `app/globals.css`. Values verified from the live CSS:

| Token                     | Value                   | Purpose                                        |
| ------------------------- | ----------------------- | ---------------------------------------------- |
| `--color-accent`          | `#065be3`               | Primary buttons, links, active states          |
| `--color-accent-light`    | `#3a7dff`               | Hover, softer accents (e.g. footer email link) |
| `--color-bg-dark`         | `#06070b`               | `.section-dark` and footer                     |
| `--color-bg-dark-2`       | `#0d0f16`               | Dark cards, social-icon buttons                |
| `--color-bg-light`        | `#f4f5f8`               | `body` and `.hero-small` fills                 |
| `--color-text-light`      | `#f5f6fa`               | Text on dark bg                                |
| `--color-text-muted`      | `#b7bcc9`               | Secondary text on dark bg                      |
| `--color-text-dark`       | `#14151a`               | Body text                                      |
| `--color-text-dark-muted` | `#545862`               | Secondary text on light bg                     |
| `--color-border-dark`     | `#1c1f29`               | Dark card borders                              |
| `--color-border-light`    | `#e2e4ea`               | Light card borders                             |
| `--font-heading`          | Inconsolata (monospace) | H1–H4, eyebrow labels, brand wordmark          |
| `--font-sans`             | Karla                   | Body text and buttons                          |
| Layout `--max-width`      | `1120px`                | `.container` cap                               |
| Radius `--radius`         | `10px`                  | Card corners                                   |

**Rebuild note**: two typefaces (Inconsolata + Karla) is the current brand voice — the
mono-heading + sans-body combo gives the site its distinctive engineering feel. Preserve
unless design brief in stage 3 says otherwise.

---

## 12. Open questions for stage 1+

Compiled during stage 0. Answer before starting the relevant stage.

1. **Deployment target (stage 12+)** — Hostinger's Node.js hosting was named as the target.
   Confirm: which specific Hostinger plan supports Next.js server runtime, and what's their
   build/start command wiring? (`pnpm build` + `pnpm start` on port `$PORT`?) If the plan
   only supports static file hosting, we'd need to switch to `output: 'export'` (which
   forbids Server Actions and Route Handlers — losing the Resend contact form).
2. **CI/CD** — Hostinger's Git integration currently pulls files as-is (no build step). For
   Next.js it must run `pnpm install && pnpm build`. Verify Hostinger's Node.js Git deploy
   does this, or add a GitHub Actions workflow that builds then uploads via SSH/SFTP.
3. **Design brief (stage 3)** — is the current brand voice (dark tech aesthetic, Inconsolata
   monospace headings, blue #065be3 accent, 1200×630 topic banners) the direction? Or is a
   redesign expected? Affects whether stage 3 is a token-preservation exercise or a full
   redesign.
4. **Three.js / motion scope (stages 8–10)** — folders exist in the scaffold. Confirm which
   pages get 3D scenes and animation, and what fidelity/perf budget. (The current site has
   zero interactive/3D — that's a big product change, not just an aesthetic one.)
5. **Newsletter editions 1–7** — do they exist on LinkedIn under a different visible name, or
   were they retro-numbered? If they exist, back-fill from LinkedIn source (§6).
6. **Analytics** — none currently. What's the target? (Plausible, PostHog, GA4, Vercel
   Analytics?) Cookie banner design (§2) depends on the answer.
7. **Contact form email domain** — Resend requires a verified sender domain. Verify
   `platformopsstudio.com` in Resend (adds DKIM/SPF DNS records) before stage 6 ships.
8. **Real-content parity check** — I sampled 4 of the 14 blog pages during discovery, not
   all 14. Before the migration in stage 5, do a full HTML dump of every legacy page and
   diff against what's imported into `content/blog/`.

---

## 13. Files scaffolded in stage 0

For orientation:

```
├── app/
│   ├── globals.css           # Tailwind v4 CSS-first config + design tokens
│   ├── layout.tsx            # Root layout (html/body only)
│   └── page.tsx              # Placeholder home
├── components/
│   ├── ui/       .gitkeep
│   ├── layout/   .gitkeep
│   ├── three/    .gitkeep
│   ├── motion/   .gitkeep
│   └── forms/    .gitkeep
├── content/
│   ├── blog/     .gitkeep
│   └── newsletter/ .gitkeep
├── lib/          .gitkeep
├── public/
│   └── assets/img/  .gitkeep
├── docs/
│   └── discovery.md          # This file
├── .env.example
├── .gitignore                # extended with Next.js/Node/env rules
├── .husky/pre-commit         # runs lint-staged
├── .prettierrc.json
├── .prettierignore
├── eslint.config.mjs         # flat config, next/core-web-vitals + next/typescript
├── next-env.d.ts
├── next.config.ts
├── package.json              # scripts: dev, build, start, lint, typecheck, test, e2e
├── pnpm-workspace.yaml       # onlyBuiltDependencies allowlist (native deps)
├── postcss.config.mjs        # Tailwind v4 single plugin
├── README.md                 # stage roadmap + local setup
└── tsconfig.json             # strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes
```

Plus the legacy static site (untouched on this branch, still shipping from `main`):

```
├── index.html, blogs.html, contact.html, legal-notice.html, privacy-policy.html, 404.html, resources.html
├── resources/         # 14 blog HTML pages
├── newsletter/        # 5 issue HTML pages (share the folder name intentionally with content/)
└── assets/            # css/js/img
```
