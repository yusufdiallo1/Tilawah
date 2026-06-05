# BUILD-STATE — live coordination (agents edit this)

## Status: NOT STARTED
| Phase | Owner | State | Notes |
|---|---|---|---|
| 1 Foundation | A | ⬜ todo | blocks all |
| 2 Data spine | B | ⬜ todo | |
| 3 Core (Qurʾān/Ḥifẓ) | C | ⬜ todo | |
| 3 Core (Mutūn/Community/Home/You) | D | ⬜ todo | |
| 5 Testing | E | ⬜ todo | continuous |
| 6 Deploy | F | ⬜ todo | |

## Cross-agent handoffs / blockers
- (log here: who needs what from whom)

## Data-spine work landed in prototype (public/tilawah.html) — 2026-06-05
- **Mutashābihāt (FULL):** extracted all 30 juz from "The Tilāwah Files/Quran/Mutashabihat/*.pdf"
  (clean Arabic Unicode, structured) → window.MUTASH (3686 keys, 9310 reciprocal edges, 0 gaps,
  0 out-of-range; 4 source typos dropped, not fabricated) + MUTA (102 surahs). al-Baqarah now
  flags 176 confusable āyāt vs the old preview stub. Script: scripts/extract-mutashabihat.py +
  splice-mutashabihat.py. Uses prototype SURAHS[].y for refToAbs (matches runtime exactly).
- **Full Qurʾān + Tafsīr (offline-first):** built public/data/quran/{1..114}.json ([[ar,en]],
  Uthmani + Saheeh Intl) and public/data/tafsir/muyassar/{1..114}.json ({ayah:text}, al-Muyassar).
  Validated 114/6236, per-surah counts, 1:1 + 2:255 snapshots. Loader (fetchSurahFromAPI/fetchTafsir)
  now tries local /data first, API fallback. Fixed tafsir id bug (169→16). Meaning sheet now shows
  real al-Muyassar per āyah + Saheeh Intl / KFGQPC attribution. Script: scripts/build-quran-tafsir.py.
- **Matn PDFs attached:** copied source-pdfs → public/source-pdfs; 21/22 matns get a "PDF" link in
  the matn reader header (reuses existing tokens, no design change). qudsi has no PDF in the set.
  Matn PDFs confirmed un-extractable (custom-font, arabic_ratio 0) — used as reference scans only.
  Script: scripts/attach-matn-pdfs.py.
- **Design untouched:** <style> blocks byte-identical to backup (public/tilawah.html.bak); body
  div/class counts unchanged. Only data globals + loader logic + meaning-sheet render changed.

## Reader fidelity + UX + auth + audio — 2026-06-05 (turn 2)
- **604-page Madinah muṣḥaf pagination:** built public/data/mushaf-pages.json (canonical Ḥafṣ page→ayah
  map, validated page 15 = 2:94–2:101, all 6236 covered). Reader now renders ONE physical page at a time
  (loadPage/pageGo/ensurePageSurahs); page N == the printed muṣḥaf's page N. Lazy-loads any surahs a page spans.
- **Swipe-only RTL nav:** removed the ‹ › arrows from the reader header (slimmer); swipe-RIGHT = next page
  (muṣḥaf turn) for both Quran (initReaderSwipe) and Mutūn (initMatnSwipe).
- **Matn "Scan" mode:** new toggle renders the ACTUAL scanned PDF page inline (iframe #page=N), paged by the
  existing dropdown/swipe/Next so page N == the PDF's page N. Single-matn PDFs exact; level-bundle PDFs start
  at the bundle cover (per-matn start-page offsets are a TODO). Headless chromium can't paint PDFs — renders in real browsers.
- **Compact audio bar:** #readerBar shrunk to a content-width pill (was full-width), RTL-aware position.
- **Reciter audio (REAL):** per-āyah Ḥafṣ audio via islamic.network CDN (ar.alafasy + 4 others). audioUrl uses
  refToAbs; playRead plays the current page's āyāt sequentially with .ayl.playing highlight + range loop. Replaced the old fake word-timer.
- **Device-preview button → side:** moved to a vertical right-docked glass pill (Full/iPad/iPhone) in app/page.tsx.
- **Auth (Supabase, full):** lib/supabase/{client,server,middleware,admin}, root middleware, app/auth/{login,actions,callback,signout}.
  Email/password + Google OAuth. Google needs Supabase+Google Cloud config (see memory). Build green, types clean.
- Design preserved: tilawah.html <style> changed only +446 bytes (compact bar, .playing, rtl). Verified in browser, 0 console errors.

## Audio calls + fixes — 2026-06-05 (turn 3)
- **Ḥalaqāt real audio calls:** wired WebRTC mesh into the Live page (p-live) using **Supabase Realtime**
  as the signaling channel (no paid SFU). Mic capture, offer/answer/ICE over `rtc:<room>` broadcast,
  dynamic participant tiles, real mute (track.enabled). Verified 2 peers reach `connected` + remote audio
  attaches both ways, 0 console errors. supabase-js loaded via CDN in tilawah.html `<head>`. RTC engine =
  rtcJoin/rtcPeer/rtcOnSignal/rtcLeave; hooked into startLive/stopLive/toggleMute/doLeave.
- **iPad preview fixed:** the device toggle was fine — the dev server had crashed (running `next build`
  against the live `.next` clobbered it, causing the 404s in the console). Restarted clean; iPad/iPhone/Full
  now resize the iframe correctly (820×1180 / 390×844 / full). LESSON: never `next build` while `next dev` runs.
- **Google OAuth creds** added to .env.local + .env.example (GOOGLE_OAUTH_CLIENT_ID/SECRET). Still must be
  pasted into Supabase → Auth → Providers → Google for sign-in to work.

## Stack decisions (user-directed, override package)
- Supabase replaces Convex (project tnvgmsciehvwhilkbpmx). Service-role key is SERVER-ONLY.
- Groq Cloud replaces Anthropic for AI. ⚠️ GROQ_API_KEY still needed (was blank when provided).
- .env.local (gitignored) + .env.example created. Deps: @supabase/supabase-js, @supabase/ssr, framer-motion.

## Open questions for Yūsuf
- **Provide the Groq API key** (came through empty).
- Stray `my-quran-app/` directory appeared during the session (own .git) — NOT created by this work; confirm origin / whether to remove.
- Recommend rotating the Supabase service_role key (pasted in plaintext chat).
- Confirm production ASR provider choice.
- Confirm reciter(s) + audio CDN source.

## Decisions log
- Adhkār is Level 1 (per uploaded curriculum index). 6 levels. Mutūn/Ḥadīth/Naḥw tabs.
- Sacred text from public-domain sources (see /data-sources/), NOT the scanned PDFs.
- Readers are PAGINATED one-unit-per-page (dropdown + ‹ › + swipe + Next): sūrahs, mutūn, ḥadīth, naḥw. Implemented in the prototype (splitMatn/renderMatnPage/initMatnSwipe; surahGo/initReaderSwipe).
