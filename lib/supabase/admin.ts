import "server-only";

// SERVER-ONLY admin client. Uses the service-role key, which BYPASSES Row-Level Security.
// `server-only` makes any client-side import a build error. Use sparingly and never trust
// client-supplied IDs without an explicit ownership/membership check.
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
