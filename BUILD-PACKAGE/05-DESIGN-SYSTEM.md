# 05 · DESIGN SYSTEM — **LIQUID GLASS**

> LIQUID GLASS · LIQUID GLASS · LIQUID GLASS. This is the soul of Tilāwah. Frosted translucency, a soft top sheen, deep diffuse shadow, and a quiet green/teal palette. Every surface is a pane of liquid glass floating over a calm background. If a screen looks flat or "material", it is wrong. The oracle is `/prototype/maqraah-quran-tarteel.html` — match it.

## Color tokens (from the prototype — do not invent hex)
```css
:root {
  --accent: #1ba35e;      /* Quran.com green — primary */
  --teal:   #0fb6b0;        /* Tarteel teal — accent/labels */
  --good:   #1fa05a;        /* success / activity green */
  --gold:   #b0852e;        /* matn headings */
  --ink:    #16201d;         /* primary text */
  --ink-strong: #0a1512;
  --sec:    #5d6b66;         /* secondary text */
  --ter:    #9aa7a2;         /* tertiary text */
  --line:   rgba(16,40,30,.06);
  --bg:     ?;          /* app background */
  --card:   #ffffff;
  --fill:   rgba(16,60,40,.06);        /* subtle fills */
  --fill-2: rgba(16,60,40,.10);
}
```

## The glass recipe (the single most important rule)
```css
--glass: rgba(255,255,255,.62);
--e1:    0 1px 2px rgba(18,46,34,.05), 0 6px 16px -8px rgba(18,46,34,.14);
--sheen: inset 0 1px 0 rgba(255,255,255,.85);
--r:     22px;

.glass {
  background: var(--glass);
  backdrop-filter: blur(30px) saturate(1.7);
  -webkit-backdrop-filter: blur(30px) saturate(1.7);
  box-shadow: var(--e1), var(--sheen);   /* deep shadow + inner top sheen */
  border-radius: var(--r);
}
```
Night mode re-tints `--glass`/`--bg`/`--ink` to dark; keep the blur + sheen.

## Primitives (Agent A owns; APIs locked)
- `GlassCard({as, padding, wide, children})` — the base pane.
- `GlassNav` — floating bottom nav, 5 items (Home · Qurʾān · Mutūn · Ḥalaqāt · You), center item lifted, active = green.
- `GlassSheet({open, title, onClose, children})` — bottom sheet with grab handle (tafsīr, sharḥ, mutashābihāt, surah picker).
- `SegTabs({items, value, onChange})` — the pill segmented control (Read/Memorize; Mutūn/Ḥadīth/Naḥw; reader modes).
- `Pill`, `Ring({pct})` (goal ring), `ContributionGraph({weeks, monthLabels})` (green, 7-row column-flow, l1–l4 intensities + month labels), `AyahMarker`.

## Typography
- UI: IBM Plex Sans (+ IBM Plex Sans Arabic for AR/UR).
- Qurʾān: a QCF/Uthmani-style face; matn poetry: Amiri (serif). Hemistichs joined with a center ✿.
- Numerals: Arabic-Indic (٠-٩) in AR/UR contexts.

## Motion & gesture
- **Paginated reader (matns/ḥadīth/sūrahs):** one unit per page. Glass nav bar = `‹` arrow · centered `<select>` dropdown (liquid-glass pill, RTL) · `›` arrow; a primary green **Next ›** pill at page end; horizontal swipe (≥55px, mostly-horizontal, <700ms) → next/prev. Page transition uses a 0.26s slide-in (`@keyframes matnSlide`, dir-aware via `--sx`). Single-unit texts hide the nav. See prototype `.matnnav`, `.mnav-arrow`, `.matn-next`, `.rdnav`, `splitMatn()`, `renderMatnPage()`, `initMatnSwipe()`.
- Sheets spring up; cards press-scale on tap; reduced-motion disables transforms.
- **Hold-a-line (400ms)** in a matn reader → sharḥ sheet. Tap an āyah → meaning sheet.
- Mutashābihāt mode: matched āyāt get a green liquid-glass highlight (`.ayl.mutash`), tap → compare sheet.

## RTL
Arabic/Urdu flip the whole layout; the contribution graph + mutashābihāt month bar stay LTR (time axis) via `direction:ltr`.

## Hard rule
No flat Material/Bootstrap defaults, no opaque cards, no hard 1px borders as the primary separator. Glass, blur, sheen, soft shadow — everywhere.
