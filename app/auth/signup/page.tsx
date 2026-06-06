import { redirect } from "next/navigation";

// /auth/signup — sign-up surface. The auth screen lives at "/"; open it in signup mode.
export default function SignupPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next = searchParams.next && searchParams.next.startsWith("/") ? searchParams.next : "/home";
  redirect(`/?mode=signup&next=${encodeURIComponent(next)}`);
}
