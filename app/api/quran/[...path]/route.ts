import { NextResponse } from "next/server";
import { qfFetch, qfConfigured } from "@/lib/quran-foundation";

// GET /api/quran/<content-path>?<query> → proxies to the Quran.Foundation Content API.
// e.g. /api/quran/verses/by_chapter/1?fields=text_uthmani&translations=20
// Only GET, and only a small allow-list of content prefixes, are forwarded.
const ALLOWED = ["verses", "chapters", "quran", "juzs", "search", "resources"];

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } },
) {
  const segments = params.path || [];
  if (!segments.length || !ALLOWED.includes(segments[0])) {
    return NextResponse.json({ error: "not allowed" }, { status: 400 });
  }
  if (!qfConfigured()) {
    return NextResponse.json({ error: "Quran.Foundation not configured" }, { status: 503 });
  }

  const qs = new URL(request.url).search; // includes leading "?" or ""
  const path = "/" + segments.map(encodeURIComponent).join("/") + qs;

  try {
    const res = await qfFetch(path);
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
        // let the browser cache static Qurʾān content
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "upstream error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
