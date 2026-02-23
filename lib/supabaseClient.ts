import { createSupabaseBrowserClient } from "@/lib/supabase";

// Backward-compatible alias. Prefer importing from "@/lib/supabase" directly.
const supabase = createSupabaseBrowserClient();

export default supabase;
