import { createBrowserClient } from "@supabase/ssr";

// Hardcoded fallback values (these will work even if env vars are missing)
const FALLBACK_URL = "https://dtejfdquiqogwapjtfar.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZWpmZHF1aXFvZ3dhcGp0ZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjY5ODAsImV4cCI6MjA5MjA0Mjk4MH0.ptiq8drt1WuBrKv3OMgf6lo8IiJUFqferwnGGWSJksM";

// Get env vars, use fallback if empty/undefined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

// Debug: Log if using fallback
if (typeof window !== 'undefined') {
  console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('Supabase Key:', supabaseAnonKey ? 'Set' : 'Missing');
}

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Export for debugging
export const getClientConfig = () => ({
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length || 0,
  urlFromEnv: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  keyFromEnv: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});