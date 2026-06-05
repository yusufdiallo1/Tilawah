# 00 · START HERE

## What this is
You are building **Tilāwah**, a production Islamic study app. This is **execution, not design**. The product is fully specified across this package and pinned by the prototype in `/prototype/`. Your job is to turn that into a real, tested, deployable app — not to reinterpret it.

## Build philosophy — IHSAAN-grade
- **Match the prototype exactly.** Liquid-glass surfaces, Quran.com-green × Tarteel-teal palette, floating glass bottom-nav, RTL correctness for Arabic/Urdu. If your output doesn't *look and feel* like `/prototype/maqraah-quran-tarteel.html`, it is wrong.
- **Sacred-content integrity.** The Qurʾān text, ḥadīth, and classical mutūn must come from verified public-domain sources (see `/data-sources/` and `06-DATA-CONTRACTS.md`). **Never hand-type or paraphrase sacred text.** Never machine-translate Qurʾān; use a named, licensed/established translation.
- **No fabrication.** Never invent ḥadīth gradings, tafsīr, isnād, or recitation-accuracy numbers. If a value isn't sourced, render it as unavailable.

## Tech stack (locked)
- **Framework:** Next.js (App Router) + TypeScript, React 18.
- **Styling:** Tailwind CSS + CSS custom properties for the liquid-glass design tokens (see `05`). No component-library theme that fights the prototype.
- **Backend/data:** Convex (reactive DB + functions) for user data (progress, ḥifẓ logs, ḥalaqāt, streaks). Static sacred-text data (Qurʾān, mutūn, mutashābihāt) ships as versioned JSON assets, not user DB.
- **Auth:** Convex Auth (email + OAuth). Family/ḥalaqah scoping enforced server-side.
- **Recitation checking:** Web Speech API for the prototype tier; pluggable ASR provider interface for production (see `06`). Never block the core reading experience on ASR.
- **Audio:** per-āyah reciter audio via a CDN (e.g., the everyayah/QCF-style audio sources listed in `/data-sources/`).
- **Hosting:** Vercel (web) + Convex Cloud (backend).
- **Models (if LLM features used, e.g. tafsīr Q&A):** `claude-opus-4-8` for quality paths, `claude-haiku-4-5-20251001` for cheap/low-latency. Never ship a key client-side.

## 14 NEVERs (termination-grade)
1. Never hand-type, paraphrase, or "fix" Qurʾān text. Load from the verified source only.
2. Never auto-translate the Qurʾān; use a named established translation with attribution.
3. Never fabricate ḥadīth gradings, tafsīr, or recitation-accuracy metrics.
4. Never ship secrets/keys to the client or commit them to git.
5. Never bypass family/ḥalaqah authorization checks on the server.
6. Never block Qurʾān reading on network or ASR availability (offline-first for cached surahs).
7. Never break RTL: Arabic/Urdu must render right-to-left with correct numerals.
8. Never replace the liquid-glass aesthetic with flat/material defaults.
9. Never introduce `localStorage` as the source of truth for user progress (use Convex).
10. Never edit files outside your agent lane without a logged handoff in `BUILD-STATE.md`.
11. Never mark a phase gate done with unchecked items.
12. Never merge with failing tests or below coverage thresholds.
13. Never add ads or third-party trackers to a Qurʾān surface.
14. Never deploy without all 47 acceptance criteria passing.

## 14 ALWAYS
1. Always read your lane in `03` and your finish line in `04` before coding.
2. Always keep the prototype open as the visual oracle.
3. Always source sacred text from `/data-sources/` + verify counts (6236 āyāt, 114 surahs).
4. Always write the test as the feature lands (`02`).
5. Always use the design tokens in `05`; never hardcode hex.
6. Always honor reduced-motion and large-text accessibility.
7. Always localize via the EN/AR/FR/UR string layer; never inline user-facing copy.
8. Always scope every Convex query/mutation by the authenticated user + family/ḥalaqah.
9. Always update `BUILD-STATE.md` at the start and end of a work session.
10. Always handle the empty/loading/error state for every data view.
11. Always keep bundle and Lighthouse budgets (see `02`).
12. Always attribute text sources (translation author, tafsīr name, dataset license).
13. Always degrade gracefully offline for cached content.
14. Always ask via the escalation format (`CLAUDE-CODE-PROMPT.md`) when blocked — don't guess on sacred content.
