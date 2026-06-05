# 02 · MANDATORY TESTING PROTOCOL

No feature is "done" until its tests are green. Tests land **with** the feature, not after.

## Coverage thresholds (CI-enforced)
- Statements/lines ≥ 85%, branches ≥ 80% on `lib/`, `convex/`, and data-mapping utilities.
- 100% of data-integrity utilities (āyah-count, abs↔surah:āyah mapping, mutashābihāt lookup, matn loaders) covered.

## Test layers
1. **Data-integrity (must pass before anything ships):**
   - Qurʾān has exactly 114 surahs and 6236 āyāt; per-surah counts match the canonical table.
   - `absToRef`/`refToAbs` round-trip for all 1..6236.
   - Mutashābihāt: every src and match resolves to a real āyah; no out-of-range refs.
   - Every matn referenced by the library resolves to a non-empty body **and** a non-empty sharḥ.
2. **Unit:** reducers, formatters, tajwīd classifier, recitation scorer, streak math.
3. **Integration (Convex):** auth required; queries/mutations reject cross-family access; assignment submission flow.
4. **Component:** reader renders RTL; mode dropdown switches Normal/Tajwīd/Tafsīr/Mutashābihāt; hold-for-sharḥ opens the sheet; bottom-nav routes.
5. **E2E (Playwright, 10 core flows):** open surah → read; switch to Mutashābihāt → see highlights → tap → jump; Memorize → recite → score; open matn → hold → sharḥ; Home activity graph renders; language switch to AR flips RTL; night mode; offline cached surah; ḥalaqah assignment submit; You stats.

## Non-functional
- Lighthouse (mobile): Perf ≥ 90, A11y ≥ 95, Best-practices ≥ 95.
- No console errors in any E2E flow. Reduced-motion respected. Initial JS < 250kb gzip (sacred-text JSON lazy-loaded per surah/matn).

## Sacred-content checks (block release)
- Snapshot test pins Āyat al-Kursī (2:255) and al-Fātiḥah to the verified source.
- Translation/tafsīr attribution strings present on every meaning sheet.
