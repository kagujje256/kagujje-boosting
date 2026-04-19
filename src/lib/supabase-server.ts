import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Hardcoded fallbacks - will work even without env vars
const SUPABASE_URL = "https://dtejfdquiqogwapjtfar.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZWpmZHF1aXFvZ3dhcGp0ZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjY5ODAsImV4cCI6MjA5MjA0Mjk4MH0.ptiq8drt1WuBrKv3OMgf6lo8IiJUFqferwnGGWSJksM";

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component — ignore
        }
      },
    },
  });
}

// Export for direct use
export { SUPABASE_URL, SUPABASE_ANON_KEY };