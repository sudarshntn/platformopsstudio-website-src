#!/usr/bin/env bash
# Hostinger auto-deploy hook. Runs after Hostinger pulls the repo into
# hbuilds/source/repository. Produces a runnable .next and a pruned
# node_modules for `next start`.
#
# Package manager: pnpm via Corepack. Hostinger's runner enables
# Corepack, which reads the "packageManager" field in package.json.
# Keep that field aligned with what Hostinger currently ships (see
# error "Corepack invoked pnpm with this version, and pnpm does not
# switch versions when running under corepack").
set -euo pipefail

echo "› node $(node -v)"
corepack enable >/dev/null 2>&1 || true
echo "› pnpm $(pnpm -v)"

# Frozen install honours pnpm-lock.yaml exactly. Dev deps included
# because Next needs a bunch at build time (typescript, tailwindcss,
# postcss, next-mdx-remote, etc.).
pnpm install --frozen-lockfile

# Build the App Router bundle.
pnpm build

# Slim the runtime image — drop dev deps for the server process.
pnpm prune --prod

echo "› build complete — .next/ and pruned node_modules ready"
