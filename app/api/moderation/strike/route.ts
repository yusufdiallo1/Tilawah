import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/moderation/strike  { text }
// Classifies a chat message. If it's abusive/mean, records a strike for the caller.
// On the 3rd strike the account is BANNED (email blocklisted) and DELETED.
// Returns: { ok, flagged, strikes, limit, banned, reason }

const LIMIT = 3;

// Fast local profanity/abuse list (covers the obvious cases without a model call).
const BAD = [
  "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dick", "piss",
  "slut", "whore", "retard", "idiot", "stupid", "moron", "dumb", "kill yourself",
  "kys", "shut up", "loser", "ugly", "hate you", "trash",
];

function localFlag(text: string): boolean {
  const t = text.toLowerCase();
  if (BAD.some((w) => w.includes(" ") ? t.includes(w) : new RegExp(`\\b${w}\\b`).test(t))) return true;
  return false;
}

// Optional Groq pass for subtler "mean" content (insults, harassment) the list misses.
async function groqFlag(text: string): Promise<boolean> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0,
        max_tokens: 3,
        messages: [
          {
            role: "system",
            content:
              "You moderate an Islamic study-circle chat. Reply with exactly 'YES' if the message is insulting, mean, harassing, hateful, profane, or abusive toward someone; otherwise reply 'NO'. Only YES or NO.",
          },
          { role: "user", content: text.slice(0, 500) },
        ],
      }),
    });
    if (!res.ok) return false;
    const j = await res.json();
    const out = (j?.choices?.[0]?.message?.content || "").trim().toUpperCase();
    return out.startsWith("YES");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth required" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const text = String(body.text || "").trim();
  if (!text) return NextResponse.json({ ok: true, flagged: false, strikes: 0, limit: LIMIT });

  const flagged = localFlag(text) || (await groqFlag(text));
  const admin = createAdminClient();

  // Read current strike count.
  const { data: row } = await admin
    .from("user_strikes")
    .select("strikes, banned")
    .eq("user_id", user.id)
    .maybeSingle();
  let strikes = row?.strikes ?? 0;

  if (!flagged) {
    return NextResponse.json({ ok: true, flagged: false, strikes, limit: LIMIT, banned: false });
  }

  // Record the strike.
  strikes = strikes + 1;
  await admin.from("user_strikes").upsert({
    user_id: user.id,
    strikes,
    banned: strikes >= LIMIT,
    last_reason: text.slice(0, 200),
    updated_at: new Date().toISOString(),
  });

  if (strikes >= LIMIT) {
    // Ban the email so the account can't simply be re-created, then delete the user.
    if (user.email) {
      await admin.from("banned_emails").upsert({ email: user.email.toLowerCase(), reason: "3 chat strikes" });
    }
    // Sign the user out of this session, then hard-delete the auth account.
    await supabase.auth.signOut().catch(() => {});
    await admin.auth.admin.deleteUser(user.id).catch(() => {});
    return NextResponse.json({ ok: true, flagged: true, strikes, limit: LIMIT, banned: true });
  }

  return NextResponse.json({ ok: true, flagged: true, strikes, limit: LIMIT, banned: false });
}
