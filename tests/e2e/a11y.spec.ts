import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Axe accessibility scan on every top-level route. We run WCAG 2.2 AA
 * rules and fail on any violation. Rules the design system intentionally
 * bends can be added to `disableRules` with a written justification in
 * docs/a11y.md — none right now.
 */
const routes = ["/", "/blogs", "/newsletter", "/contact", "/privacy-policy", "/legal-notice"];

for (const path of routes) {
  test(`axe: ${path}`, async ({ page }) => {
    await page.goto(path);
    // Dismiss the consent banner so its dialog doesn't cover other UI
    // during the scan — decline records the choice without loading
    // anything, which is what we want anyway.
    const decline = page.getByRole("button", { name: "Decline" });
    if (await decline.isVisible().catch(() => false)) await decline.click();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}
