# PlatformOpsStudio — Assets & typography (stage 2)

Follow-up to stages 0–1. Covers where images live, the favicon strategy,
the `next/font` weight audit, and the `Image` primitive that later stages
should use everywhere over raw `<img>` or bare `next/image` calls.

---

## 1. Image migration

Every asset from the legacy static site's `assets/img/` directory is now
mirrored under `public/assets/img/` with the same filenames. Keeping the
filenames identical means blog articles and newsletter issues can be
ported from the legacy HTML sources in stage 5 without a URL-rewrite pass.

| Kind                                  | Count  | Location                          |
| ------------------------------------- | ------ | --------------------------------- |
| Raster (logo, hero, favicon)          | 3      | `public/assets/img/*.{png,jpg}`   |
| Topic SVG banners (blog + newsletter) | 15     | `public/assets/img/banners/*.svg` |
| **Total**                             | **18** |                                   |

The legacy `assets/img/` at the repo root is **intentionally untouched**
so `main` can continue auto-deploying the static site during the rebuild.
It will be deleted at stage-14 cutover.

Reference the migrated assets from Next code as absolute paths from the
root: `src="/assets/img/logo.png"`, `src="/assets/img/banners/banner-mcp-orchestrator.svg"`.

## 2. Favicons

The legacy site shipped a single 1250×1250 95 KB PNG for the favicon,
letting the browser resample it for every use. Stage 2 replaces that
with a purpose-built set generated at the required device sizes:

| File                  | Size    | Bytes  | Purpose                                                       |
| --------------------- | ------- | ------ | ------------------------------------------------------------- |
| `app/icon.png`        | 32×32   | 3.4 KB | Browser tab favicon (auto-linked by Next 15)                  |
| `app/apple-icon.png`  | 180×180 | 22 KB  | iOS home-screen icon (auto-linked by Next 15)                 |
| `public/icon-192.png` | 192×192 | 24 KB  | Android maskable icon (referenced by PWA manifest in stage 4) |
| `public/icon-512.png` | 512×512 | 74 KB  | Android maskable icon (referenced by PWA manifest in stage 4) |

**Total bytes shipped: ~123 KB** across four right-sized files, vs. the
legacy 95 KB single file that would be resampled downward for every use.
The stage-4 SEO pass will add a `manifest.webmanifest` that references
the 192/512 sizes; until then only `icon.png` and `apple-icon.png` are
actively wired via Next 15's file-based icon convention.

**Generation tool**: macOS built-in `sips` (`sips -z SIZE SIZE src.png
--out dst.png`). No third-party dependency added for a one-shot
resize. If a future stage needs to regenerate these (new logo, different
crop), rerun the same commands from `docs/assets.md#regenerate` below.

### Regenerate

```bash
SRC=public/assets/img/favicon.png
sips -z  32  32 "$SRC" --out app/icon.png
sips -z 180 180 "$SRC" --out app/apple-icon.png
sips -z 192 192 "$SRC" --out public/icon-192.png
sips -z 512 512 "$SRC" --out public/icon-512.png
```

---

## 3. Font weight audit

The stage-1 setup loaded conservative weight ranges before real usage
was known. Stage 2 grepped the codebase for every `font-*` utility and
trimmed to the actual set.

| Family                  | Before                      | After     | Rationale                                                                                                        |
| ----------------------- | --------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| Space Grotesk (display) | `["500", "700"]`            | `["700"]` | Only `font-bold` (700) is used, on `<Heading level="h1"/>` and `<Heading level="h2"/>`. 500 was unused.          |
| Inter (sans)            | variable font (all weights) | unchanged | Variable font — single file already covers 400/500/600/700 with no per-weight cost.                              |
| JetBrains Mono (mono)   | `["400", "600"]`            | `["400"]` | Only used with the default weight on `<code>` and mono labels. No mono `font-semibold` anywhere in the codebase. |

**Adding a new weight** requires editing `app/layout.tsx` to add it to
the appropriate `weight: [...]` array. The Space Grotesk and JetBrains
Mono declarations are annotated inline so a future dev will see the
audit expectation before growing the array.

---

## 4. The `Image` primitive

`components/ui/Image.tsx` — a thin wrapper around `next/image` that
enforces `alt`, exposes token-aware `aspect` and `radius` props, and
supports two modes:

### `fill` mode — image fills its parent

Use when the container defines the size (cards, hero panels, grid tiles).
`sizes` is required for correct `srcSet` selection.

```tsx
<Image
  src="/assets/img/banners/banner-mcp-orchestrator.svg"
  alt="MCP Orchestrator article banner"
  fill
  aspect="16/9"
  radius="lg"
  sizes="(max-width: 768px) 100vw, 33vw"
/>
```

The wrapper `<div>` is `relative`, `overflow-hidden`, gets the aspect
ratio and radius. The inner `<Image fill>` gets `object-cover`.

### Fixed mode — natural width/height

Use for logos, icons rendered as images, anything with intrinsic
dimensions.

```tsx
<Image src="/assets/img/logo.png" alt="Platform Ops Studio logo" width={170} height={100} />
```

### API

| Prop               | Type                                             | Notes                                              |
| ------------------ | ------------------------------------------------ | -------------------------------------------------- |
| `src`              | `string \| StaticImageData`                      | Public path or imported static asset               |
| `alt`              | `string` (required)                              | Enforced by TypeScript                             |
| `aspect`           | `"square" \| "4/3" \| "3/2" \| "16/9" \| "21/9"` | Optional                                           |
| `radius`           | `"none" \| "sm" \| "md" \| "lg" \| "xl"`         | Default `"none"`                                   |
| `fill`             | `true \| false`                                  | Selects fill vs fixed mode                         |
| `sizes`            | `string`                                         | Required when `fill: true`                         |
| `width` / `height` | `number`                                         | Required when `fill: false`                        |
| `priority`         | `boolean`                                        | Optional — pass on above-the-fold hero images only |

### When NOT to use it

Reach for `next/image` directly when a page needs fine control the
primitive doesn't expose (blur placeholders, custom loaders, image
transforms). This wrapper covers the 90% case.

---

## 5. Verify at `/design`

The **Images** section on `/design` renders four representative cases:

- SVG banner in `fill · 16:9 · radius-lg` (blog/newsletter card)
- JPEG hero in `fill · 3:2 · radius-lg` (home hero mock)
- PNG logo in `fixed · natural size` (header mock)
- Favicon set at 32 / 180 / 192 / 512 (rendered from actual generated PNGs)

If a future asset change (new logo, replaced banner) breaks any of those,
the diff will show up on that page.
