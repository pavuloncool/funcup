import { useQuery } from '@tanstack/react-query';

import type { TypedSupabaseClient } from '../services/supabaseClientFactory';

/** Payload returned by `scan_qr` for a valid hash (see `supabase/functions/scan_qr`). */
export type ScanQrResponse = {
  batch: {
    id: string;
    roast_date: string;
    lot_number: string | null;
    status: string;
    brewing_notes: string | null;
    roaster_story: string | null;
  };
  coffee: {
    id: string;
    name: string;
    variety: string | null;
    processing_method: string | null;
    producer_notes: string | null;
    cover_image_url: string | null;
    status: string;
  };
  origin: Record<string, unknown> | null;
  roaster: {
    id: string;
    name: string;
    city: string | null;
    country: string | null;
    logo_url: string | null;
  };
  stats: {
    total_count: number;
    avg_rating: number;
    rating_distribution: Record<string, number>;
    top_flavor_notes: unknown[];
  };
  archived: boolean;
};

export function useCoffeePage(params: {
  supabase: TypedSupabaseClient;
  hash: string | null;
}) {
  return useQuery({
    queryKey: ['coffeePage', params.hash],
    enabled: Boolean(params.hash),
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async (): Promise<ScanQrResponse> => {
      if (!params.hash) throw new Error('hash is required');
      const { data, error } = await params.supabase.functions.invoke<ScanQrResponse>('scan_qr', {
        body: { hash: params.hash },
      });
      if (error) throw error;
      if (!data) throw new Error('Empty scan_qr response');
      return data;
    },
  });
}

