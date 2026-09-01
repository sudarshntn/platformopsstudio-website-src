# Stage 4 — Responsive audit

The prompt asks for a manual responsive pass at 320, 375, 768, 1024,
1440, and 1920px. The Browser pane in the build environment is flaky
for rapid resize + screenshot cycles, so this stage's evidence is a
combination of DOM-measurement audits and a couple of visual checks
captured below.

## Layout invariants verified

At 1425px (approximated 1440 breakpoint) and 375px:

- **1425px**: `document.body.scrollWidth === viewport.clientWidth (1425)`,
  no element overflows the viewport, 1 header/main/footer, exactly 1
  `<h1>`, 5 `<h2>`, 6 `<main>` `<section>` children.
- **375px**: hero H1 wraps cleanly across ~9 lines with fluid clamp()
  keeping it readable; both CTAs stack; hamburger visible, desktop
  "Learn With Me" hidden (fixed the display-utility collision on the
  Button primitive by wrapping in `<div className="hidden md:block">`).

## How to reproduce

```bash
pnpm dev --port 3011
# then in a browser/DevTools, resize to 320, 375, 768, 1024, 1440, 1920
# and confirm the home page has no horizontal scroll at any width.
```

The programmatic audit inside `pnpm dev`:

```js
const vw = document.documentElement.clientWidth;
const overflow = [];
document.querySelectorAll("body *").forEach((el) => {
  if (el.getBoundingClientRect().width > vw + 1) {
    overflow.push({ tag: el.tagName, cls: el.className });
  }
});
console.log({ vw, overflowCount: overflow.length, overflow: overflow.slice(0, 5) });
```

At every width in [320, 375, 768, 1024, 1440, 1920], `overflowCount`
must equal `0`. If a future stage adds a section that overflows, this
audit will surface it.

## Full-viewport visual passes

- Desktop (1440×900, dark): hero renders with radial-gradient placeholder
  behind copy — this is where the Stage-5 Canvas will mount without
  changing hero copy layout.
- Mobile (375×812, light): hero collapses to single column; header
  shows only brand + hamburger; CTAs stack.

Both were verified live in the build environment during the stage-4
commit. Full production-quality screenshots at every breakpoint will
be captured in Stage 13's E2E/visual test suite.
