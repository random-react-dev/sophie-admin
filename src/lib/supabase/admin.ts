import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for service_role operations.
 * This client bypasses RLS and should only be used server-side.
 *
 * Uses @supabase/supabase-js directly (not @supabase/ssr) to avoid
 * user session cookies overriding the service_role key.
 */
export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service role configuration");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
