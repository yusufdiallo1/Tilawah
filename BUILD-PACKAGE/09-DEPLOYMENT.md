# 09 · DEPLOYMENT

## Pipeline
1. `convex deploy` (prod) — push schema + functions; run data-integrity check against built assets.
2. Vercel: connect repo; set env (07); build = `pnpm build`. `public/data/*` ships as static, immutable, versioned (`?v=`) assets; cache-control immutable.
3. Audio + large data via CDN (`AUDIO_CDN_BASE`, `DATA_CDN_BASE`).
4. GitHub Actions: PR → lint+type+test+Lighthouse; main → deploy on green only.

## Rollback
- Vercel: instant revert to previous deployment.
- Convex: `convex deploy` of the prior tagged release; schema migrations are additive + reversible.
- Data assets are versioned — roll back by pointing to the prior `?v=`.

## Incident basics
Sentry alert → check Convex function logs + Vercel logs → revert if user-facing → write a note in `BUILD-STATE.md`.
