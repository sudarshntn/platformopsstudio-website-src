import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright e2e config.
 *
 * webServer: spin up `next start` on 3100 (isolated port so a live
 * `pnpm dev` doesn't collide). Tests run against a real production
 * build — closest to what ships.
 *
 * projects: single Chromium project. Cross-browser matrix runs in CI
 * only via env flag when we opt in; local dev + PR gate stay fast on
 * one engine.
 */
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  ...(isCI ? { workers: 2 } : {}),
  reporter: isCI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm build && pnpm start -- -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
