# Performance

Targets (per prompt spec): LCP < 2.0s on 4G, CLS < 0.05, INP < 200ms, JS < 200 kB gzip on the home route.

Actuals at the end of stage 11 (from `pnpm build` output):

| Route                | Page JS | First Load JS |
| -------------------- | ------- | ------------- |
| `/`                  | 0.86 kB | 111 kB        |
| `/blogs`             | 190 B   | 111 kB        |
| `/blogs/[slug]`      | 200 B   | 111 kB        |
| `/newsletter`        | 190 B   | 111 kB        |
| `/newsletter/[slug]` | 200 B   | 111 kB        |
| `/contact`           | 36.1 kB | 357 kB        |
| `/design`            | 200 B   | 111 kB        |

Shared: 102 kB, dominated by React 19 (~54 kB) + shared chunk (~46 kB).

The home route sits well under the 200 kB budget. `/contact` is the fat one — it pulls in react-hook-form + zod + zodResolver — and that's an accepted trade for a single conversion page.

## Levers in place

- **Fonts.** `next/font` self-hosts Inter, Space Grotesk, and JetBrains Mono at build time with `display: swap` and the `latin` subset only. No runtime request to `fonts.googleapis.com`. Only the weights actually used in components are loaded ([app/layout.tsx](../app/layout.tsx)).
- **Images.** `next/image` with `formats: ["image/avif", "image/webp"]` in [next.config.ts](../next.config.ts). Above-the-fold hero and cover images pass `priority`. Every content image goes through the same pipeline — no raw `<img>`.
- **Code-splitting.** The Three.js hero scene is lazy-mounted via `next/dynamic` with `ssr: false`, gated on reduced-motion, IntersectionObserver visibility, `requestIdleCallback`, and a WebGL capability check ([components/three/hooks/useSceneMountGate.ts](../components/three/hooks/useSceneMountGate.ts)). Home route stays at 111 kB First Load JS even with three/drei in the dependency graph.
- **MDX.** Compiled to RSC at build/revalidate time; no MDX runtime in the browser. Syntax highlighting via `rehype-pretty-code` + `shiki` runs at build; the client just gets pre-styled HTML.
- **ISR.** `/blogs` and `/newsletter` list pages set `revalidate = 3600`, so a new content file surfaces within an hour without a full deploy. Detail pages regenerate through `generateStaticParams` on the same revalidation.
- **optimizePackageImports.** `lucide-react`, `motion`, and `@react-three/drei` are declared in `experimental.optimizePackageImports` so Next tree-shakes named imports across the barrel exports (drei was previously the top culprit here).
- **Cache headers.** `/_next/static/*` and `/assets/*` get `public, max-age=31536000, immutable` in [next.config.ts](../next.config.ts). Every filename in those paths is content-hashed.
- **Security headers.** `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` set globally. HSTS is set at the hosting layer once the origin is HTTPS-only.

## Bundle analyzer

```bash
pnpm analyze
```

Emits `.next/analyze/{client,edge,nodejs}.html`. Open the client report and look for anything > 30 kB gzipped that isn't React, framework, or an obvious dep. Any large new module should surface here before the release goes out.

## What we deliberately did NOT do

- **No `swcMinify: true`.** It's already the default in Next 15.
- **No `experimental.turbo` in production builds.** Dev-only until Turbopack graduates.
- **No CDN in `images.remotePatterns`.** Every image is self-hosted under `/assets/img/` — no third-party image origin means no extra DNS + TCP + TLS for images.
- **No inline critical CSS extraction dep.** Tailwind v4 keeps used CSS ~10 kB gzipped and Next inlines it in the document head automatically.

## Field measurement

Web Vitals are collected once the site is live via the hosting layer's log-based RUM. The `web-vitals` npm library is not shipped to the client — it would just add weight to measure what the browser already exposes to the origin's own logs. Lighthouse CI ships in stage 13.
