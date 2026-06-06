// "/" is the app entry: sign in / sign up. Signed-in users are redirected to /home
// by middleware. No marketing landing — auth is the front door.
import AuthScreen from "./_components/AuthScreen";

export const metadata = { title: "Tilāwah · Sign in" };

export default function Page({
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
