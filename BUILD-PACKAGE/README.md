# Tilāwah — BUILD PACKAGE

The complete orchestration package to build **Tilāwah** (working title "Maqraah") — an all-in-one Islamic study app — to production quality with Claude Code AI dev agents.

Tilāwah = Qurʾān reading (Quran.com-grade) × ḥifẓ recitation checking (Tarteel-style) × a classical *mutūn* library (Mutūn Ṭālib al-ʿIlm, 6 levels) × ḥadīth & naḥw × community ḥalaqāt — wrapped in a heavy **liquid-glass** aesthetic.

## The single source of truth for visual design
`/prototype/maqraah-quran-tarteel.html` is the **pixel + interaction reference**. Open it in a browser. Every screen, color, motion, and gesture in the shipped app must match it. When this package and the prototype disagree, **the prototype wins for look-and-feel**; this package wins for architecture, contracts, and acceptance.

## Read in this order
1. `00-START-HERE.md` — philosophy, stack, the non-negotiables
2. `01-SHIP-IT.md` — what we're building and why (the spec)
3. `02-MANDATORY-TESTING-PROTOCOL.md` — the test bar
4. `03-AGENT-ASSIGNMENTS.md` — who owns which files
5. `04-PHASE-GATES.md` — the six phases and their done-checkboxes
6. `05-DESIGN-SYSTEM.md` — **LIQUID GLASS** tokens, primitives, gestures
7. `06-DATA-CONTRACTS.md` — every data shape + API/route signature
8. `07-ENV-VARS.md` — every secret and where it lives
9. `08-LOCAL-SETUP.md` — zero to running in <30 min
10. `09-DEPLOYMENT.md` — ship + rollback
11. `10-TROUBLESHOOTING.md` — common failures, concrete fixes
12. `ACCEPTANCE-CRITERIA.md` — the binary conditions for "done"
13. `BUILD-STATE.md` — the live coordination tracker (agents edit this)
- `CLAUDE-CODE-PROMPT.md` — the paste-in kickoff prompt
- `PROMPTS.md` — every Claude Code prompt as a ready-to-copy block (kickoff + per-agent + escalation)

## Folders shipped alongside this package
- `/prototype/` — the clickable prototype (the design bible) + companion docs
- `/source-pdfs/` — the original curriculum matn PDFs (scanned; see note in 06)
- `/data-sources/` — exact public-domain URLs/repos for Qurʾān, tafsīr, ḥadīth, mutūn, and mutashābihāt text
