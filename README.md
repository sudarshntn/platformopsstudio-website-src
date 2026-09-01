# PlatformOpsStudio — Website (Next.js rebuild)

**You are on the `next-rebuild` branch.** The Next.js 15 rewrite of
[platformopsstudio.com](https://platformopsstudio.com) is in progress here across a 14-stage
plan. The live site continues to ship from `main` as plain HTML — see the `README.md` at that
branch for the static-site setup.

## Requirements

- Node 20+ (the project is being developed on Node 22 LTS)
- pnpm 9+ (installed globally; `packageManager` field pins pnpm to 11.x for consistency)

## Local setup

```bash
pnpm install
cp .env.example .env.local  # fill in values you have; blanks are OK for stage 0
pnpm dev                    # opens http://localhost:3000
```

## Scripts

| Command          | What it does                                                                          |
| ---------------- | ------------------------------------------------------------------------------------- |
| `pnpm dev`       | Next.js dev server with Fast Refresh                                                  |
| `pnpm build`     | Production build                                                                      |
| `pnpm start`     | Serve the production build                                                            |
| `pnpm lint`      | ESLint (flat config, `next/core-web-vitals` + `next/typescript` + Prettier reconcile) |
| `pnpm typecheck` | `tsc --noEmit` in strict mode                                                         |
| `pnpm test`      | Vitest (`--passWithNoTests` — no specs yet in stage 0)                                |
| `pnpm e2e`       | Playwright (no specs yet)                                                             |

Pre-commit hook runs `lint-staged` (ESLint + Prettier on staged files).

## Environment variables

See `.env.example`. Summary:

- `NEXT_PUBLIC_SITE_URL` — public origin, used by `metadataBase`. Client-safe.
- `RESEND_API_KEY` — server-only, for the contact form endpoint (stage 6+). Leave blank in
  dev; the form falls back to `mailto:` when unset.
- `CONTACT_TO_EMAIL` — server-only, destination inbox for contact-form submissions.

## Project layout

```
app/               Next.js App Router (layout.tsx, page.tsx, globals.css)
components/
  ui/              Primitives — buttons, inputs, cards
  layout/          Header, footer, cookie banner, container
  three/           R3F scenes and shaders (stages 8–10)
  motion/          Animated components (Framer Motion or equivalent)
  forms/           Contact form and form primitives
content/
  blog/            One MDX/Markdown file per blog post (stage 5 target)
  newsletter/      One file per Platform Pulse issue (stage 5 target)
lib/               Shared TS utilities (typed content loaders, formatters, etc.)
public/assets/img/ Migrated images (raster + banner SVGs) — moved in stage 2
docs/discovery.md  Full IA, content inventory, image inventory, open questions
```

Legacy static source (`index.html`, `blogs.html`, `resources/`, `newsletter/`, `assets/`) is
kept at the repo root on this branch so `main` can still auto-deploy unchanged during the
migration. Next.js's App Router takes precedence over root-level `.html` files, so both can
coexist. They will be deleted at cutover.

## Stage roadmap

Fourteen stages, one per PR onto `next-rebuild`. Sequence chosen so each stage is
independently shippable and reviewable.

| Stage | Deliverable                                                                                               |
| ----- | --------------------------------------------------------------------------------------------------------- |
| 0     | Scaffold + discovery doc (this branch's initial commit)                                                   |
| 1     | Layout, header/footer, cookie banner, global chrome                                                       |
| 2     | Design tokens, typography (`next/font`), image migration to `public/`                                     |
| 3     | UI primitives — buttons, cards, form inputs, chips, section wrappers                                      |
| 4     | Metadata, `robots.txt`, `sitemap.xml`, OG images, JSON-LD                                                 |
| 5     | Content migration — legacy HTML → MDX in `content/blog` and `content/newsletter`, typed loaders in `lib/` |
| 6     | Contact page + Resend-backed contact form Route Handler + rate limiting                                   |
| 7     | Blog index + individual post pages                                                                        |
| 8     | Newsletter landing + individual issue pages                                                               |
| 9     | Home page — hero, About/Approach, Latest Newsletter tie-in, CTA bands                                     |
| 10    | Three.js hero scene (see `components/three/`) — scope TBD in stage 3 design brief                         |
| 11    | Motion / scroll-linked animations (see `components/motion/`)                                              |
| 12    | Analytics + Consent Mode–aware cookie banner                                                              |
| 13    | E2E test suite (Playwright) + a11y audit                                                                  |
| 14    | Cutover — delete legacy static files, deploy Next.js build to Hostinger, DNS/SSL check, monitor           |

Open questions that must be answered before hitting the referenced stage are catalogued at
the bottom of `docs/discovery.md` (§12).

## Branch model

- `main` — plain static HTML site currently deployed to Hostinger. Every push
  auto-deploys via Hostinger's Git integration. Do **not** merge `next-rebuild` into `main`
  until stage 14.
- `next-rebuild` — this branch. Next.js work happens here. Feature branches for each stage
  should PR into `next-rebuild`, not `main`.
- After stage 14 cutover, `main` is fast-forwarded to `next-rebuild` in a single commit and
  Hostinger's Git deploy is switched from static-file serving to Next.js Node runtime.

## Discovery

Start with **`docs/discovery.md`**. It's the single source of truth for every page's
structure, copy, images, external links, and rebuild notes. A new engineer should be able to
recreate any page from that doc alone.
