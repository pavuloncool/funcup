import { useQuery } from '@tanstack/react-query';

import type { TypedSupabaseClient } from '../services/supabaseClientFactory';

export function useCoffeePage(params: {
  supabase: TypedSupabaseClient;
  hash: string | null;
}) {
  return useQuery({
    queryKey: ['coffeePage', params.hash],
    enabled: Boolean(params.hash),
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      if (!params.hash) throw new Error('hash is required');
      const { data, error } = await params.supabase.functions.invoke('scan_qr', {
        body: { hash: params.hash },
      });
      if (error) throw error;
      return data;
    },
  });
}

