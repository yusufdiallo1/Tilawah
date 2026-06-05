
# data-sources — verified public-domain sources for ALL text content

The scanned PDFs in `/source-pdfs/` have NO extractable Unicode text (custom fonts; no Arabic OCR). So `pnpm run build:data` pulls verified public-domain / open text from the sources below, validates counts, and writes `public/data/*`. Attribute each source in-app.

## Qurʾān (Uthmani + translations)
- risan/quran-json — https://raw.githubusercontent.com/risan/quran-json/main/dist/chapters/en/{1..114}.json (Uthmani text + Saheeh International EN; tanzil-sourced). Verify 114 surahs / 6236 āyāt.
- Single-verse w/ all translations: https://raw.githubusercontent.com/risan/quran-json/main/dist/verses/{1..6236}.json

## Tafsīr (al-Tafsīr al-Muyassar — King Fahd Complex, freely distributed)
- spa5k/tafsir_api (tafsir-1 = Muyassar) — https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/ar-tafsir-muyassar/{surah}.json  (verify availability; else use quran.com tafsir id for al-Muyassar).

## Ḥadīth (public-domain classical collections)
- al-Arbaʿūn al-Nawawiyyah (42) — https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/ara-nawawi.json  (ALREADY embedded full in prototype)
- 40 Ḥadīth Qudsī — fawazahmed0/hadith-api edition `ara-qudsi40` (verify) 
- ʿUmdat al-Aḥkām / Bulūgh al-Marām — AhmedBaset/hadith-json (the_9_books → muttafaq subset) or a dedicated ʿumdah/bulūgh edition; pin a tag.

## Mutūn (tajwid/nahw/aqida/fiqh — public-domain matn text, vowelled)
- al-Jazariyyah (109 lines) — surahquran.com/Tajweed/aljazariah.html  (ALREADY embedded full in prototype)
- Tuḥfat al-Aṭfāl (61) — surahquran.com/Tajweed/tohfat-alatfal.html
- al-Shāṭibiyyah — surahquran.com/Tajweed/alshatibieah.html
- al-Bayqūniyyah, al-Ājurrūmiyyah, al-Waraqāt, al-Raḥbiyyah, ʿUnwān al-Ḥikam, al-Wāsiṭiyyah, al-Ṭaḥāwiyyah, Kitāb al-Tawḥīd, Nawāqiḍ, Qawāʿid, Uṣūl Thalātha, Shurūṭ al-Ṣalāh, Zād al-Mustaqniʿ, Alfiyyah Ibn Mālik — Arabic Wikisource (ويكي مصدر) public-domain pages + Shamela; validate against a second source before shipping.
- al-Adhkār — authentic du'ā compilation (e.g., Ḥiṣn al-Muslim public text).

## Mutashābihāt (similar-āyāt cross-references — "free to use")
- Waqar144/Quran_Mutashabihat_Data — https://raw.githubusercontent.com/Waqar144/Quran_Mutashabihat_Data/master/mutashabiha_data.json  (ALREADY embedded + wired in prototype)

## Reciter audio (per-āyah)
- everyayah.com / QCF audio bases (set `AUDIO_CDN_BASE`). Pick reciter(s) with Yūsuf.

## Rule
Validate every dataset (counts, snapshot of 2:255 + al-Fātiḥah). Two-source confirm any matn whose edition wording varies. Attribute translation author, tafsīr name, and dataset license in the UI.
