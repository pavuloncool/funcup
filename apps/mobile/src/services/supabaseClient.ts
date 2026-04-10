import { createBrowserSupabaseClient } from '@funcup/shared';

// Use direct process.env.* so Expo Metro can inline EXPO_PUBLIC_* (see apps/mobile/.env.example).
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Copy apps/mobile/.env.example to apps/mobile/.env.local, set both values, then restart Expo (pnpm mobile:start).'
  );
}

export const supabase = createBrowserSupabaseClient({
  supabaseUrl,
  supabaseAnonKey
});

