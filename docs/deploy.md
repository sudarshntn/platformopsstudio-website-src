# Deploy — Hostinger Node.js hosting

Target platform: Hostinger Web Hosting **Node.js** plan (not the static plan). The full Next.js runtime is required — Route Handlers (`/api/contact`), ISR (`/blogs`, `/newsletter`), and server components all need `next start`.

## One-time Hostinger setup

1. **hPanel → Websites → Manage → Advanced → Node.js**
   - Node version: 22.x (LTS).
   - Application root: `/home/<user>/domains/platformopsstudio.com/nextapp`
   - Application URL: `platformopsstudio.com`
   - Application startup file: `node_modules/next/dist/bin/next` with args `start -p $PORT`.
   - **Important:** Hostinger passes the actual listening port via `$PORT`. `next start` reads `-p` from CLI, so pass `$PORT` there — do not hardcode 3000.
2. **hPanel → Advanced → Environment Variables** — set:
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_SITE_URL=https://platformopsstudio.com`
   - `RESEND_API_KEY=<paste from Resend dashboard>`
   - `CONTACT_TO_EMAIL=ramsudarsan@gmail.com`
3. **hPanel → SSL** — turn on Force HTTPS. Hostinger's Let's Encrypt cert renews automatically.

## Build artifact

Every deploy ships **only** what `next start` needs, not the whole source tree:

```
.next/                # build output — required at runtime
public/               # static assets served by next
package.json          # pnpm reads this at install
pnpm-lock.yaml        # frozen versions
node_modules/         # pruned production deps (see below)
```

Locally build and pack:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm prune --prod
tar --exclude='.next/cache' -czf release.tar.gz .next public package.json pnpm-lock.yaml node_modules
```

Upload `release.tar.gz` via SFTP to `~/domains/platformopsstudio.com/nextapp/`, then over SSH:

```bash
cd ~/domains/platformopsstudio.com/nextapp
tar -xzf release.tar.gz
rm release.tar.gz
# hPanel → Node.js → Restart Application
```

The GitHub Actions workflow at [.github/workflows/deploy-hostinger.yml](../.github/workflows/deploy-hostinger.yml) automates all of this on push to `next-rebuild` once the two SSH secrets are set (see below).

## GitHub Actions — automated deploy

Required repository secrets (Settings → Secrets and variables → Actions):

| Name                 | Value                                                                 |
| -------------------- | --------------------------------------------------------------------- |
| `HOSTINGER_SSH_HOST` | Hostinger SSH host (from hPanel → Advanced → SSH Access).             |
| `HOSTINGER_SSH_PORT` | SSH port (usually `65002`).                                           |
| `HOSTINGER_SSH_USER` | SSH username.                                                         |
| `HOSTINGER_SSH_KEY`  | Private key (paste PEM), matched to a key added in hPanel.            |
| `HOSTINGER_APP_DIR`  | `/home/<user>/domains/platformopsstudio.com/nextapp`                  |
| `RESEND_API_KEY`     | For build-time env parity, if the build needs it (it does not today). |

The workflow builds on a hosted runner (Node 22, pnpm), rsyncs the pruned artifact, and calls `hpanel` restart via SSH by re-touching a sentinel file Hostinger watches (`~/.restart` — Hostinger auto-restarts the app when it changes).

## DNS cutover

The domain currently resolves to the legacy static-site host (UENI). Switch when the new deploy on Hostinger is green:

1. In the registrar (or wherever the DNS is), point `A @` and `AAAA @` records at Hostinger's shared IP (in hPanel → Domains → DNS Zone Editor). Keep TTL at 300 the day before, 3600 after.
2. Point `CNAME www` at `platformopsstudio.com`.
3. Wait for propagation (5–15 minutes with TTL 300). Verify with `dig platformopsstudio.com +short`.
4. In Hostinger SSL, force-renew the Let's Encrypt cert against the new records.
5. Test the legacy URLs return 301 to the new clean routes:
   ```bash
   for path in /index.html /blogs.html /newsletter.html /contact.html /legal-notice.html /privacy-policy.html /resources.html /resources/some-slug.html; do
     printf "%-42s → %s\n" "$path" "$(curl -sI https://platformopsstudio.com$path | head -1)"
   done
   ```
   Every line should show `HTTP/2 301`.

## Rollback

Every artifact stays in `~/domains/platformopsstudio.com/releases/<git-sha>/` for the last five deploys. The `nextapp` directory is a symlink; rollback is one command:

```bash
cd ~/domains/platformopsstudio.com
ln -sfn releases/<previous-sha> nextapp
touch nextapp/.restart
```

## Monitoring

- **Uptime.** UptimeRobot free tier — HTTPS check on `https://platformopsstudio.com/robots.txt` every 5 minutes. Alert channels: email to `ramsudarsan@gmail.com` and a webhook to Slack if configured.
- **Errors.** Next.js writes to stdout/stderr; Hostinger surfaces those in hPanel → Node.js → Logs.
- **RUM.** Not yet wired. If enabled later, gate the loader on `getConsent() === "accepted"` (see [consent.md](./consent.md)) — the consent record is already kept.

## Cutover checklist

Copy this into the release PR body.

- [ ] `pnpm test` green
- [ ] `pnpm build` shows `/robots.txt`, `/sitemap.xml`, `/feed.xml`, `/blogs/feed.xml` as static routes
- [ ] `pnpm e2e` green (CI job)
- [ ] Environment variables set in hPanel
- [ ] Startup command in hPanel is `node_modules/next/dist/bin/next` with args `start -p $PORT`
- [ ] Deploy workflow ran and application restarted
- [ ] `curl -sI https://platformopsstudio.com/` returns 200
- [ ] Every legacy `.html` redirect returns 301 (loop above)
- [ ] Contact form roundtrip: submit → email arrives at `ramsudarsan@gmail.com`
- [ ] Lighthouse ≥ 95 across Perf/A11y/Best Practices/SEO
- [ ] Uptime monitor active
- [ ] DNS TTL raised back to 3600
