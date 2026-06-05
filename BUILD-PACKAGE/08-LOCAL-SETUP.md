# 08 · LOCAL SETUP (zero → running, < 30 min)

```bash
# 1. Prereqs: Node 20+, pnpm, a Convex account
node -v && corepack enable && corepack prepare pnpm@latest --activate

# 2. Install
pnpm install

# 3. Backend (Convex) — opens browser to link a dev deployment
npx convex dev   # leave running; writes NEXT_PUBLIC_CONVEX_URL to .env.local

# 4. Build sacred-text data assets (Qurʾān, tafsīr, mutūn, ḥadīth, mutashābihāt)
pnpm run build:data      # pulls from /data-sources/ URLs, validates 114/6236, writes public/data/*

# 5. Env
cp .env.example .env.local   # fill OAuth + AUDIO_CDN_BASE; ASR defaults to webspeech

# 6. Run
pnpm dev                 # http://localhost:3000

# 7. Compare against the design oracle
open prototype/maqraah-quran-tarteel.html
```
Done = home renders in liquid glass, a surah opens with correct Arabic (RTL), and `pnpm test` data-integrity suite is green.
