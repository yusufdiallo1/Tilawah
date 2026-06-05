import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — the caller's unread/recent notifications.
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth required" }, { status: 401 });
  const { data, error } = await supabase
    .from("halaqah_notifications")
    .select("id, kind, body, read, created_at")
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ notifications: data ?? [] });
}

// POST { ids?: string[] } — mark notifications read (all if ids omitted).
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth required" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  let q = supabase.from("halaqah_notifications").update({ read: true }).eq("user_id", user.id);
  if (Array.isArray(body.ids) && body.ids.length) q = q.in("id", body.ids);
  const { error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
