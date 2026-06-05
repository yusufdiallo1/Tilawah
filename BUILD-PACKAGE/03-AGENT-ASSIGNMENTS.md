# 03 · AGENT ASSIGNMENTS

Use as many agents as needed; the lanes below prevent collisions. Editing outside your lane requires a logged handoff in `BUILD-STATE.md`.

## Agent A — Foundation & Design System (Phase 1, blocks everyone)
Owns: repo bootstrap, Tailwind + token layer, liquid-glass primitives (GlassCard, GlassNav, GlassSheet, Pill, SegTabs, Ring, ContributionGraph), layout chrome (status bar frame, bottom-nav), theme (light/night), i18n string layer + RTL. Deliver primitives that visually match `/prototype/`.
Files: `app/layout.tsx`, `app/globals.css`, `lib/tokens.ts`, `components/glass/*`, `lib/i18n/*`, `components/chrome/*`.

## Agent B — Data & Backend (Phases 2-4, parallel)
Owns: Convex schema + functions (users, progress, ḥifẓ logs, ḥalaqāt, assignments, bookmarks, streaks); sacred-text data pipeline (fetch/validate Qurʾān, tafsīr, mutūn, ḥadīth, mutashābihāt from `/data-sources/` into versioned JSON + loaders); ASR provider interface; audio URL resolver.
Files: `convex/*`, `lib/data/*`, `scripts/build-data/*`, `public/data/*`.

## Agent C — Qurʾān + Ḥifẓ experience (Phases 2-4, parallel)
Owns: reader (read/tajwīd/tafsīr/**mutashābihāt** modes), surah picker, juzʾ bar, meaning/tafsīr sheet, audio player, voice search, Memorize mode (recitation scoring UI), historical mistakes, goals.
Files: `app/(quran)/*`, `components/reader/*`, `components/hifz/*`.

## Agent D — Mutūn + Community + Home/You (Phases 2-4, parallel)
Owns: Mutūn library (levels, Mutūn/Ḥadīth/Naḥw tabs, matn reader, hold-for-sharḥ), ḥalaqāt (circles, assignments, submissions, leaderboard), Home (prayer times, qiblah, goal ring, āyah-a-day, continue, contribution graph), You (stats, plan, settings).
Files: `app/(mutun)/*`, `app/(halaqat)/*`, `app/(home)/*`, `app/(you)/*`, `components/mutun/*`, `components/community/*`, `components/dash/*`.

## Agent E — Testing (continuous, all phases)
Owns: test harness, data-integrity suite, unit/integration/component/E2E, coverage gates, Lighthouse CI.
Files: `tests/*`, `playwright/*`, `vitest.config.ts`, `.github/workflows/test.yml`.

## Agent F — Deployment & Ops (Phase 6)
Owns: Vercel + Convex prod, env wiring, audio/data CDN, GitHub Actions, monitoring, DNS, rollback runbook.
Files: `.github/workflows/deploy.yml`, `vercel.json`, `convex.json`, `09-DEPLOYMENT.md` runbook updates.
