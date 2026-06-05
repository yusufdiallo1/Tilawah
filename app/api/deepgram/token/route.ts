import { NextResponse } from "next/server";

// POST /api/deepgram/token — mint a short-lived Deepgram token for the browser.
// The real DEEPGRAM_API_KEY stays server-only; the client only ever receives a
// JWT valid long enough to open the live-transcription WebSocket.
export async function POST() {
  const key = process.env.DEEPGRAM_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Deepgram not configured" }, { status: 503 });
  }
  try {
    const res = await fetch("https://api.deepgram.com/v1/auth/grant", {
      method: "POST",
      headers: { Authorization: `Token ${key}`, "Content-Type": "application/json" },
      // ttl_seconds: enough to establish the WS (connection persists after).
      body: JSON.stringify({ ttl_seconds: 60 }),
      cache: "no-store",
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return NextResponse.json({ error: `grant failed (${res.status}): ${t.slice(0, 160)}` }, { status: 502 });
    }
    const json = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!json.access_token) {
      return NextResponse.json({ error: "no token returned" }, { status: 502 });
    }
    return NextResponse.json({ token: json.access_token, expiresIn: json.expires_in ?? 60 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "token error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
