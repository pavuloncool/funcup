import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { BrewMethodPicker } from './components/BrewMethodPicker';
import { FlavorNoteSelector } from './components/FlavorNoteSelector';
import { RatingInput } from './components/RatingInput';

export default function TastingLogScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const demoReputationScore = 24;

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Tasting Log</Text>
      <Text>Batch/Coffee id: {params.id ?? '(missing)'}</Text>

      <RatingInput />
      <BrewMethodPicker />
      <FlavorNoteSelector reputationScore={demoReputationScore} />
    </View>
  );
}

