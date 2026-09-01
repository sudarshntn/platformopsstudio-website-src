# Consent

## What the site does today

- Loads **zero** analytics or advertising scripts.
- Sets **zero** cookies from the site's own origin at HTTP layer.
- Uses **one** first-party `localStorage` entry (`pos:cookie-consent`) to remember your response to the cookie banner. Nothing else is stored client-side.

## What the banner does

The banner ([components/consent/CookieBanner.tsx](../components/consent/CookieBanner.tsx)) surfaces on first visit when `localStorage[pos:cookie-consent]` is absent. It gives the visitor two choices:

- **Accept** — records `accepted`. **No script is loaded today.** This is a placeholder for a future opt-in analytics integration; the spec's "if desired" trigger. If we ever add analytics, the loader will gate on `getConsent() === "accepted"` from [lib/consent.ts](../lib/consent.ts).
- **Decline** — records `declined`. No script would load even if we did add one, until the user revised their choice.

Either choice dismisses the banner. The footer's **Cookie preferences** link ([components/consent/CookiePrefsLink.tsx](../components/consent/CookiePrefsLink.tsx)) dispatches a `manage-cookies` window event that re-opens the banner so a visitor can revise their answer at any time.

## Why "no analytics loaded" is the right default

The spec left analytics as **if desired**, not a requirement. The consent record is what regulators care about — the plumbing is here from day one, so adding a real analytics loader later is a one-liner (gate on `getConsent()`, wire the `consentchange` event) with no ambiguity about historical consent.

## Cross-tab sync

Consent changes dispatch a `CustomEvent("consentchange", { detail: value })` on `window` for same-tab subscribers, and the browser's native `storage` event handles cross-tab sync of the `pos:cookie-consent` key for free. Loaders should listen to both if they need to react without a reload.

## Legal pages

Both legal pages are MDX with plain frontmatter (title, updated date). Content lives at:

- [content/legal/privacy-policy.mdx](../content/legal/privacy-policy.mdx)
- [content/legal/legal-notice.mdx](../content/legal/legal-notice.mdx)

Rendered by the route pages under [app/(site)/privacy-policy/page.tsx](<../app/(site)/privacy-policy/page.tsx>) and [app/(site)/legal-notice/page.tsx](<../app/(site)/legal-notice/page.tsx>) using the same MDX pipeline as blog/newsletter — reuse the same `mdxComponents` map so links, headings, and typography stay consistent.
