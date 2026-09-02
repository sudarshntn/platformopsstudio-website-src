#!/usr/bin/env bash
# Hostinger auto-deploy hook. Runs after Hostinger pulls the repo into
# hbuilds/source/repository. We install prod + build deps, produce the
# .next output, and prune to production-only for the runtime image.
#
# Hostinger's default runner is npm (not pnpm). We stay on npm here so
# the environment matches what Hostinger provides — a pnpm binary is
# not on PATH and Next's auto-install fallback (see next.config.mjs
# comment) is what caused the earlier ENOENT.
set -euo pipefail

echo "› node $(node -v)  ·  npm $(npm -v)"

# --include=dev because Next needs a bunch of dev deps at build time
# (typescript, tailwindcss, postcss, next-mdx-remote, etc.).
npm ci --include=dev

# Build the App Router bundle.
npm run build

# Drop dev deps for the runtime image so node_modules stays lean.
npm prune --omit=dev

echo "› build complete — .next/ and pruned node_modules ready"
