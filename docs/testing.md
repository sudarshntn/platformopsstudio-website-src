# Testing

Two lanes, each with its own gate.

## Unit — Vitest, Node env

Fast, pure-logic tests. Scoped to modules where a regression would silently ship the wrong output:

- [tests/unit/contact-schema.test.ts](../tests/unit/contact-schema.test.ts) — every ContactSchema rule that the API contract depends on.
- [tests/unit/consent.test.ts](../tests/unit/consent.test.ts) — localStorage round-trip + `consentchange` event dispatch.
- [tests/unit/jsonld.test.ts](../tests/unit/jsonld.test.ts) — schema.org shapes; explicit test that `jsonLdScript()` escapes `</script>` (XSS-in-JSON-LD is a real class of bug).

```bash
pnpm test         # single run
pnpm test:watch   # dev loop
```

We deliberately do **not** run component tests through jsdom. UI behaviour that would need a DOM (focus movement, dialogs, aria-live updates) is covered by Playwright, which is closer to the real browser.

## E2E — Playwright + axe

Runs against a real `next start` production build on port 3100 ([playwright.config.ts](../playwright.config.ts)).

- [tests/e2e/smoke.spec.ts](../tests/e2e/smoke.spec.ts) — every top-level route responds 200 and shows its expected h1; the skip link is the first focusable element; the cookie banner appears and dismisses.
- [tests/e2e/a11y.spec.ts](../tests/e2e/a11y.spec.ts) — `@axe-core/playwright` scan on every top-level route with WCAG 2.2 AA rule tags. Zero violations expected. Any rule we intentionally bend gets added to `disableRules` here with a written justification in [a11y.md](./a11y.md) — currently none.

```bash
pnpm e2e          # headless
pnpm e2e:ui       # Playwright UI mode for local debugging
```

First-time only: `pnpm exec playwright install --with-deps chromium`.

## CI

[.github/workflows/ci.yml](../.github/workflows/ci.yml) runs on push and PR to `next-rebuild` and `main`. Two jobs in parallel:

1. **Lint · Typecheck · Unit** — three independent steps so a red one is immediately obvious.
2. **E2E · Axe** — separate job so unit failures don't block the report from being visible.

The e2e job uploads the Playwright HTML report on failure (7-day retention).
