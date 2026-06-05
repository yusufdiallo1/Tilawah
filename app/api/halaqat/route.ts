import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/halaqat — list circles the caller can see (public + owned + joined).
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth required" }, { status: 401 });

  const { data, error } = await supabase
    .from("halaqat")
    .select("id, owner_id, name, type, visibility, code, capacity, recurring, meet_time, cancelled_for, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // membership counts + whether the caller has joined each circle (best-effort)
  const ids = (data ?? []).map((h) => h.id);
  const counts: Record<string, number> = {};
  const mine = new Set<string>();
  if (ids.length) {
    const { data: mem } = await supabase
      .from("halaqah_members")
      .select("halaqah_id, user_id")
      .in("halaqah_id", ids);
    (mem ?? []).forEach((m) => {
      counts[m.halaqah_id] = (counts[m.halaqah_id] || 0) + 1;
      if (m.user_id === user.id) mine.add(m.halaqah_id);
    });
  }
  return NextResponse.json({
    me: user.id,
    halaqat: (data ?? []).map((h) => ({
      ...h,
      isOwner: h.owner_id === user.id,
      // "mine" = owned OR joined → drives the "Your circles" section in the UI.
      joined: h.owner_id === user.id || mine.has(h.id),
      members: counts[h.id] || 0,
    })),
  });
}

function code() {
  const a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "MQ-";
  for (let i = 0; i < 5; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}

// POST /api/halaqat — create a circle owned by the caller.
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth required" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "").trim().slice(0, 80) || "New Ḥalaqah";
  const type = ["hifz", "matn", "tafsir", "tajwid"].includes(body.type) ? body.type : "hifz";
  const visibility = body.visibility === "private" ? "private" : "public";

  const { data, error } = await supabase
    .from("halaqat")
    .insert({
      owner_id: user.id,
      name,
      type,
      visibility,
      code: visibility === "private" ? code() : null,
      capacity: Math.min(100, Math.max(2, Number(body.capacity) || 8)),
      recurring: body.recurring !== false,
      meet_time: body.meet_time || null,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // owner auto-joins
  await supabase.from("halaqah_members").insert({ halaqah_id: data.id, user_id: user.id });
  return NextResponse.json({ halaqah: { ...data, isOwner: true, members: 1 } });
}
