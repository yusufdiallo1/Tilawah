# 07 · ENV VARS

Never commit real values. `.env.local` (dev) / Vercel + Convex dashboards (prod).

| Var | Where | Purpose | If missing |
|---|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | client | Convex deployment URL | app can't load user data |
| `CONVEX_DEPLOY_KEY` | CI/Convex | deploy backend | deploy fails |
| `AUTH_SECRET` | server | session signing | auth broken |
| `OAUTH_GOOGLE_ID` / `OAUTH_GOOGLE_SECRET` | server | OAuth login | Google sign-in off |
| `ASR_PROVIDER` | server | `webspeech`\|`cloud` | defaults to webspeech |
| `ASR_API_KEY` | server only | cloud ASR | Memorize falls back to webspeech |
| `AUDIO_CDN_BASE` | client | reciter audio base URL | audio disabled |
| `DATA_CDN_BASE` | client | sacred-text JSON base (optional; defaults to /data) | uses bundled assets |
| `ANTHROPIC_API_KEY` | server only | optional tafsīr Q&A (claude-opus-4-8 / claude-haiku-4-5-20251001) | LLM features disabled |
| `SENTRY_DSN` | both | monitoring | no error reporting |

Rules: `NEXT_PUBLIC_*` only for non-secret client values. Keys (`ASR_API_KEY`, `ANTHROPIC_API_KEY`, `AUTH_SECRET`) are server-only — never bundled.
