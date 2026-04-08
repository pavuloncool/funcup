import { createBrowserSupabaseClient } from '@funcup/shared';

const env = (
  globalThis as {
    process?: {
      env?: Record<string, string | undefined>;
    };
  }
).process?.env;

const supabaseUrl = env?.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env?.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createBrowserSupabaseClient({
  supabaseUrl,
  supabaseAnonKey
});

