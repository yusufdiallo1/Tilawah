# 10 · TROUBLESHOOTING

| Symptom | Likely cause | Fix |
|---|---|---|
| Arabic renders LTR / numerals wrong | missing `dir="rtl"` / locale | wrap reader in locale-aware `dir`; use Arabic-Indic numerals in AR/UR |
| Surah body empty | data asset not built | run `pnpm build:data`; check `/data-sources/` URL reachable |
| Mutashābihāt mode shows nothing | wrong abs↔ref mapping OR short surah genuinely has none | verify `refToAbs` against ayah-count table; show the "none flagged" toast |
| Matn shows only a few lines | matn body not fully sourced | rebuild from `/data-sources/`; integrity test requires non-empty full body |
| Sharḥ sheet blank | matn missing `sa`/`se` | every matn MUST have sharḥ; integrity test catches it |
| Glass looks flat | `backdrop-filter` unsupported/disabled | ensure `-webkit-backdrop-filter`; provide solid-tint fallback that keeps shadow+sheen |
| Recitation never scores | ASR perms / lang | request mic; set `lang:'ar'`; fall back to webspeech |
| Cross-family data visible | missing server scope | every Convex fn must check ownership/membership |
| Bundle too big | sacred JSON bundled | lazy-load per surah/matn; keep initial < 250kb |
| Build:data count mismatch | bad source/edition | must equal 114 surahs / 6236 āyāt; fail the build otherwise |
