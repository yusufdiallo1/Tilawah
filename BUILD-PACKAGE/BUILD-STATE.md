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

## Open questions for Yūsuf
- Confirm production ASR provider choice.
- Confirm reciter(s) + audio CDN source.

## Decisions log
- Adhkār is Level 1 (per uploaded curriculum index). 6 levels. Mutūn/Ḥadīth/Naḥw tabs.
- Sacred text from public-domain sources (see /data-sources/), NOT the scanned PDFs.
- Readers are PAGINATED one-unit-per-page (dropdown + ‹ › + swipe + Next): sūrahs, mutūn, ḥadīth, naḥw. Implemented in the prototype (splitMatn/renderMatnPage/initMatnSwipe; surahGo/initReaderSwipe).
