import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

function requireEnv(value: string | undefined): string {
  if (!value) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return value;
}

const supabaseUrl = requireEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = requireEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

let browserClient: SupabaseClient<Database> | undefined;

export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}
