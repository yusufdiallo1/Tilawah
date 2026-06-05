// Refreshes the Supabase auth session on every request and keeps cookies in sync.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: refreshes the token. Do not run logic between createServerClient and getUser.
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthed = !!user;
  // Signed-in users belong in the app (/home); the marketing page lives at "/".
  if (isAuthed && path === "/") {
    const url = request.nextUrl.clone(); url.pathname = "/home"; return NextResponse.redirect(url);
  }
  // The app (/home) and account areas require sign-in.
  if (!isAuthed && (path === "/home" || path.startsWith("/home/"))) {
    const url = request.nextUrl.clone(); url.pathname = "/auth/login"; url.searchParams.set("next", path); return NextResponse.redirect(url);
  }

  return response;
}
