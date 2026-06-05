# 06 · DATA CONTRACTS

## Sacred-text assets (versioned JSON in `public/data/`, built by Agent B)
### Qurʾān — `quran/{surah}.json`
```ts
type Ayah = { n: number; ar: string; tr?: string };          // ar = Uthmani; tr = established translation
type Surah = { n: number; nameAr: string; nameEn: string; meaning: string; ayahCount: number; place: 'M'|'D'; ayat: Ayah[] };
```
Invariants: 114 surahs, 6236 āyāt, per-surah counts match the canonical table. Source + translation: see `/data-sources/`.

### Tafsīr — `tafsir/muyassar/{surah}.json` → `{ [ayah]: string }` (al-Tafsīr al-Muyassar, attributed).
### Mutashābihāt — `mutashabihat.json`
```ts
type Mutashabihat = { [absAyah: string]: number[] }; // reciprocal map of similar absolute āyah numbers
```
Helpers (100% tested): `refToAbs(surah,ayah)`, `absToRef(abs)`, using the surah ayah-count table.

### Mutūn — `mutun/{key}.json`
```ts
type Matn = { key: string; t: string; by: string; body: string; sa: string; se: string;
  discipline: 'aqidah'|'hadith'|'tajwid'|'fiqh'|'nahw'|'mustalah'|'usul'|'faraid'|'adab'; level?: number };
```
`body` = full vowelled matn (NOT the scanned PDF — fetch from `/data-sources/`). `sa`/`se` = sharḥ AR/EN. Every matn MUST have non-empty body + sharḥ (tested).
Levels (Adhkār at L1): L1 Adhkār · L2 Uṣūl/Nawāqiḍ/Qawāʿid/Arbaʿūn · L3 Tuḥfa/Tawḥīd/Shurūṭ/Jazariyyah · L4 Bayqūniyyah/Ājurrūmiyyah/Ilbīrī/Wāsiṭiyyah · L5 Waraqāt/Raḥbiyyah/ʿUnwān/Ṭaḥāwiyyah · L6 Bulūgh/Alfiyyah/Zād.
Tabs: Mutūn (levels) · Ḥadīth (Nawawī complete, ʿUmdat al-Aḥkām, Bulūgh, 40 Qudsī, Bayqūniyyah) · Naḥw (Ājurrūmiyyah, Alfiyyah).

## ASR provider interface (Agent B; Agent C consumes)
```ts
interface RecitationASR {
  start(opts: { surah: number; fromAyah: number; lang: 'ar' }): Promise<void>;
  onPartial(cb: (words: string[]) => void): void;
  score(expected: string[], heard: string[]): { matched: boolean[]; accuracy: number };
  stop(): Promise<void>;
}
```
Prototype impl = Web Speech API. Production impl = pluggable cloud ASR. Reading must never block on ASR.

## Convex functions (user data; all auth-scoped)
```
users.me() -> Profile
progress.get() / progress.logHifz({surah,ayahRange,accuracy,mistakes[]})
bookmarks.list() / bookmarks.toggle({surah,ayah})
streaks.get() -> { current, best, days:[{date,count}] }   // feeds ContributionGraph
halaqat.list() / halaqat.create() / halaqat.assign({circleId,task,due})
halaqat.submit({assignmentId,payload})   // server checks membership
goals.list() / goals.upsert()
```
Every query/mutation MUST verify the caller owns the resource or belongs to the circle/family. No client-trusted IDs.

## Note on the source PDFs
`/source-pdfs/` are scanned, custom-font muṣḥaf/matn PDFs with **no extractable Unicode text** and no Arabic OCR available. They are reference/cover art only. **All text content comes from `/data-sources/`,** not these PDFs.
