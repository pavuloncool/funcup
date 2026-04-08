import { hasExpertBadge } from '@funcup/shared';
import { Text, View } from 'react-native';

export function CoffeePageCommunity(props: { reputationScore?: number }) {
  const showExpertBadge = hasExpertBadge(props.reputationScore ?? 0);

  return (
    <View style={{ paddingVertical: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Community</Text>
      <Text>Community notes from recent tastings.</Text>
      {showExpertBadge ? (
        <Text style={{ marginTop: 6, color: '#6b7280', fontSize: 12 }}>Expert taster</Text>
      ) : null}
    </View>
  );
}

