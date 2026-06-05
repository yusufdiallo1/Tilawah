import { NextResponse } from "next/server";

// GET /api/telnyx/config — tells the (static) prototype where the Telnyx STT proxy
// lives, so it can be used as a transcription fallback. Returns { url: null } when
// no proxy is configured, in which case the client skips Telnyx.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_TELNYX_PROXY_URL || "";
  // Only advertise the proxy if a Telnyx key is actually configured server-side.
  const enabled = !!process.env.TELNYX_API_KEY && !!url;
  return NextResponse.json({ url: enabled ? url : null });
}
