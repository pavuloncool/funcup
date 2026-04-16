import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

/**
 * Post-splash landing: splash still targets `/(auth)/login` (animated-splash unchanged).
 * Immediately continues to role selection without modifying MobileEntrySplash.
 */
export default function LoginScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/test-select-user');
  }, [router]);

  return <View style={{ flex: 1, backgroundColor: '#e9e9e9' }} />;
}
