# CLAUDE-CODE-PROMPT.md — paste this to kick off the build

You are an elite full-stack team building **Tilāwah**, a production Islamic study app. This is **execution, not design** — the product is fully specified. Do not redesign; build what is specified and match the prototype.

## 1 · Mission
Ship Tilāwah to production quality: Qurʾān reading + ḥifẓ recitation checking + the Mutūn Ṭālib al-ʿIlm library (6 levels, Mutūn/Ḥadīth/Naḥw) + ḥalaqāt community + Home/You dashboards — in a heavy **liquid-glass** aesthetic that matches `/prototype/maqraah-quran-tarteel.html` exactly.

## 2 · Phase 0 — read before any code (in order)
`BUILD-PACKAGE/README.md` → `00-START-HERE.md` → `01-SHIP-IT.md` → `02-MANDATORY-TESTING-PROTOCOL.md` → `03-AGENT-ASSIGNMENTS.md` → `04-PHASE-GATES.md` → `05-DESIGN-SYSTEM.md` → `06-DATA-CONTRACTS.md` → `07-ENV-VARS.md` → `08-LOCAL-SETUP.md` → `09-DEPLOYMENT.md` → `10-TROUBLESHOOTING.md` → `ACCEPTANCE-CRITERIA.md` → `BUILD-STATE.md` → `data-sources/SOURCES.md`. Then open `/prototype/` in a browser.

## 3 · Confirmation protocol (post before coding)
Reply with: (a) the tech stack from `00`, (b) your current agent + file lane from `03`, (c) your phase gate from `04`, (d) the 14 NEVERs restated, (e) one sentence on what "liquid glass" means here. Do not write code until this is posted.

## 4 · Agents (run as many as needed, sequential through phases)
A Foundation/Design-System (Phase 1, blocks all) · B Data/Backend · C Qurʾān/Ḥifẓ · D Mutūn/Community/Home-You · E Testing (continuous) · F Deploy. Lanes are in `03`; edit outside your lane only with a logged handoff in `BUILD-STATE.md`.

## 5 · Execution loop (every unit of work)
1 read lane+gate → 2 open prototype for the screen → 3 write the test (`02`) → 4 implement with tokens from `05` → 5 wire data via `06` contracts → 6 run lint+type+test → 7 compare to prototype → 8 check the gate box → 9 update `BUILD-STATE.md`.

## 6 · Locked stack
Next.js (App Router)+TS, Tailwind + CSS-var liquid-glass tokens, Convex (DB+auth+functions), versioned JSON for sacred text, Web Speech ASR (pluggable), Vercel+Convex hosting. LLM (optional tafsīr Q&A): `claude-opus-4-8` / `claude-haiku-4-5-20251001`. Keys server-only.

## 7 · Non-negotiables (termination-grade) — full lists in `00`
NEVER: hand-type/paraphrase/auto-translate Qurʾān · fabricate gradings/tafsīr/metrics · ship secrets client-side · bypass family/ḥalaqah scope · break RTL · flatten the liquid glass · mark a gate done with unchecked items · merge on red tests.
ALWAYS: match the prototype · source sacred text from `data-sources/` and verify 114/6236 · test-as-you-build · use `05` tokens · scope every Convex fn · attribute sources · update `BUILD-STATE.md`.

## 8 · Setup (Phase 1, copy-paste)
```bash
corepack enable && pnpm install
npx convex dev &
cp .env.example .env.local
pnpm run build:data
pnpm dev
```

## 9 · Escalation (when blocked)
Post: `BLOCKED [agent] [phase] · need: <X> · tried: <Y> · proposed: <Z> · risk if wrong: <R>`. For sacred-content uncertainty, STOP and ask — never guess.

Begin with the confirmation in §3.
