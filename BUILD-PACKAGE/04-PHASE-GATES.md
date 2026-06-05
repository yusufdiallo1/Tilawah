# 04 · PHASE GATES

A phase is done only when every box is checked. Update in `BUILD-STATE.md`.

## Phase 1 — Foundation (Agent A) — BLOCKS ALL
- [ ] Repo builds, lints, type-checks clean.
- [ ] Token layer matches `05` (light + night).
- [ ] Glass primitives render and match the prototype side-by-side.
- [ ] Bottom-nav + chrome + routing skeleton for all 5 tabs.
- [ ] i18n layer live; AR/UR flip to RTL.

## Phase 2 — Data spine (Agent B)
- [ ] Qurʾān JSON built + validated (114/6236, Āyat al-Kursī snapshot).
- [ ] Tafsīr (al-Muyassar) + translation mapped per āyah with attribution.
- [ ] Mutūn full texts built from `/data-sources/` (every matn non-empty body + sharḥ).
- [ ] Ḥadīth sets (Nawawī complete, etc.) built.
- [ ] Mutashābihāt dataset built; abs↔ref verified.
- [ ] Convex schema + auth + family scoping live.

## Phase 3 — Core experiences (Agents C, D)
- [ ] Reader: all 4 modes; tajwīd coloring; RTL; type size; night.
- [ ] Mutashābihāt highlights + tap-to-jump working from real data.
- [ ] Meaning/tafsīr sheet; audio playback; voice search.
- [ ] Memorize: recite → match → score → history.
- [ ] Mutūn: 6 levels, 3 tabs, matn reader, hold-for-sharḥ.
- [ ] Home + You dashboards incl. contribution graph; Ḥalaqāt flows.

## Phase 4 — Integration & polish
- [ ] All data wired to Convex; offline cache for read surahs.
- [ ] Empty/loading/error states everywhere.
- [ ] Motion, haptics-feel, reduced-motion, a11y pass.

## Phase 5 — Testing (Agent E, continuous; gate before 6)
- [ ] Coverage thresholds met; data-integrity suite green; 10 E2E flows green; Lighthouse budgets met.

## Phase 6 — Deploy (Agent F)
- [ ] Prod Convex + Vercel; env wired; audio/data CDN; monitoring; rollback tested.
- [ ] All 47 acceptance criteria pass.
