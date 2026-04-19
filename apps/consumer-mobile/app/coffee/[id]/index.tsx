import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useCoffeePage } from '@funcup/shared';

import { ScreenError } from '../../../src/components/ScreenError';
import { CoffeePageSkeleton } from '../../../src/components/ui/Skeleton';
import { supabase } from '../../../src/services/supabaseClient';
import { CoffeePageBrewing } from '../../../src/coffee/CoffeePageBrewing';
import { CoffeePageCommunity } from '../../../src/coffee/CoffeePageCommunity';
import { CoffeePageProduct } from '../../../src/coffee/CoffeePageProduct';
import { CoffeePageStory } from '../../../src/coffee/CoffeePageStory';

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export default function CoffeePage() {
  const params = useLocalSearchParams<{ id?: string }>();
  const hash = params.id ?? null;
  const coffeeQuery = useCoffeePage({ supabase, hash });
  const demoReputationScore = 52;

  if (!hash) {
    return (
      <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
        <ScreenError
          title="Missing QR"
          message="Open this page from a scanned QR code or a valid link."
        />
      </ScrollView>
    );
  }

  if (coffeeQuery.isLoading) {
    return (
      <ScrollView>
        <CoffeePageSkeleton />
      </ScrollView>
    );
  }

  if (coffeeQuery.isError) {
    return (
      <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
        <ScreenError
          message={formatError(coffeeQuery.error)}
          onRetry={() => void coffeeQuery.refetch()}
        />
      </ScrollView>
    );
  }

  const data = coffeeQuery.data;
  if (!data) {
    return (
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <ScreenError title="No data" message="Unexpected empty response from scan." />
      </ScrollView>
    );
  }

  const logHref = {
    pathname: '/coffee/[id]/log' as const,
    params: {
      id: hash,
      batchId: data.batch.id,
    },
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
      {data.archived ? (
        <View
          style={{
            backgroundColor: '#fef3c7',
            borderRadius: 8,
            padding: 12,
            borderWidth: 1,
            borderColor: '#fcd34d',
          }}
        >
          <Text style={{ fontWeight: '600', color: '#92400e' }}>Archived batch</Text>
          <Text style={{ color: '#b45309', marginTop: 4 }}>Tasting may be limited for this roast.</Text>
        </View>
      ) : null}

      <Text style={{ fontSize: 24, fontWeight: '600' }} accessibilityRole="header">
        Coffee Page
      </Text>

      <CoffeePageProduct
        coffeeName={data.coffee.name}
        variety={data.coffee.variety}
        processingMethod={data.coffee.processing_method}
        producerNotes={data.coffee.producer_notes}
        roasterName={data.roaster.name}
      />
      <CoffeePageBrewing brewingNotes={data.batch.brewing_notes} />
      <CoffeePageStory roasterStory={data.batch.roaster_story} />
      <CoffeePageCommunity
        reputationScore={demoReputationScore}
        totalTastings={data.stats.total_count}
        avgRating={data.stats.avg_rating}
      />

      <View style={{ paddingVertical: 12 }}>
        <Link href={logHref} accessibilityRole="link" accessibilityLabel="Open tasting log for this batch">
          Go to Tasting Log
        </Link>
      </View>
    </ScrollView>
  );
}
