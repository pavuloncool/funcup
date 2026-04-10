import { Link } from 'expo-router';
import { Text, View } from 'react-native';

/**
 * Post-entry shell (Phase 010-002). Auth vs tabs routing is refined in 010-004.
 */
export default function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 24, gap: 12, justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: '600' }}>funcup (mobile)</Text>
      <Text>Expo Router scaffold for Phase 1 tasks.</Text>
      <Link href="/(auth)/login">Go to login</Link>
      <Link href="/(tabs)/hub/scan">Go to scan</Link>
      <Link href="/(tabs)/journal">Go to journal</Link>
      <Link href="/(tabs)/profile">Go to profile</Link>
    </View>
  );
}
