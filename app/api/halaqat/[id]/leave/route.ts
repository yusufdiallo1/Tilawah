import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/halaqat/:id/leave — the caller leaves a circle they joined.
// Owners cannot "leave" their own circle (they delete it instead).
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth required" }, { status: 401 });

  const { data: h } = await supabase
    .from("halaqat")
    .select("owner_id")
    .eq("id", params.id)
    .single();
  if (h && h.owner_id === user.id) {
    return NextResponse.json({ error: "owners delete, not leave" }, { status: 400 });
  }

  const { error } = await supabase
    .from("halaqah_members")
    .delete()
    .eq("halaqah_id", params.id)
    .eq("user_id", user.id); // RLS also restricts to user_id = auth.uid()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
