// Telnyx STT WebSocket proxy — the FALLBACK transcription path for memorize mode.
//
// Why a proxy: a browser WebSocket cannot send the `Authorization: Bearer` header
// Telnyx requires, and the API key must never reach the client. So the browser
// connects to THIS server (no secret), and we open the authenticated upstream
// connection to Telnyx, forwarding mic audio up and transcripts back down.
//
// Run as a standalone Node process (it is long-lived, so it does NOT belong in a
// serverless route):  node server/telnyx-proxy.mjs
// Requires env TELNYX_API_KEY. Listens on TELNYX_PROXY_PORT (default 8787).

import { WebSocketServer, WebSocket } from "ws";

const PORT = Number(process.env.TELNYX_PROXY_PORT || 8787);
const KEY = process.env.TELNYX_API_KEY;
const UPSTREAM = "wss://api.telnyx.com/v2/speech-to-text/transcription";

if (!KEY) {
  console.error("[telnyx-proxy] TELNYX_API_KEY is not set — refusing to start.");
  process.exit(1);
}

const wss = new WebSocketServer({ port: PORT });
console.log(`[telnyx-proxy] listening on ws://localhost:${PORT}`);

wss.on("connection", (client) => {
  // Match the encoding the browser MediaRecorder produces (Opus in WebM/Ogg).
  const qs = new URLSearchParams({
    transcription_engine: "B", // Telnyx multilingual engine
    language: "ar",
    interim_results: "true",
    input_format: "opus",
  }).toString();

  const upstream = new WebSocket(`${UPSTREAM}?${qs}`, {
    headers: { Authorization: `Bearer ${KEY}` },
  });

  let upstreamOpen = false;
  const queue = [];

  upstream.on("open", () => {
    upstreamOpen = true;
    for (const chunk of queue) upstream.send(chunk);
    queue.length = 0;
  });

  // Telnyx → browser: relay transcript JSON straight through.
  upstream.on("message", (data) => {
    if (client.readyState === WebSocket.OPEN) client.send(data.toString());
  });
  upstream.on("close", () => { try { client.close(); } catch {} });
  upstream.on("error", (e) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ error: "upstream", detail: String(e && e.message) }));
    }
  });

  // Browser → Telnyx: forward binary audio frames (buffer until upstream is ready).
  client.on("message", (data, isBinary) => {
    if (!isBinary) return; // ignore control text
    if (upstreamOpen && upstream.readyState === WebSocket.OPEN) upstream.send(data);
    else if (queue.length < 200) queue.push(data);
  });
  client.on("close", () => { try { upstream.close(); } catch {} });
  client.on("error", () => { try { upstream.close(); } catch {} });
});
