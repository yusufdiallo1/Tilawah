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
  // "/" and /auth/login are the sign-in screen. Signed-in users belong in /home.
  if (isAuthed && (path === "/" || path === "/auth/login")) {
    const url = request.nextUrl.clone(); url.pathname = "/home"; url.search = ""; return NextResponse.redirect(url);
  }
  // The app (/home) requires sign-in → send guests to the sign-in screen at "/".
  if (!isAuthed && (path === "/home" || path.startsWith("/home/"))) {
    const url = request.nextUrl.clone(); url.pathname = "/"; url.searchParams.set("next", path); return NextResponse.redirect(url);
  }

  return response;
}
