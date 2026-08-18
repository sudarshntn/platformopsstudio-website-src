# PlatformOpsStudio — Website Source

Static site source for [platformopsstudio.com](https://platformopsstudio.com), rebuilt from the
previous UENI-hosted site content for deployment on **Hostinger's Web App / Website hosting**.

Plain HTML, CSS, and vanilla JS — no build step, no framework, no dependencies.

`package.json` is included only so hosts that auto-detect Node projects (e.g. an "import"
step that expects one) have something to read; it declares zero dependencies and its `build`
script is a no-op, since there is nothing to compile. `npm start` just serves the folder as-is
for local preview (via `npx serve`) — it's not required for deployment.

## Structure

```
.
├── package.json                 No deps; build is a no-op (see note above)
├── index.html                  Home
├── blogs.html                  Blog listing (formerly resources.html)
├── resources/                  Individual blog article pages
│   ├── the-mcp-orchestrator-the-conductor-your-ai-stack-has-been-missing.html
│   ├── empowering-teams-training-and-onboarding-in-the-gitops-framework.html
│   ├── from-commit-to-production-gitops-promotion-workflows-with-kargo-argo-cd.html
│   ├── embracing-agile-platform-engineering-revolutionizes-project-management.html
│   ├── how-devsecops-transforms-modern-software-development-practices.html
│   └── ... (14 articles total, several cross-posted from Medium)
├── newsletter.html             "The Platform Pulse" archive/landing page
├── newsletter/                 One page per issue, e.g. edition-12-policy-as-code-...html
├── contact.html
├── legal-notice.html
├── privacy-policy.html
├── 404.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/ (logo, hero, favicon, banners/)
```

The `resources/` folder name was kept as-is for the individual article pages even though the
listing page is now `blogs.html` — it's an internal path, not a user-facing label.

Every page footer links out to the five PlatformOpsStudio social profiles (Facebook, Instagram,
YouTube, X, LinkedIn) as inline SVG icons — no external icon font or JS dependency.

### Newsletter section

"The Platform Pulse" is written and published on LinkedIn first
(linkedin.com/newsletters/the-platform-pulse-7468764234068369410) every Monday, then archived on
this site. Each issue page under `newsletter/` is a distinct, original summary and commentary
piece — not a duplicate of the LinkedIn post — with a callout linking back to the original at
the top, and a `newsletter-band` CTA at the bottom pushing LinkedIn subscriptions. This is a
deliberate SEO choice: because the content differs meaningfully from the LinkedIn version, no
`rel="canonical"` override was added, so each issue can be indexed and rank on its own here.
The `.signup-form` email capture (same mailto fallback pattern as the contact form, wired in
`assets/js/main.js`) is there for future-proofing, not a live mailing list yet — the LinkedIn
subscribe link is the only channel that actually delivers issues today. To add the next issue:
copy an existing `newsletter/edition-NN-*.html` file, update its content and banner, add a card
for it to `newsletter.html`'s archive grid, and update the "More Issues" cards on neighboring
issue pages.

## Deploying to Hostinger (Git-based Web App deploy)

Hostinger's Git integration pulls the repo as-is into `public_html` — there is **no build
step**, so this static structure deploys directly with nothing else to configure.

### One-time setup

1. Log in to **hPanel** → **Websites** → select the site (or **Add Website → Deploy Web App**
   if platformopsstudio.com isn't added yet).
2. Open the site's **Dashboard → Advanced → Git**.
3. Click **Connect with GitHub**, authorize the Hostinger GitHub App, and grant it access to
   `sudarshntn/platformopsstudio-website-src` (use **Refresh repositories** if it doesn't show
   up right away).
4. Set **Branch** to `main` and leave **Deploy directory** at the default (root / `public_html`).
5. Click **Deploy** to run the first deployment.
6. Point the `platformopsstudio.com` domain's DNS/nameservers at Hostinger (or add it as the
   site's domain in hPanel) and issue the free SSL certificate under **Websites → SSL**.

### Continuous deployment (already automatic — nothing to toggle)

There's no separate "auto-deploy" switch to find. Once step 3–5 above is done, Hostinger
registers a GitHub webhook on the repo, and **every push to `main` redeploys automatically**:
push → GitHub fires the webhook → Hostinger pulls the latest commit → site is live, usually
within seconds since there's no build step. The Git panel shows an **"Auto-deployment"** chip
while that webhook connection is healthy, and each deploy (auto or manual) is listed in the
panel's history. Use the **Redeploy** button on the Overview tab only if you need to force a
pull outside of a push (e.g. after changing the branch or deploy directory).

If deploys stop showing up after a push, check that chip first — a revoked GitHub App
authorization or a renamed/force-pushed branch is the usual cause.

## Contact form

The contact form on `contact.html` / `blogs.html` currently opens the visitor's email
client via a `mailto:` link (see `assets/js/main.js`) — no backend required. To collect
submissions server-side instead, swap the JS handler for a form service such as Hostinger's
own form endpoint, [Formspree](https://formspree.io), or a serverless function, and point the
`<form>`'s `action`/`method` at it.

## Content notes

Content, copy, and images were captured from the live platformopsstudio.com (previously hosted
on UENI) and rebuilt as static markup — UENI's original template source was not accessible, so
this is a faithful rebuild rather than an export. Update copy directly in the relevant `.html`
files; there is no CMS or templating layer.
