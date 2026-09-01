import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Vitest — Node-env unit tests. Kept intentionally small: only
 * pure-logic modules (schemas, formatters, consent helpers, RSS
 * renderer) are worth unit-testing here. UI behaviour is verified by
 * Playwright + axe end-to-end, which is closer to the real thing than
 * jsdom would be.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    globals: false,
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
