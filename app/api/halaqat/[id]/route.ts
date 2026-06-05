import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Notify every member of a circle (server-only fanout; bypasses RLS via service role).
async function notifyMembers(halaqahId: string, exceptUser: string, kind: string, body: string) {
  const admin = createAdminClient();
  const { data: members } = await admin.from("halaqah_members").select("user_id").eq("halaqah_id", halaqahId);
  const rows = (members ?? [])
    .filter((m) => m.user_id !== exceptUser)
    .map((m) => ({ user_id: m.user_id, halaqah_id: halaqahId, kind, body }));
  if (rows.length) await admin.from("halaqah_notifications").insert(rows);
}

// DELETE /api/halaqat/:id — only the owner; members are notified.
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth required" }, { status: 401 });

  const { data: h } = await supabase.from("halaqat").select("id, owner_id, name").eq("id", params.id).single();
  if (!h) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (h.owner_id !== user.id) return NextResponse.json({ error: "not your ḥalaqah" }, { status: 403 });

  await notifyMembers(params.id, user.id, "deleted", `"${h.name}" was closed by the host.`);
  const { error } = await supabase.from("halaqat").delete().eq("id", params.id); // RLS double-checks owner
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

// PATCH /api/halaqat/:id — owner actions: cancel-for-day, rename. Members notified on cancel.
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth required" }, { status: 401 });

  const { data: h } = await supabase.from("halaqat").select("id, owner_id, name").eq("id", params.id).single();
  if (!h) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (h.owner_id !== user.id) return NextResponse.json({ error: "not your ḥalaqah" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  if (body.action === "cancel_today") {
    patch.cancelled_for = new Date().toISOString().slice(0, 10);
  } else if (body.action === "resume") {
    patch.cancelled_for = null;
  } else if (typeof body.name === "string") {
    patch.name = body.name.trim().slice(0, 80);
  }

  const { error } = await supabase.from("halaqat").update(patch).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (body.action === "cancel_today") {
    await notifyMembers(params.id, user.id, "cancelled", `"${h.name}" is cancelled for today.`);
  }
  return NextResponse.json({ ok: true });
}
