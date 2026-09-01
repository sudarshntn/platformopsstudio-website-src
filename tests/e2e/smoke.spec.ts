import { expect, test } from "@playwright/test";

/**
 * Smoke test — every top-level route responds 200 and shows its
 * expected h1. Faster than axe (no accessibility scan) so it stays a
 * pre-commit / pre-push kind of check.
 */
const routes: Array<{ path: string; h1: RegExp }> = [
  { path: "/", h1: /Platform Engineering|DevSecOps/i },
  { path: "/blogs", h1: /^Blogs$/ },
  { path: "/newsletter", h1: /Platform Pulse/i },
  { path: "/contact", h1: /Connect and Collaborate/i },
  { path: "/privacy-policy", h1: /Privacy/ },
  { path: "/legal-notice", h1: /Legal Notice/ },
];

for (const r of routes) {
  test(`${r.path} loads`, async ({ page }) => {
    const res = await page.goto(r.path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText(r.h1);
  });
}

test("skip link is the first focusable element", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
  expect(focused).toBe("Skip to content");
});

test("cookie banner appears on first visit and dismisses on decline", async ({ page }) => {
  await page.goto("/");
  const banner = page.getByRole("dialog", { name: "Cookie preferences" });
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Decline" }).click();
  await expect(banner).toBeHidden();
});
