import "server-only";

// Server-side Quran.Foundation client.
// OAuth2 client-credentials → cached access token → Content API (x-auth-token + x-client-id).
// Secrets stay on the server; the browser only ever talks to our /api/quran proxy.

type Env = "prelive" | "production";

function cfg() {
  const env: Env = process.env.QURAN_FOUNDATION_ENV === "production" ? "production" : "prelive";
  if (env === "production") {
    return {
      env,
      clientId: process.env.QURAN_FOUNDATION_PROD_CLIENT_ID || "",
      clientSecret: process.env.QURAN_FOUNDATION_PROD_CLIENT_SECRET || "",
      oauthBase: process.env.QURAN_FOUNDATION_PROD_OAUTH_BASE || "https://oauth2.quran.foundation",
      contentBase: "https://apis.quran.foundation/content/api/v4",
    };
  }
  return {
    env,
    clientId: process.env.QURAN_FOUNDATION_CLIENT_ID || "",
    clientSecret: process.env.QURAN_FOUNDATION_CLIENT_SECRET || "",
    oauthBase: process.env.QURAN_FOUNDATION_OAUTH_BASE || "https://prelive-oauth2.quran.foundation",
    contentBase: "https://apis-prelive.quran.foundation/content/api/v4",
  };
}

// In-memory token cache (per server instance). Refreshed ~60s before expiry.
let cached: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  const now = Date.now();
  if (cached && cached.expiresAt > now + 60_000) return cached.token;

  const { clientId, clientSecret, oauthBase } = cfg();
  if (!clientId || !clientSecret) throw new Error("Quran.Foundation credentials not configured");

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${oauthBase}/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=content",
    cache: "no-store",
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`token request failed (${res.status}): ${t.slice(0, 200)}`);
  }
  const json = (await res.json()) as { access_token: string; expires_in?: number };
  cached = {
    token: json.access_token,
    expiresAt: now + (json.expires_in ?? 3600) * 1000,
  };
  return cached.token;
}

// Fetch a Content API path (e.g. "/verses/by_chapter/1?fields=text_uthmani").
export async function qfFetch(path: string): Promise<Response> {
  const { clientId, contentBase } = cfg();
  const token = await getToken();
  const url = `${contentBase}${path.startsWith("/") ? "" : "/"}${path}`;
  return fetch(url, {
    headers: { "x-auth-token": token, "x-client-id": clientId, Accept: "application/json" },
    // Quran content is static — cache aggressively at the edge.
    next: { revalidate: 60 * 60 * 24 },
  });
}

export function qfConfigured(): boolean {
  const { clientId, clientSecret } = cfg();
  return !!clientId && !!clientSecret;
}
