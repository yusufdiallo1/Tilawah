import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/me — the signed-in user's identity for the app shell (name, email).
// Returns { user: null } when signed out so the prototype can show neutral defaults.
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ user: null });

  const meta = (user.user_metadata || {}) as Record<string, unknown>;
  const name =
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    (user.email ? user.email.split("@")[0] : "") ||
    "Friend";

  return NextResponse.json({
    user: { id: user.id, email: user.email ?? null, name },
  });
}
