import { Link } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useJournal } from '@funcup/shared';

import { EmptyState } from '../../src/components/EmptyState';
import { ScreenError } from '../../src/components/ScreenError';
import { DiscoverListSkeleton } from '../../src/components/ui/Skeleton';
import { useViewerUserId } from '../../src/hooks/useViewerUserId';
import { supabase } from '../../src/services/supabaseClient';

type JournalRow = {
  id: string;
  rating: number | null;
  free_text_notes: string | null;
  logged_at: string;
  roast_batches: {
    id: string;
    lot_number: string | null;
    coffees: { id: string; name: string; roasters: { id: string; name: string } | null } | null;
  } | null;
};

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export default function JournalIndex() {
  const { userId, isLoading: authLoading } = useViewerUserId();
  const journalQuery = useJournal({ supabase, userId });

  if (authLoading) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 16 }} accessibilityRole="header">
          Journal
        </Text>
        <DiscoverListSkeleton rows={3} />
      </ScrollView>
    );
  }

  if (!userId) {
    return (
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 12 }} accessibilityRole="header">
          Journal
        </Text>
        <EmptyState
          title="Sign in to see your journal"
          description="Your tastings will show up here after you log a coffee."
          footer={
            <Link href="/(auth)/login" accessibilityRole="link">
              Go to sign in
            </Link>
          }
        />
      </ScrollView>
    );
  }

  if (journalQuery.isLoading) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 16 }} accessibilityRole="header">
          Journal
        </Text>
        <DiscoverListSkeleton rows={4} />
      </ScrollView>
    );
  }

  if (journalQuery.isError) {
    return (
      <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: '600' }} accessibilityRole="header">
          Journal
        </Text>
        <ScreenError message={formatError(journalQuery.error)} onRetry={() => void journalQuery.refetch()} />
      </ScrollView>
    );
  }

  const rows = (journalQuery.data ?? []) as JournalRow[];

  if (rows.length === 0) {
    return (
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 12 }} accessibilityRole="header">
          Journal
        </Text>
        <EmptyState
          title="No tastings yet"
          description="Scan a bag, log a tasting, and your notes will land here."
          footer={
            <Link href="/(tabs)/hub/scan" accessibilityRole="link">
              Open scanner
            </Link>
          }
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 14 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }} accessibilityRole="header">
        Journal
      </Text>
      {rows.map((row) => {
        const coffee = row.roast_batches?.coffees;
        const title = coffee?.name ?? 'Coffee';
        const roaster = coffee?.roasters?.name;
        const ratingLabel = row.rating != null ? `${row.rating} / 5` : '—';
        return (
          <View
            key={row.id}
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 12,
              padding: 14,
              gap: 6,
              backgroundColor: '#fafafa',
            }}
            accessibilityLabel={`${title}, ${roaster ?? ''}, rating ${ratingLabel}`}
          >
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#111827' }}>{title}</Text>
            {roaster ? <Text style={{ color: '#4b5563' }}>{roaster}</Text> : null}
            <Text style={{ color: '#374151' }}>
              {ratingLabel}
              {row.logged_at ? ` · ${new Date(row.logged_at).toLocaleString()}` : ''}
            </Text>
            {row.free_text_notes ? (
              <Text style={{ color: '#6b7280', marginTop: 4 }} numberOfLines={4}>
                {row.free_text_notes}
              </Text>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}
