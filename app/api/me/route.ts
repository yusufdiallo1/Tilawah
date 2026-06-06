import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/me — the signed-in user's identity for the app shell (name, email).
// Returns { user: null } when signed out so the prototype can show neutral defaults.
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ user: null });

  // Turn an email local-part into a friendly name:
  //   "yusufdiallo11+test" → "Yusufdiallo"   (drop +tag, digits, dots/_/-)
  function nameFromEmail(email: string) {
    let local = email.split("@")[0].split("+")[0];
    local = local.replace(/[._-]+/g, " ").replace(/\d+/g, "").trim();
    if (!local) return "Friend";
    return local
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  const meta = (user.user_metadata || {}) as Record<string, unknown>;
  const name =
    (typeof meta.display_name === "string" && meta.display_name.trim()) ||
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    (typeof meta.name === "string" && meta.name.trim()) ||
    (user.email ? nameFromEmail(user.email) : "") ||
    "Friend";

  return NextResponse.json({
    user: { id: user.id, email: user.email ?? null, name },
  });
}

// POST /api/me { display_name } — update the signed-in user's display name.
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth required" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const display_name = String(body.display_name || "").trim().slice(0, 60);
  if (!display_name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const { error } = await supabase.auth.updateUser({ data: { display_name } });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, name: display_name });
}
