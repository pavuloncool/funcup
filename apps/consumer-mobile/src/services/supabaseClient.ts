import { createBrowserSupabaseClient } from '@funcup/shared';
import Constants from 'expo-constants';

type SupabaseExtra = {
  supabaseFallbackUrl?: string;
  supabaseFallbackAnonKey?: string;
};

/** Same defaults as app.config.ts — used only if env + manifest extra are empty. */
const LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321';
const LOCAL_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.9kEXx9GFfgcZ21LlMB1qI-LOwSGOzI8g8c92UgEHQDk';

function getSupabaseExtra(): SupabaseExtra {
  const e = Constants.expoConfig?.extra ?? Constants.manifest2?.extra;
  return (e ?? {}) as SupabaseExtra;
}

/**
 * Resolve URL/key after native bridge + Expo manifest are ready (fixes stale config when importing early).
 * Prefer manifest `extra` from app.config (loaded via dotenv when Expo CLI starts).
 */
function resolveSupabaseConfig(): { url: string; key: string } {
  const extra = getSupabaseExtra();
  const url =
    (typeof extra.supabaseFallbackUrl === 'string' && extra.supabaseFallbackUrl.length > 0
      ? extra.supabaseFallbackUrl
      : undefined) ||
    (typeof process.env.EXPO_PUBLIC_SUPABASE_URL === 'string' && process.env.EXPO_PUBLIC_SUPABASE_URL.length > 0
      ? process.env.EXPO_PUBLIC_SUPABASE_URL
      : undefined) ||
    LOCAL_SUPABASE_URL;

  const key =
    (typeof extra.supabaseFallbackAnonKey === 'string' && extra.supabaseFallbackAnonKey.length > 0
      ? extra.supabaseFallbackAnonKey
      : undefined) ||
    (typeof process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY === 'string' &&
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY.length > 0
      ? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
      : undefined) ||
    LOCAL_SUPABASE_ANON_KEY;

  return { url, key };
}

let _client: ReturnType<typeof createBrowserSupabaseClient> | null = null;

/** Lazily creates the client so Constants.expoConfig.extra matches the last Metro manifest (important for Expo Go). */
export function getSupabase(): ReturnType<typeof createBrowserSupabaseClient> {
  if (!_client) {
    const { url, key } = resolveSupabaseConfig();
    _client = createBrowserSupabaseClient({
      supabaseUrl: url,
      supabaseAnonKey: key,
    });
  }
  return _client;
}

/**
 * Shared Supabase singleton — use `getSupabase()` or this proxy (backward compatible).
 * Proxy ensures lazy init for Expo Go + LAN / .env timing.
 */
export const supabase = new Proxy({} as ReturnType<typeof createBrowserSupabaseClient>, {
  get(_target, prop: string | symbol) {
    const c = getSupabase();
    const value = (c as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === 'function') {
      return value.bind(c);
    }
    return value;
  },
});

/** For dev UI: which API host the client uses (should match local Studio DB when developing against CLI). */
export function getResolvedSupabasePublicOrigin(): string {
  try {
    const url = resolveSupabaseConfig().url;
    return new URL(url).host;
  } catch {
    return resolveSupabaseConfig().url;
  }
}

/** For URL rewriting (e.g. localhost image URLs to LAN host on physical iOS device). */
export function getResolvedSupabasePublicUrl(): string {
  return resolveSupabaseConfig().url;
}
