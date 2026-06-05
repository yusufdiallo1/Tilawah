# 01 · SHIP IT — the spec

## Product
Tilāwah is the Muslim student's daily companion: read and listen to the Qurʾān, check ḥifẓ by reciting aloud, study the classical *mutūn* curriculum, and stay accountable in ḥalaqāt.

## The five pillars (must all ship)
### 1. Qurʾān (tab: Qurʾān)
- Full muṣḥaf, 114 surahs / 6236 āyāt, Uthmani script, offline-cached.
- Read mode with per-word tajwīd coloring (toggle), adjustable type size (Aa), Night mode.
- **Reader modes dropdown:** Normal · Tajwīd · Tafsīr (inline) · **Mutashābihāt**.
- **Mutashābihāt mode** highlights confusable āyāt in the current sūrah (data-backed) and, on tap, shows the similar āyāt with jump-to navigation. This is a headline feature — see `06` for the dataset.
- Per-āyah: meaning/tafsīr sheet (al-Tafsīr al-Muyassar), audio play, bookmark, share.
- Reciter audio (selectable qāriʾ), play/loop a range for memorization.
- Surah picker, juzʾ bar, voice search (find an āyah by reciting/typing).

### 2. Ḥifẓ / Memorize (Memorize toggle in reader)
- Recite-aloud checking: highlights words as matched, flags mistakes, scores a session.
- Accuracy + history; "historical mistakes" weak-āyah list; spaced revision goals.
- ASR via the provider interface in `06`; prototype uses Web Speech API.

### 3. Mutūn library (tab: Mutūn)
- Mutūn Ṭālib al-ʿIlm (Dr. ʿAbd al-Muḥsin al-Qāsim), **6 levels**, Adhkār at L1. Tabs: **Mutūn · Ḥadīth · Naḥw**.
- Each matn: full vowelled text reader + **hold-a-line-for-sharḥ** (gloss sheet). Full texts from `/data-sources/` (NOT the scanned PDFs).
- **Paginated reader (REQUIRED, all readers).** Surahs, mutūn, ḥadīth, and naḥw are read **one unit per page**: a header dropdown picks the unit, `‹ ›` arrows step prev/next, a horizontal **swipe** slides to the next/previous unit, and a bottom **Next ›** button advances. Units = one ḥadīth (e.g. Nawawī → 42 pages), one chapter/bāb (e.g. al-Jazariyyah → 19 pages), or one sūrah (Qurʾān reader). Texts with no internal sections render as a single page and the nav hides itself. Match the prototype's `#matnNav` + `splitMatn` + swipe behavior exactly.
- Ḥadīth tab: al-Arbaʿūn al-Nawawiyyah (complete), ʿUmdat al-Aḥkām, Bulūgh al-Marām, 40 Ḥadīth Qudsī, al-Bayqūniyyah. Naḥw tab: al-Ājurrūmiyyah, Alfiyyah Ibn Mālik.

### 4. Community (tab: Ḥalaqāt)
- Family/study circles; assignments (e.g. "Family Ḥifẓ — al-Fātiḥah, due today"), submissions, progress, leaderboard. Server-scoped to the circle.

### 5. You (tab: You) + Home
- Home: prayer times + qiblah, today's goal ring, āyah-a-day, continue-reading, up-next, **activity contribution graph** (green, GitHub-style, month labels).
- You: profile, streak/juzʾ/accuracy stats, 6-month activity graph, memorization plan, settings (language EN/AR/FR/UR, night mode, type size).

## Out of scope for v1
Multi-qirāʾāt beyond Ḥafṣ; full tafsīr libraries beyond al-Muyassar; in-app purchases.

## Success
A ḥāfiẓ opens it daily, reads with tajwīd, checks memorization by voice, studies a matn with sharḥ, and never misses a ḥalaqah assignment — all in an interface that feels like liquid glass.
