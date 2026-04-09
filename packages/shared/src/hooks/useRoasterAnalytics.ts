import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import {
  aggregateRatingSummary,
  brewMethodsPresentInLogs,
  filterLogsByBrewMethod,
  topFlavorNotesFromLogs,
  type BrewMethodOption,
  type FlavorNoteRank,
  type RatingSummary,
  type RoasterTastingLog,
} from '../analytics/roasterBatchAnalytics';
import type { TypedSupabaseClient } from '../services/supabaseClientFactory';

type CoffeeStatsRow = {
  batch_id: string;
  total_count: number;
  avg_rating: number;
  rating_distribution: Record<string, number>;
  top_flavor_notes: string[];
  updated_at: string;
};

type LogRow = {
  id: string;
  rating: number;
  brew_method_id: string | null;
  brew_methods: { id: string; name: string } | null;
  tasting_notes: Array<{
    flavor_note_id: string;
    flavor_notes: { id: string; name: string; label: string; category: string } | null;
  }> | null;
};

function mapLogRow(row: LogRow): RoasterTastingLog {
  const flavorNotes: RoasterTastingLog['flavorNotes'] = [];
  for (const tn of row.tasting_notes ?? []) {
    const fn = tn.flavor_notes;
    if (fn?.id) {
      flavorNotes.push({
        id: fn.id,
        name: fn.name,
        label: fn.label,
        category: fn.category,
      });
    }
  }
  return {
    id: row.id,
    rating: row.rating,
    brewMethodId: row.brew_method_id,
    brewMethodName: row.brew_methods?.name ?? null,
    flavorNotes,
  };
}

export type UseRoasterAnalyticsParams = {
  supabase: TypedSupabaseClient;
  batchId: string | null;
};

export type RoasterAnalyticsFetched = {
  globalFromStats: RatingSummary | null;
  statsUpdatedAt: string | null;
  logs: RoasterTastingLog[];
  brewMethodOptions: BrewMethodOption[];
  globalTopFlavorNotes: FlavorNoteRank[];
};

export type RoasterAnalyticsData = RoasterAnalyticsFetched & {
  selectedBrewMethodId: string | null;
  setSelectedBrewMethodId: (id: string | null) => void;
  /** Subset matching the brew-method filter; separate from globalFromStats. */
  filteredSummary: RatingSummary;
  filteredTopFlavorNotes: FlavorNoteRank[];
};

export function useRoasterAnalytics(params: UseRoasterAnalyticsParams) {
  const [selectedBrewMethodId, setSelectedBrewMethodId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedBrewMethodId(null);
  }, [params.batchId]);

  const query = useQuery({
    queryKey: ['roasterAnalytics', params.batchId],
    enabled: Boolean(params.batchId),
    queryFn: async (): Promise<RoasterAnalyticsFetched> => {
      if (!params.batchId) throw new Error('batchId is required');

      const [statsRes, logsRes] = await Promise.all([
        params.supabase
          .from('coffee_stats')
          .select(
            'batch_id, total_count, avg_rating, rating_distribution, top_flavor_notes, updated_at'
          )
          .eq('batch_id', params.batchId)
          .maybeSingle(),
        params.supabase
          .from('coffee_logs')
          .select(
            `
            id,
            rating,
            brew_method_id,
            brew_methods ( id, name ),
            tasting_notes (
              flavor_note_id,
              flavor_notes ( id, name, label, category )
            )
          `
          )
          .eq('batch_id', params.batchId),
      ]);

      if (statsRes.error) throw statsRes.error;
      if (logsRes.error) throw logsRes.error;

      const stats = statsRes.data as CoffeeStatsRow | null;
      const rawLogs = (logsRes.data ?? []) as LogRow[];
      const logs = rawLogs.map(mapLogRow);

      const globalFromStats: RatingSummary | null = stats
        ? {
            totalTastings: stats.total_count,
            avgRating: Number(stats.avg_rating),
            ratingDistribution: {
              ...stats.rating_distribution,
            },
          }
        : null;

      return {
        globalFromStats,
        statsUpdatedAt: stats?.updated_at ?? null,
        logs,
        brewMethodOptions: brewMethodsPresentInLogs(logs),
        globalTopFlavorNotes: topFlavorNotesFromLogs(logs, 10),
      };
    },
  });

  const data: RoasterAnalyticsData | undefined = useMemo(() => {
    if (!query.data) return undefined;
    const { logs, globalFromStats, statsUpdatedAt, brewMethodOptions, globalTopFlavorNotes } =
      query.data;
    const filteredLogs = filterLogsByBrewMethod(logs, selectedBrewMethodId);
    return {
      globalFromStats,
      statsUpdatedAt,
      logs,
      brewMethodOptions,
      globalTopFlavorNotes,
      selectedBrewMethodId,
      setSelectedBrewMethodId,
      filteredSummary: aggregateRatingSummary(filteredLogs),
      filteredTopFlavorNotes: topFlavorNotesFromLogs(filteredLogs, 10),
    };
  }, [query.data, selectedBrewMethodId]);

  return {
    ...query,
    data,
    selectedBrewMethodId,
    setSelectedBrewMethodId,
  };
}
