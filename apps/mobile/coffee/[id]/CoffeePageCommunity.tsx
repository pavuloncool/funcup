import { hasExpertBadge } from '@funcup/shared';
import { Text, View } from 'react-native';

export function CoffeePageCommunity(props: {
  reputationScore?: number;
  totalTastings?: number;
  avgRating?: number;
}) {
  const showExpertBadge = hasExpertBadge(props.reputationScore ?? 0);
  const tastings = props.totalTastings ?? 0;
  const avg = props.avgRating ?? 0;

  return (
    <View style={{ paddingVertical: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Community</Text>
      <Text style={{ color: '#374151' }}>
        {tastings > 0
          ? `${tastings} tasting${tastings === 1 ? '' : 's'} · avg ${avg.toFixed(1)} / 5`
          : 'Be the first to log a tasting for this batch.'}
      </Text>
      {showExpertBadge ? (
        <Text style={{ marginTop: 6, color: '#6b7280', fontSize: 12 }}>Expert taster</Text>
      ) : null}
    </View>
  );
}

