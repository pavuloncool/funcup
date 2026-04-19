import { getReputationLevel, getReputationLevelLabel } from '@funcup/shared';
import { ScrollView, Text, View } from 'react-native';

export default function ProfileScreen() {
  const demoReputationScore = 24;
  const reputationLevel = getReputationLevel(demoReputationScore);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Profile</Text>
      <View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, gap: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Sensory reputation</Text>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>{getReputationLevelLabel(reputationLevel)}</Text>
        <Text style={{ color: '#4b5563' }}>Score: {demoReputationScore}</Text>
      </View>
    </ScrollView>
  );
}
