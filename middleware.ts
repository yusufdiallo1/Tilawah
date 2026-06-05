import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Run on all paths except static assets, the prototype, and the bundled data.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|tilawah.html|data/|source-pdfs/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|json)$).*)",
  ],
};
