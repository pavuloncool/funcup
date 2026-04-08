import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { CoffeePageBrewing } from './CoffeePageBrewing';
import { CoffeePageCommunity } from './CoffeePageCommunity';
import { CoffeePageProduct } from './CoffeePageProduct';
import { CoffeePageStory } from './CoffeePageStory';

export default function CoffeePage() {
  const params = useLocalSearchParams<{ id?: string }>();
  const demoReputationScore = 52;

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Coffee Page</Text>
      <Text>Param id/hash: {params.id ?? '(missing)'}</Text>

      <CoffeePageProduct coffeeName="Demo Coffee" />
      <CoffeePageBrewing />
      <CoffeePageStory />
      <CoffeePageCommunity reputationScore={demoReputationScore} />

      <View style={{ paddingVertical: 12 }}>
        <Link href={{ pathname: '/coffee/[id]/log', params: { id: params.id ?? '' } }}>
          Go to Tasting Log
        </Link>
      </View>
    </ScrollView>
  );
}

