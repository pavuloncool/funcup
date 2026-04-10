import { useState } from 'react';
import { Link } from 'expo-router';
import { Text, TextInput, View } from 'react-native';

export default function ScanScreen() {
  const [hash, setHash] = useState('11111111-1111-1111-1111-111111111111');

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Scan</Text>
      <Text>Placeholder QR scanner screen for Phase 3 tasks.</Text>

      <TextInput
        value={hash}
        onChangeText={setHash}
        autoCapitalize="none"
        autoCorrect={false}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }}
      />

      <Link href={{ pathname: '/coffee/[id]', params: { id: hash } }}>Open Coffee Page</Link>
    </View>
  );
}

