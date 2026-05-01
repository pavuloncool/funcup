import { Link, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { AccessibilityInfo } from 'react-native';
import { AppScreen, AppText } from '../src/components/ui/primitives';

/**
 * Post-entry shell (Phase 010-002). Auth vs tabs routing is refined in 010-004.
 * After FR-012 entry (010-003), screen reader users get a short landing cue (focus order starts at header).
 */
export default function HomeScreen() {
  useFocusEffect(
    useCallback(() => {
      const t = setTimeout(() => {
        AccessibilityInfo.isScreenReaderEnabled()
          .then((on) => {
            if (on) {
              AccessibilityInfo.announceForAccessibility('Home');
            }
          })
          .catch(() => {});
      }, 450);
      return () => clearTimeout(t);
    }, [])
  );

  return (
    <AppScreen style={{ padding: 24, gap: 12, justifyContent: 'center' }}>
      <AppText
        variant="h1"
        weight="700"
        accessibilityRole="header"
        accessibilityLabel="funcup home"
      >
        funcup (mobile)
      </AppText>
      <AppText>Expo Router scaffold for Phase 1 tasks.</AppText>
      <Link href="/(auth)/login-form">Go to login</Link>
      <Link href="/(tabs)/hub/scan">Go to scan</Link>
      <Link href="/(tabs)/journal">Go to journal</Link>
      <Link href="/(tabs)/profile">Go to profile</Link>
    </AppScreen>
  );
}
