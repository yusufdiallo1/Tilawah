import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/halaqat/join — join a circle by id (public) or code (private).
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth required" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  let q = supabase.from("halaqat").select("id, name, capacity, visibility, code");
  if (body.id) q = q.eq("id", body.id);
  else if (body.code) q = q.eq("code", String(body.code).trim().toUpperCase());
  else return NextResponse.json({ error: "id or code required" }, { status: 400 });

  const { data: h } = await q.single();
  if (!h) return NextResponse.json({ error: "ḥalaqah not found" }, { status: 404 });

  // Joining by id is only allowed for PUBLIC circles. Private circles require the code,
  // so a private circle can never be joined just because its id leaked into a list.
  if (body.id && h.visibility === "private") {
    return NextResponse.json({ error: "private — join with the code" }, { status: 403 });
  }

  const { count } = await supabase
    .from("halaqah_members")
    .select("*", { count: "exact", head: true })
    .eq("halaqah_id", h.id);
  if ((count ?? 0) >= h.capacity) return NextResponse.json({ error: "ḥalaqah is full" }, { status: 409 });

  const { error } = await supabase.from("halaqah_members").upsert({ halaqah_id: h.id, user_id: user.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, halaqah: { id: h.id, name: h.name } });
}
