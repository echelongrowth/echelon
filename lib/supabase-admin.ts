import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

function getRequiredEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "SUPABASE_SERVICE_ROLE_KEY"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

export function createSupabaseAdminClient() {
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
