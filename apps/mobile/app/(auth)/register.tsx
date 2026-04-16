import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function RegisterScreen() {
  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Register</Text>
      <Text>Placeholder register screen for Phase 3 tasks.</Text>
      <Link href="/(auth)/login-form">Back to login</Link>
    </View>
  );
}

