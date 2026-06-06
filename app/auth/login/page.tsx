// /auth/login — kept for compatibility (some redirects target it). Renders the same
// auth screen as "/". The primary entry point is "/".
import AuthScreen from "../../_components/AuthScreen";

export const metadata = { title: "Sign in · Tilāwah" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string; next?: string; mode?: string };
}) {
  const next = searchParams.next && searchParams.next.startsWith("/") ? searchParams.next : "/home";
  const signupMode = searchParams.mode === "signup";
  return (
    <AuthScreen next={next} signupMode={signupMode} error={searchParams.error} message={searchParams.message} />
  );
}
