"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

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
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUpWithEmail(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = safeNext(formData);
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${originFromHeaders()}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error) redirect(`/?mode=signup&error=${encodeURIComponent(error.message)}`);
  redirect(`/?message=${encodeURIComponent("Check your email to confirm your account.")}`);
}

