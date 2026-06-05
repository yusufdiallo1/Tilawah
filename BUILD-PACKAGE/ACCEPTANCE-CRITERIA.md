# ACCEPTANCE CRITERIA — 47 binary conditions

## A. Sacred content (1-10)
1. 114 surahs present. 2. 6236 āyāt total. 3. Per-surah counts match canonical table. 4. Āyat al-Kursī (2:255) matches verified source (snapshot). 5. al-Fātiḥah matches source. 6. Uthmani script throughout. 7. Translation present + attributed. 8. al-Muyassar tafsīr per āyah + attributed. 9. No machine-translated Qurʾān. 10. No fabricated content anywhere.

## B. Qurʾān reader (11-20)
11. Surah opens offline if cached. 12. Tajwīd coloring toggles. 13. Type size (Aa) works. 14. Night mode works. 15. Reader modes: Normal/Tajwīd/Tafsīr/Mutashābihāt all switch. 16. Tap āyah → meaning sheet. 17. Audio plays per āyah + range loop. 18. Voice/text āyah search works. 19. Surah picker + juzʾ bar. 20. RTL correct + Arabic-Indic numerals.
20a. Qurʾān reader paginates by sūrah: `‹ ›` arrows + dropdown + horizontal swipe move between sūrahs.

## C. Mutashābihāt (21-25)
21. Mode highlights matched āyāt in current surah from real data. 22. Tap highlight → compare sheet with similar āyāt. 23. Jump-to-āyah from compare works. 24. Short surahs with none show the "none flagged" toast (no silent dead UI). 25. abs↔ref round-trips for 1..6236 (test).

## D. Ḥifẓ (26-30)
26. Memorize toggle enters recite mode. 27. Recitation matches words + flags mistakes. 28. Session accuracy + history saved (Convex). 29. Historical-mistakes weak list. 30. Reading never blocked by ASR.

## E. Mutūn (31-37)
31. 6 levels, Adhkār at L1. 32. Mutūn/Ḥadīth/Naḥw tabs switch. 33. Every level opens a real sheet (no toast-only). 34. Every matn opens a full-text reader (non-empty full body). 35. Hold-a-line → sharḥ sheet (every matn has sharḥ). 36. al-Arbaʿūn al-Nawawiyyah complete. 37. Jazariyyah, Tuḥfa, Bayqūniyyah, Ājurrūmiyyah, etc. full text.
37a. Matn/ḥadīth reader paginates one-unit-per-page: dropdown lists units, `‹ ›` step, swipe slides, Next › advances; Nawawī = 42 ḥadīth pages, Jazariyyah = chapter pages; single-section texts show one page with nav hidden.

## F. Community + dashboards (38-42)
38. Create/join ḥalaqah. 39. Assignment create + due. 40. Submit assignment (membership-scoped). 41. Home: prayer times, qiblah, goal ring, āyah-a-day, continue, contribution graph w/ month labels. 42. You: streak/juzʾ/accuracy + 6-month graph + settings.

## G. Platform (43-47)
43. EN/AR/FR/UR switch; AR/UR RTL. 44. Lighthouse mobile Perf≥90 A11y≥95. 45. Coverage thresholds met; data-integrity suite green; 10 E2E green. 46. No secrets client-side; all Convex fns auth-scoped. 47. Liquid-glass aesthetic matches the prototype on every screen.
