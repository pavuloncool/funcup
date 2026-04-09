import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { useDiscoverCoffees } from '@funcup/shared';

import { EmptyState } from '../EmptyState';
import { ScreenError } from '../ScreenError';
import { DiscoverListSkeleton } from '../ui/Skeleton';
import { supabase } from '../../services/supabaseClient';

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export function DiscoverCoffeesTab() {
  const coffeesQuery = useDiscoverCoffees({ supabase, limit: 8 });

  if (coffeesQuery.isLoading) {
    return <DiscoverListSkeleton rows={4} />;
  }

  if (coffeesQuery.isError) {
    return (
      <ScreenError
        message={formatError(coffeesQuery.error)}
        onRetry={() => void coffeesQuery.refetch()}
      />
    );
  }

  if (!coffeesQuery.data || coffeesQuery.data.length === 0) {
    return (
      <EmptyState
        title="No coffees yet"
        description="When roasters publish batches, they will appear here for you to explore."
      />
    );
  }

  return (
    <View style={{ gap: 10 }} accessibilityRole="list">
      {coffeesQuery.data.map((coffee) => (
        <View
          key={coffee.id}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, gap: 6 }}
          accessibilityRole="text"
          accessibilityLabel={`${coffee.name}, ${coffee.roaster?.name ?? 'Unknown roaster'}`}
        >
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{coffee.name}</Text>
          <Text>
            {coffee.roaster?.name ?? 'Unknown roaster'}
            {coffee.processingMethod ? ` · ${coffee.processingMethod}` : ''}
          </Text>
          <Link
            href={{ pathname: '/coffee/[id]', params: { id: coffee.qrHash } }}
            accessibilityRole="link"
            accessibilityLabel={`Open coffee page for ${coffee.name}`}
          >
            Open Coffee Page
          </Link>
        </View>
      ))}
    </View>
  );
}
