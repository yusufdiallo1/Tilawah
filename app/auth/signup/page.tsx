import { redirect } from "next/navigation";

// /auth/signup — the sign-up surface. Reuses the auth screen in "signup" mode so
// there's a single, consistent form (email/password + Google) for both flows.
export default function SignupPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next = searchParams.next && searchParams.next.startsWith("/") ? searchParams.next : "/home";
  redirect(`/auth/login?mode=signup&next=${encodeURIComponent(next)}`);
}
