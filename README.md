# Tilāwah (Next.js)

Qurʾān reading · ḥifẓ recitation checking · the classical **Mutūn Ṭālib al-ʿIlm** library · ḥadīth & naḥw · community ḥalaqāt — heavy liquid-glass UI.

A **Next.js (App Router + TypeScript)** project. The clickable prototype (`public/tilawah.html`) renders full-screen as the root route and is the design + interaction reference. As you execute `BUILD-PACKAGE/`, replace `app/page.tsx` with real React routes and components.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build
npm run start    # serves the production build
```

## Deploy
Push to GitHub and import the repo on **Vercel** — it auto-detects Next.js and deploys. No config needed.

## Structure
| Path | What |
|---|---|
| `app/page.tsx` | Root route — renders the prototype (swap for real components per BUILD-PACKAGE) |
| `app/layout.tsx`, `app/globals.css` | App shell |
| `public/tilawah.html` | The self-contained prototype (the visual oracle) |
| `BUILD-PACKAGE/` | Full production spec for Claude Code (start at `BUILD-PACKAGE/README.md` → `PROMPTS.md`) |
| `data-sources/SOURCES.md` | Verified public-domain sources for all text content |
| `source-pdfs/` | Original scanned matn PDFs (reference only) |

## Build the real app
Open this repo in Claude Code and paste the blocks from `BUILD-PACKAGE/PROMPTS.md` (kickoff → Agent A → B/C/D → E/F). Locked stack: Next.js App Router + TypeScript, Tailwind + liquid-glass tokens, Convex.

## Push to GitHub (https://github.com/yusufdiallo1/Tilawah)
```bash
git add -A
git commit -m "Tilāwah — Next.js app"
git branch -M main
git remote add origin https://github.com/yusufdiallo1/Tilawah.git   # or: git remote set-url origin ...
git push -u origin main            # add --force to overwrite the previous (Vite) contents
```
