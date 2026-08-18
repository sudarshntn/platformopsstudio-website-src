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
├── resources.html              Blog / resources listing
├── resources/                  Individual articles
│   ├── the-mcp-orchestrator-the-conductor-your-ai-stack-has-been-missing.html
│   ├── empowering-teams-training-and-onboarding-in-the-gitops-framework.html
│   ├── from-commit-to-production-gitops-promotion-workflows-with-kargo-argo-cd.html
│   ├── embracing-agile-platform-engineering-revolutionizes-project-management.html
│   └── how-devsecops-transforms-modern-software-development-practices.html
├── contact.html
├── legal-notice.html
├── privacy-policy.html
├── 404.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/ (logo, hero, favicon)
```

## Deploying to Hostinger (Git-based Web App deploy)

Hostinger's Git integration pulls the repo as-is into `public_html` — there is **no build
step**, so this static structure deploys directly with nothing else to configure.

1. Log in to **hPanel** → **Websites** → select the site (or **Add Website → Deploy Web App**
   if platformopsstudio.com isn't added yet).
2. Open the site's **Dashboard → Advanced → Git**.
3. Click **Continue with GitHub**, authorize the Hostinger GitHub App, and select
   `sudarshntn/platformopsstudio-website-src`.
4. Branch: `main`. Root directory: `/` (this repo's root maps straight to `public_html`).
5. Click **Deploy**. Every push to `main` will redeploy automatically once auto-deploy is
   enabled on the Git panel.
6. Point the `platformopsstudio.com` domain's DNS/nameservers at Hostinger (or add it as the
   site's domain in hPanel) and issue the free SSL certificate under **Websites → SSL**.

## Contact form

The contact form on `contact.html` / `resources.html` currently opens the visitor's email
client via a `mailto:` link (see `assets/js/main.js`) — no backend required. To collect
submissions server-side instead, swap the JS handler for a form service such as Hostinger's
own form endpoint, [Formspree](https://formspree.io), or a serverless function, and point the
`<form>`'s `action`/`method` at it.

## Content notes

Content, copy, and images were captured from the live platformopsstudio.com (previously hosted
on UENI) and rebuilt as static markup — UENI's original template source was not accessible, so
this is a faithful rebuild rather than an export. Update copy directly in the relevant `.html`
files; there is no CMS or templating layer.
