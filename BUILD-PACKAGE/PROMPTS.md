# PROMPTS.md — ready-to-copy Claude Code prompts

Paste these into Claude Code **from the repo root**, in order. Each block is self-contained.
See `CLAUDE-CODE-PROMPT.md` for the full kickoff spec these are derived from.

---

## 1 · Kickoff (paste first)

```
Read BUILD-PACKAGE/README.md, then BUILD-PACKAGE/CLAUDE-CODE-PROMPT.md, then every file it lists, then open prototype/maqraah-quran-tarteel.html. This is execution, not design — build the app to match that prototype exactly in heavy liquid glass. Note the REQUIRED paginated reader (one unit per page: dropdown + ‹ › arrows + swipe + Next button) for sūrahs, mutūn, ḥadīth, and naḥw. Before writing any code, post the §3 confirmation: (a) the locked tech stack, (b) your agent + file lane from 03-AGENT-ASSIGNMENTS.md, (c) your phase gate from 04-PHASE-GATES.md, (d) the 14 NEVERs, (e) one sentence on what "liquid glass" means here. Then begin Phase 1.
```

---

## 2 · Agent A — Foundation & Design System (run alone first)

```
You are Agent A (Foundation & Design System) per BUILD-PACKAGE/03-AGENT-ASSIGNMENTS.md. Do Phase 1 only (04-PHASE-GATES.md). Bootstrap Next.js App Router + TypeScript + Tailwind, build the liquid-glass token layer and primitives (GlassCard, GlassNav, GlassSheet, SegTabs, Ring, ContributionGraph) to match 05-DESIGN-SYSTEM.md and the prototype, plus the app chrome, routing skeleton for all 5 tabs (Home · Qurʾān · Mutūn · Ḥalaqāt · You), and the EN/AR/FR/UR i18n + RTL layer. Also build the shared PaginatedReader primitive (dropdown + ‹ › + swipe + Next, slide animation) described in 05 so Agents C/D reuse it. Check every Phase 1 box and update BUILD-STATE.md. Do not touch other lanes.
```

---

## 3 · Agents B + C + D — parallel (after Phase 1 is green)

```
Phase 1 is complete. Spin up three agents in parallel per BUILD-PACKAGE/03-AGENT-ASSIGNMENTS.md, Phases 2-4.
Agent B (Data/Backend): build + validate all sacred-text assets from data-sources/SOURCES.md (verify 114 surahs / 6236 āyāt, snapshot 2:255 and al-Fātiḥah), wire the Convex schema/auth/family-scope, the ASR provider interface, and the audio URL resolver.
Agent C (Qurʾān/Ḥifẓ): reader with Normal/Tajwīd/Tafsīr/Mutashābihāt modes, per-sūrah pagination (dropdown + ‹ › + swipe via the PaginatedReader primitive), meaning/tafsīr sheet, audio, voice search, Memorize (recite → match → score → history).
Agent D (Mutūn/Community/Home/You): Mutūn library (6 levels, Mutūn/Ḥadīth/Naḥw tabs), matn reader paginated one-unit-per-page with hold-for-sharḥ, ḥalaqāt flows, Home (prayer times, qiblah, goal ring, āyah-a-day, contribution graph), You (stats + settings).
Build to the 06-DATA-CONTRACTS contracts, use only 05 tokens, match the prototype, test-as-you-build (02), and tick 04 gates + update BUILD-STATE.md. Stay in your lane; log any cross-lane handoff.
```

---

## 4 · Agent E — Testing (continuous; gate before deploy)

```
You are Agent E (Testing) per BUILD-PACKAGE/03. Implement the full 02-MANDATORY-TESTING-PROTOCOL: the data-integrity suite (114/6236 counts, abs↔ref round-trip for 1..6236, every matn resolves to a non-empty full body AND non-empty sharḥ, mutashābihāt refs all valid), unit + integration (Convex auth/family-scope) + component (reader RTL, mode switching, paginated reader dropdown/arrows/swipe, hold-for-sharḥ) + the 10 E2E flows, coverage gates, and Lighthouse CI. Block any merge on red. Report status in BUILD-STATE.md.
```

---

## 5 · Agent F — Deployment & Ops (Phase 6)

```
You are Agent F (Deployment) per BUILD-PACKAGE/03 and 09-DEPLOYMENT.md. Stand up production Convex + Vercel, wire env per 07-ENV-VARS.md, configure the audio/data CDN, GitHub Actions (PR → lint+type+test+Lighthouse; main → deploy on green), monitoring, and DNS. Write/verify the rollback runbook. Ship only when all 47 ACCEPTANCE-CRITERIA.md conditions pass. Update BUILD-STATE.md to DEPLOYED.
```

---

## 6 · Escalation format (use when blocked)

```
BLOCKED [agent] [phase] · need: <what> · tried: <what> · proposed: <option> · risk if wrong: <risk>
```
For any uncertainty about sacred content (Qurʾān text, ḥadīth grading, tafsīr), STOP and ask — never guess.
