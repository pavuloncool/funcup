import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { useDiscoverCoffees } from '@funcup/shared';

import { supabase } from '../../services/supabaseClient';

export function DiscoverCoffeesTab() {
  const coffeesQuery = useDiscoverCoffees({ supabase, limit: 8 });

  if (coffeesQuery.isLoading) {
    return <Text>Loading coffees...</Text>;
  }

  if (coffeesQuery.isError) {
    return <Text>Could not load coffees right now.</Text>;
  }

  if (!coffeesQuery.data || coffeesQuery.data.length === 0) {
    return <Text>No coffees discovered yet.</Text>;
  }

  return (
    <View style={{ gap: 10 }}>
      {coffeesQuery.data.map((coffee) => (
        <View
          key={coffee.id}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, gap: 6 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{coffee.name}</Text>
          <Text>
            {coffee.roaster?.name ?? 'Unknown roaster'}
            {coffee.processingMethod ? ` · ${coffee.processingMethod}` : ''}
          </Text>
          <Link href={{ pathname: '/coffee/[id]', params: { id: coffee.id } }}>Open Coffee Page</Link>
        </View>
      ))}
    </View>
  );
}
