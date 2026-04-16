import type { ConfigContext, ExpoConfig } from 'expo/config';

/** Default local Supabase (CLI). Used when EXPO_PUBLIC_* are missing at bundle/config time. */
const LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321';
const LOCAL_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.9kEXx9GFfgcZ21LlMB1qI-LOwSGOzI8g8c92UgEHQDk';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'funcup',
  slug: 'funcup',
  scheme: 'funcup',
  version: '0.1.0',
  newArchEnabled: true,
  orientation: 'portrait',
  platforms: ['ios', 'android', 'web'],
  assetBundlePatterns: ['**/*'],
  plugins: [
    [
      'expo-router',
      {
        root: 'app',
      },
    ],
  ],
  android: {
    intentFilters: [
      {
        action: 'VIEW',
        data: [
          {
            scheme: 'funcup',
            host: 'q',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
      {
        action: 'VIEW',
        data: [
          {
            scheme: 'funcup',
            host: 'q',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
    package: 'com.anonymous.funcup',
  },
  ios: {
    bundleIdentifier: 'com.anonymous.funcup',
  },
  extra: {
    supabaseFallbackUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || LOCAL_SUPABASE_URL,
    supabaseFallbackAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || LOCAL_SUPABASE_ANON_KEY,
  },
});
