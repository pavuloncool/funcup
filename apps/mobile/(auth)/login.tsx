import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Login</Text>
      <Text>Placeholder login screen for Phase 3 tasks.</Text>
      <Link href="/(tabs)/hub/scan">Continue to Scan</Link>
      <Link href="/(auth)/register">Register</Link>
    </View>
  );
}

