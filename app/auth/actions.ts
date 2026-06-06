"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// True if this email was banned (after 3 chat strikes). Server-only check.
async function isBanned(email: string) {
  if (!email) return false;
  const admin = createAdminClient();
  const { data } = await admin
    .from("banned_emails")
    .select("email")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  return !!data;
}

function originFromHeaders() {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host")!;
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

// Keep redirect targets internal (avoid open-redirect via the ?next= param).
function safeNext(formData: FormData) {
  const next = String(formData.get("next") || "");
  return next.startsWith("/") && !next.startsWith("//") ? next : "/home";
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = safeNext(formData);
  if (await isBanned(email)) {
    redirect(`/?error=${encodeURIComponent("This account is banned.")}`);
  }
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUpWithEmail(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const displayName = String(formData.get("display_name") || "").trim().slice(0, 60);
  const next = safeNext(formData);
  if (await isBanned(email)) {
    redirect(`/?mode=signup&error=${encodeURIComponent("This account is banned.")}`);
  }
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${originFromHeaders()}/auth/callback?next=${encodeURIComponent(next)}`,
      data: displayName ? { display_name: displayName } : undefined,
    },
  });
  if (error) redirect(`/?mode=signup&error=${encodeURIComponent(error.message)}`);
  redirect(`/?message=${encodeURIComponent("Check your email to confirm your account.")}`);
}

