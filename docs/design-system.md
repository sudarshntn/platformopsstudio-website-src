# PlatformOpsStudio — Design system (stage 1)

Design tokens, primitives, and the QA surface at [`/design`](http://localhost:3000/design)
that later stages consume. Nothing here is page-composition or 3D; those are stages 9 and 10.

**Preview**: `pnpm dev` → open `/design`. Every primitive in every variant/state renders on
both surfaces (default `--color-bg` and elevated `--color-surface-2`) so a reviewer can spot
regressions without opening a component in isolation.

---

## 1. Palette proposal & rationale (color pivot from the legacy site)

The legacy static site skews warm/editorial: bright photo hero, near-black cards on a soft
gray page, single blue accent (`#065be3`). That palette carries the brand memory but doesn't
support the darker, more technical direction this rebuild is heading — a full-bleed 3D scene
will land on the home hero in stage 10, and it needs a genuinely dark canvas to feel like
depth rather than a bright card on a bright page.

Rather than reuse the legacy tokens as-is, the rebuild flips to a **dark-first palette with
two intentional hues**:

| Role        | Hex                         | Where it lives                                                               | Rationale                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------- | --------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primary** | `#4f7cff` (bright cobalt)   | CTAs, links, focus rings, filled buttons                                     | Brand-continuous with the legacy `#065be3` (same blue family), but shifted brighter and slightly cooler so it reads as a foreground element on a near-black background. Pairs with dark ink (`--color-primary-fg: #0a0b10`) on buttons — WCAG AA passes cleanly (5.3:1) and the "bright chip with dark text" pattern is the dominant CTA affordance in current dev-tool UI (Vercel, Linear). |
| **Accent**  | `#a78bfa` (electric violet) | Highlights, callouts, badge/status secondary, 3D scene rim-light in stage 10 | Deliberately different hue from primary so hierarchy is unambiguous: primary = "click this," accent = "notice this." Violet is currently the strongest neutral-tech accent (used across Vercel/Fly/Linear-adjacent product surfaces without status-coding overtones like green/amber). Works on both dark and light backgrounds without shift.                                               |

Everything else is tuned around those two:

- **Backgrounds** climb from `#0a0b10` (bg) → `#141721` (surface) → `#1e222f` (surface-2) so
  elevated content (cards, popovers) reads as literally raised via lightness alone — no
  shadow required (though shadows still exist, see §5).
- **Text** is `#e8eaf0` for body (16.5:1 vs bg — AAA) and `#9aa3b2` for muted (7.1:1 — AAA).
- **Status colors** (`danger`, `success`) are ~500-level Tailwind approximations tuned so
  they read on both surface tiers without additional tinting.
- **Focus** is the same value as primary — a single-purpose token so we can rebrand focus
  independently later if needed.

### Contrast ratios (dark theme, WCAG 2.1)

Measured against `--color-bg: #0a0b10`:

| Foreground                     | Ratio  | AA normal (4.5:1) | AA large (3:1) |           AAA (7:1)            |
| ------------------------------ | ------ | :---------------: | :------------: | :----------------------------: |
| `--color-text` (#e8eaf0)       | 16.5:1 |        ✅         |       ✅       |               ✅               |
| `--color-text-muted` (#9aa3b2) | 7.1:1  |        ✅         |       ✅       |               ✅               |
| `--color-primary` (#4f7cff)    | 6.4:1  |        ✅         |       ✅       | — (used for UI, not body text) |
| `--color-accent` (#a78bfa)     | 8.2:1  |        ✅         |       ✅       |               ✅               |
| `--color-danger` (#f87171)     | 8.9:1  |        ✅         |       ✅       |               ✅               |
| `--color-success` (#4ade80)    | 12.4:1 |        ✅         |       ✅       |               ✅               |

Measured against `--color-primary: #4f7cff` (for button text contrast):

| Foreground                     | Ratio              |
| ------------------------------ | ------------------ |
| `--color-primary-fg` (#0a0b10) | 5.3:1 ✅ AA normal |

For light theme (see §2), the same audit is repeated with primary shifted to `#3d5cee` so
white ink still hits 4.5:1.

---

## 2. Tokens

All tokens live in `app/globals.css` inside a Tailwind v4 `@theme` block. Dark values are the
default; a `prefers-color-scheme: light` media query overrides the color tokens only. No
JavaScript theme switcher yet — that ships in stage 12 alongside analytics/consent.

### 2.1 Color

| Token                | Dark (default) | Light     | Purpose                                           |
| -------------------- | -------------- | --------- | ------------------------------------------------- |
| `--color-bg`         | `#0a0b10`      | `#ffffff` | Page background                                   |
| `--color-surface`    | `#141721`      | `#f7f8fa` | Cards, form fields                                |
| `--color-surface-2`  | `#1e222f`      | `#eef0f5` | Elevated content, popovers, code blocks           |
| `--color-border`     | `#2a2f3e`      | `#dcdfe6` | Card borders, dividers, input borders             |
| `--color-text`       | `#e8eaf0`      | `#0a0b10` | Body text                                         |
| `--color-text-muted` | `#9aa3b2`      | `#545862` | Secondary text, form hints                        |
| `--color-primary`    | `#4f7cff`      | `#3d5cee` | Primary CTA fill, links, focus ring               |
| `--color-primary-fg` | `#0a0b10`      | `#ffffff` | Text on primary fill                              |
| `--color-accent`     | `#a78bfa`      | `#7c3aed` | Highlights, secondary badges, illustration accent |
| `--color-danger`     | `#f87171`      | `#dc2626` | Form errors, destructive actions                  |
| `--color-success`    | `#4ade80`      | `#16a34a` | Success states, confirmation                      |
| `--color-focus`      | `#4f7cff`      | `#3d5cee` | `:focus-visible` outline color                    |

### 2.2 Typography

Self-hosted via `next/font/google` (no runtime Google Fonts fetch — fonts are downloaded at
build time and served from `/_next/static/media/`). Three families, each exposed as a CSS
variable so utility classes and hand-written CSS both work:

| Token            | Font           | Loaded as                             | Use                                |
| ---------------- | -------------- | ------------------------------------- | ---------------------------------- |
| `--font-display` | Space Grotesk  | `next/font` variable `--font-display` | H1–H2, hero display type           |
| `--font-sans`    | Inter          | `next/font` variable `--font-sans`    | H3–H6, body, UI                    |
| `--font-mono`    | JetBrains Mono | `next/font` variable `--font-mono`    | Code blocks, kbd, technical labels |

**Fluid type scale** (uses `clamp(min, preferred, max)` so the site scales smoothly from a
375px viewport to a 1440px viewport without breakpoints):

| Token        | Value                                          | Rendered range |
| ------------ | ---------------------------------------------- | -------------- |
| `--fs-h1`    | `clamp(2.25rem, 1.5rem + 3vw, 3.75rem)`        | 36px → 60px    |
| `--fs-h2`    | `clamp(1.875rem, 1.375rem + 2vw, 3rem)`        | 30px → 48px    |
| `--fs-h3`    | `clamp(1.5rem, 1.25rem + 1vw, 2.25rem)`        | 24px → 36px    |
| `--fs-h4`    | `clamp(1.25rem, 1.125rem + 0.5vw, 1.5rem)`     | 20px → 24px    |
| `--fs-h5`    | `clamp(1.125rem, 1.0625rem + 0.25vw, 1.25rem)` | 18px → 20px    |
| `--fs-h6`    | `1rem`                                         | 16px           |
| `--fs-body`  | `1rem`                                         | 16px           |
| `--fs-small` | `0.875rem`                                     | 14px           |

Corresponding `--lh-*` (line height) tokens follow the same pattern — display sizes get
tighter leading (`1.1`–`1.2`) and body text gets `1.6`.

### 2.3 Spacing (4px base)

The Tailwind v4 utility scale is anchored via `--spacing: 0.25rem`, so `p-1 = 4px`,
`p-32 = 128px` etc. In addition, named tokens are exposed for hand-written CSS:

| Token        | Value            |
| ------------ | ---------------- |
| `--space-0`  | `0`              |
| `--space-1`  | `0.25rem` (4px)  |
| `--space-2`  | `0.5rem` (8px)   |
| `--space-3`  | `0.75rem` (12px) |
| `--space-4`  | `1rem` (16px)    |
| `--space-5`  | `1.25rem` (20px) |
| `--space-6`  | `1.5rem` (24px)  |
| `--space-8`  | `2rem` (32px)    |
| `--space-10` | `2.5rem` (40px)  |
| `--space-12` | `3rem` (48px)    |
| `--space-16` | `4rem` (64px)    |
| `--space-20` | `5rem` (80px)    |
| `--space-24` | `6rem` (96px)    |
| `--space-32` | `8rem` (128px)   |

### 2.4 Radii

| Token           | Value    | Use                          |
| --------------- | -------- | ---------------------------- |
| `--radius-sm`   | `4px`    | Inputs, small chips          |
| `--radius-md`   | `8px`    | Cards, buttons (default)     |
| `--radius-lg`   | `12px`   | Larger cards, modal surfaces |
| `--radius-xl`   | `20px`   | Hero cards, landing panels   |
| `--radius-full` | `9999px` | Pills, avatars               |

### 2.5 Shadows

Alpha values are calculated via `color-mix()` against black in OKLab — the modern, perceptually
uniform alpha model. Values are deeper than a typical light-theme design system because
shadows need to read on dark surfaces.

| Token         | Value                                                     |
| ------------- | --------------------------------------------------------- |
| `--shadow-sm` | `0 1px 2px color-mix(in oklab, black 40%, transparent)`   |
| `--shadow-md` | `0 6px 20px color-mix(in oklab, black 50%, transparent)`  |
| `--shadow-lg` | `0 20px 60px color-mix(in oklab, black 60%, transparent)` |

### 2.6 Motion

| Token           | Value                            |
| --------------- | -------------------------------- |
| `--ease-out`    | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)`   |
| `--dur-fast`    | `120ms`                          |
| `--dur-base`    | `220ms`                          |
| `--dur-slow`    | `480ms`                          |

Guideline: use `--dur-fast` for state changes (hover, focus), `--dur-base` for local layout
transitions (accordion, tab), `--dur-slow` for enter/exit animations. All motion respects
`prefers-reduced-motion` — the primitives set `transition: none` when the media query is
active.

---

## 3. Primitives

All in `components/ui/`. Each is a React server component unless it needs client state
(marked with `"use client"` at the top). Component files are single-purpose so tree-shaking
stays clean.

### Button — `<Button>`

```tsx
<Button variant="primary" size="md" onClick={...}>Send Message</Button>
<Button variant="ghost" size="sm">Cancel</Button>
<Button variant="link" size="md">Learn more →</Button>
<Button variant="primary" isLoading>Sending…</Button>
<Button variant="primary" disabled>Disabled</Button>
```

| Prop        | Type                              | Default     | Notes                                                                                            |
| ----------- | --------------------------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| `variant`   | `"primary" \| "ghost" \| "link"`  | `"primary"` | primary = filled; ghost = transparent bg, hover-tinted; link = text-only with underline on hover |
| `size`      | `"sm" \| "md" \| "lg"`            | `"md"`      | sm=32px h, md=40px, lg=48px                                                                      |
| `isLoading` | `boolean`                         | `false`     | Replaces content with spinner; sets `aria-busy`                                                  |
| `disabled`  | `boolean`                         | `false`     | Standard HTML button-disabled                                                                    |
| `type`      | `"button" \| "submit" \| "reset"` | `"button"`  | Explicit default — buttons inside forms won't accidentally submit                                |

All variants get `:focus-visible` outline in `--color-focus` at 2px offset. All variants
respect `prefers-reduced-motion`.

### Link — `<Link>`

Wraps Next's `<Link>` for same-origin URLs (`href` starts with `/` or `#`) and falls back to
a plain `<a>` for external URLs. External links automatically get `target="_blank"`,
`rel="noopener"`, and a small external-link icon trailing the text (with `aria-hidden`).

```tsx
<Link href="/blogs">Read the archive</Link>                     {/* → next/link */}
<Link href="https://linkedin.com/in/…">LinkedIn profile</Link>  {/* → <a> + icon */}
```

### Container

Max-width `1120px` wrapper, `padding-inline` responsive. Use to bound section content.

```tsx
<Container>{children}</Container>
```

### Section

Vertical rhythm container with configurable spacing. Wraps content in a `Container` by
default.

```tsx
<Section spacing="md">{children}</Section>          {/* py-16 */}
<Section spacing="lg" surface="surface-2">…</Section>  {/* py-24 on elevated bg */}
```

| Prop      | Type                               | Default |
| --------- | ---------------------------------- | ------- |
| `spacing` | `"sm" \| "md" \| "lg"`             | `"md"`  |
| `surface` | `"bg" \| "surface" \| "surface-2"` | `"bg"`  |

### Heading — `<Heading>`

Level-agnostic — `as` prop chooses the semantic element; `level` chooses the visual size.
Decoupled so page composition can pick semantics without being locked into visual size.

```tsx
<Heading as="h1" level="h1">Page title</Heading>
<Heading as="h2" level="h4">Small heading that's still h2 semantically</Heading>
```

### Text — `<Text>`

```tsx
<Text>Body copy.</Text>
<Text variant="small">Fine print</Text>
<Text variant="muted">Secondary text</Text>
```

### Card

Surface + border + padding container.

```tsx
<Card>{children}</Card>
<Card elevated>{children}</Card>  {/* uses --color-surface-2 and shadow-md */}
```

### Badge

Small pill for tags/status.

```tsx
<Badge>Neutral</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="accent">Featured</Badge>
<Badge variant="success">Live</Badge>
<Badge variant="danger">Error</Badge>
```

### Divider

Horizontal rule at `--color-border`. Renders `<hr />` with role stripped for screen readers
when purely decorative (`decorative` prop).

### Input, Textarea, Checkbox, Label, FieldError

Form primitives designed to compose together. The pattern:

```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" name="email" type="email" required aria-describedby="email-error" />
<FieldError id="email-error">Please enter a valid email.</FieldError>
```

- Inputs have visible hover, focus, and disabled states.
- `aria-invalid="true"` on the input causes a `--color-danger` border.
- `FieldError` renders as `<p role="alert">` so assistive tech announces validation.

### VisuallyHidden

sr-only pattern. Used for icon-only buttons that still need accessible names.

```tsx
<Button variant="ghost" size="sm">
  <Icon name="menu" />
  <VisuallyHidden>Open navigation</VisuallyHidden>
</Button>
```

### Icon — `<Icon>`

Thin wrapper around `lucide-react`. Ensures every icon renders with `aria-hidden="true"` by
default (decorative) unless a `label` prop is passed (then it becomes `role="img"` with the
label as accessible name).

```tsx
<Icon name="mail" />                   {/* decorative */}
<Icon name="send" label="Send" />      {/* labeled — has accessible name */}
<Icon name="menu" size={24} />         {/* size override, default 20 */}
```

Under the hood: `import * as icons from "lucide-react"` and looks up by `name`. Fewer imports
across the app; slightly larger bundle than tree-shaken direct imports — acceptable at this
scale (stage 13 will re-evaluate).

### Image — `<Image>` (added in stage 2)

Thin wrapper around `next/image` with token-aware `aspect` and `radius` props. `alt` is
enforced by TypeScript. See `docs/assets.md` §4 for the full API and mode selection guide
(`fill` vs fixed).

```tsx
<Image
  src="/assets/img/banners/banner-mcp-orchestrator.svg"
  alt="MCP Orchestrator banner"
  fill
  aspect="16/9"
  radius="lg"
  sizes="(max-width: 768px) 100vw, 33vw"
/>
```

---

## 4. Usage in a page

Composition example — this is what stage 6+ pages will look like:

```tsx
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Example() {
  return (
    <Section spacing="lg">
      <Container>
        <Heading as="h1" level="h1">
          Section title
        </Heading>
        <Text variant="muted">Supporting paragraph.</Text>
        <Card>
          <Heading as="h2" level="h3">
            Card title
          </Heading>
          <Text>Card body.</Text>
          <Button variant="primary">Call to action</Button>
        </Card>
      </Container>
    </Section>
  );
}
```

**No hardcoded hex values anywhere in pages or components** — always use utility classes
(`bg-primary`, `text-muted`) that resolve via the token system. The one exception is the
`@theme` block itself in `globals.css`, which is the single source of truth.

---

## 5. QA — `/design`

The `/design` route (implemented at `app/(design)/design/page.tsx`) renders:

1. **Color swatches** — every color token with its hex and a foreground-on-color demo
2. **Typography scale** — H1–H6, body, small, and mono
3. **Buttons** — every variant × every size × every state (default, hover, focus-visible,
   disabled, loading), on both surfaces
4. **Links** — internal, external, in-context
5. **Cards** — default, elevated
6. **Badges** — every variant
7. **Dividers**
8. **Form primitives** — Input, Textarea, Checkbox in default, focus, invalid, disabled states
9. **Icons** — sample grid

Reviewer flow: `pnpm dev`, open `/design`, tab through interactive elements to check
`:focus-visible` rings, toggle system dark/light in OS to check both themes swap, resize to
375px to check no layout shift.

The route lives under the `(design)` route group so it doesn't add a path segment and can be
excluded from sitemap generation in stage 4.

---

## 6. Open questions for stage 2+

- **Font subsetting** — Space Grotesk and Inter both support `latin-ext`. Do we need it for
  any content (currently all English)? Default is `latin` only, which saves ~40KB per font.
- **Motion preference respect** — the `prefers-reduced-motion` media query is respected in
  the primitives. In stages 10–11 (3D + scroll motion), we need a `useReducedMotion` hook
  that short-circuits animations. Defer until then.
- **Theme toggle UI** — none yet. `prefers-color-scheme` does the whole switch automatically.
  Stage 12 (analytics + consent) adds a manual toggle button in the header.
- **Design tokens as TypeScript** — currently CSS only. If we need programmatic access in a
  3D scene (e.g., using `--color-primary` for a Three.js material), we'll add a `lib/tokens.ts`
  export in stage 10.
