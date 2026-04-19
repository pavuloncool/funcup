import { createBrowserSupabaseClient } from '@funcup/shared';
import Constants from 'expo-constants';

type SupabaseExtra = {
  supabaseFallbackUrl?: string;
  supabaseFallbackAnonKey?: string;
};

function getSupabaseExtra(): SupabaseExtra {
  const e = Constants.expoConfig?.extra ?? Constants.manifest2?.extra;
  return (e ?? {}) as SupabaseExtra;
}

// Metro inlines EXPO_PUBLIC_*; app.config.ts extra.* supplies local defaults when env is missing (common on web).
const extra = getSupabaseExtra();
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || extra.supabaseFallbackUrl;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || extra.supabaseFallbackAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY (and no app.config extra fallbacks). ' +
      'Copy apps/consumer-mobile/.env.example to apps/consumer-mobile/.env.local, set both values, then restart Expo with cache clear (expo start -c).'
  );
}

const resolvedSupabaseUrl: string = supabaseUrl;
const resolvedSupabaseAnonKey: string = supabaseAnonKey;

export const supabase = createBrowserSupabaseClient({
  supabaseUrl: resolvedSupabaseUrl,
  supabaseAnonKey: resolvedSupabaseAnonKey,
});

/** For dev UI: which API host the client uses (should match local Studio DB when developing against CLI). */
export function getResolvedSupabasePublicOrigin(): string {
  try {
    return new URL(resolvedSupabaseUrl).host;
  } catch {
    return resolvedSupabaseUrl;
  }
}

