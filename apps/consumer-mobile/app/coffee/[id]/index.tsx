import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCoffeePage } from '@funcup/shared';

import { ScreenError } from '../../../src/components/ScreenError';
import { CoffeePageSkeleton } from '../../../src/components/ui/Skeleton';
import { getResolvedSupabasePublicUrl, supabase } from '../../../src/services/supabaseClient';
import { CoffeePageBrewing } from '../../../src/coffee/CoffeePageBrewing';
import { CoffeePageCommunity } from '../../../src/coffee/CoffeePageCommunity';
import { CoffeePageProduct } from '../../../src/coffee/CoffeePageProduct';
import { CoffeePageStory } from '../../../src/coffee/CoffeePageStory';

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

function displayTagName(tag: { bean_origin_tradename: string; bean_origin_farm: string; id: string }): string {
  const tradename = tag.bean_origin_tradename.trim();
  if (tradename) return tradename;
  const farm = tag.bean_origin_farm.trim();
  if (farm) return farm;
  return `Kawa ${tag.id.slice(0, 8)}`;
}

function formatRoastDate(iso: string): string {
  const raw = iso.trim();
  if (!raw) return '—';
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T00:00:00`) : new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsed);
}

function resolveTagImageUri(rawUri: string): string {
  const value = rawUri.trim();
  if (!value) return value;

  let supabaseBase: URL | null = null;
  try {
    supabaseBase = new URL(getResolvedSupabasePublicUrl());
  } catch {
    supabaseBase = null;
  }

  if (value.startsWith('/')) {
    return supabaseBase ? `${supabaseBase.origin}${value}` : value;
  }

  try {
    const imageUrl = new URL(value);
    if (
      supabaseBase &&
      (imageUrl.hostname === '127.0.0.1' || imageUrl.hostname === 'localhost')
    ) {
      imageUrl.protocol = supabaseBase.protocol;
      imageUrl.hostname = supabaseBase.hostname;
      imageUrl.port = supabaseBase.port;
      return imageUrl.toString();
    }
    return imageUrl.toString();
  } catch {
    return value;
  }
}

export default function CoffeePage() {
  const params = useLocalSearchParams<{ id?: string }>();
  const hash = params.id ?? null;
  const coffeeQuery = useCoffeePage({ supabase, hash });
  const [tagImageFailed, setTagImageFailed] = useState(false);
  const demoReputationScore = 52;
  const tagImageUri = useMemo(() => {
    const d = coffeeQuery.data;
    if (!d || d.kind !== 'tag') return null;
    return resolveTagImageUri(d.tag.img_coffee_label);
  }, [coffeeQuery.data]);

  useEffect(() => {
    setTagImageFailed(false);
  }, [tagImageUri]);

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

  if (data.kind === 'tag') {
    const t = data.tag;
    const tagName = displayTagName(t);

    return (
      <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
        <View style={styles.card}>
          <Text style={styles.title} accessibilityRole="header">
            {tagName}
          </Text>

          <View style={styles.imageWrap}>
            {!tagImageFailed && tagImageUri ? (
              <Image
                source={{ uri: tagImageUri }}
                style={styles.image}
                resizeMode="contain"
                accessibilityLabel="Etykieta kawy"
                onError={() => setTagImageFailed(true)}
              />
            ) : (
              <View style={styles.imageFallback}>
                <Text style={styles.imageFallbackText}>Brak podglądu etykiety</Text>
              </View>
            )}
          </View>

          <Text style={styles.row}>
            <Text style={styles.strong}>Roaster:</Text> {t.roaster_short_name}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.strong}>Nazwa handlowa:</Text> {t.bean_origin_tradename || '—'}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.strong}>Pochodzenie:</Text> {t.bean_origin_country} · {t.bean_origin_region} ·{' '}
            {t.bean_origin_farm}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.strong}>Ziarno:</Text> {t.bean_type} · {t.bean_varietal_main}
            {t.bean_varietal_extra ? ` · ${t.bean_varietal_extra}` : ''}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.strong}>Obróbka:</Text> {t.bean_processing}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.strong}>Wypał:</Text> {formatRoastDate(t.bean_roast_date)} ({t.bean_roast_level})
          </Text>
          <Text style={styles.row}>
            <Text style={styles.strong}>Parzenie:</Text> {t.brew_method}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.strong}>Wysokość:</Text> {t.bean_origin_height} m
          </Text>
        </View>
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

const styles = StyleSheet.create({
  page: { backgroundColor: '#f3f4f6' },
  pageContent: { padding: 16 },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    marginBottom: 12,
    color: '#111',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
  },
  imageWrap: { marginBottom: 16 },
  image: {
    width: '100%',
    height: 420,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  imageFallback: {
    width: '100%',
    height: 420,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFallbackText: { color: '#6b7280', fontSize: 14 },
  row: { marginBottom: 12, fontSize: 17, lineHeight: 26, color: '#1a1a1a' },
  strong: { fontWeight: '600', color: '#111' },
});
