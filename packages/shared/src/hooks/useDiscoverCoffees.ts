import { useQuery } from '@tanstack/react-query';

import type { TypedSupabaseClient } from '../services/supabaseClientFactory';

export type DiscoverCoffeeItem = {
  id: string;
  name: string;
  processingMethod: string | null;
  roaster: {
    id: string;
    name: string;
    country: string | null;
    city: string | null;
  } | null;
};

type CoffeeRow = {
  id: string;
  name: string;
  processing_method: string | null;
  roasters:
    | {
        id: string;
        name: string;
        country: string | null;
        city: string | null;
      }
    | {
        id: string;
        name: string;
        country: string | null;
        city: string | null;
      }[]
    | null;
};

export async function fetchDiscoverCoffees(
  supabase: TypedSupabaseClient,
  limit = 12
): Promise<DiscoverCoffeeItem[]> {
  const { data, error } = await supabase
    .from('coffees')
    .select(
      `
      id,
      name,
      processing_method,
      roasters (
        id,
        name,
        country,
        city
      )
    `
    )
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return ((data ?? []) as CoffeeRow[]).map((coffee) => {
    const roaster = Array.isArray(coffee.roasters) ? coffee.roasters[0] ?? null : coffee.roasters;
    return {
      id: coffee.id,
      name: coffee.name,
      processingMethod: coffee.processing_method,
      roaster: roaster
        ? {
            id: roaster.id,
            name: roaster.name,
            country: roaster.country,
            city: roaster.city,
          }
        : null,
    };
  });
}

export function useDiscoverCoffees(params: { supabase: TypedSupabaseClient; limit?: number }) {
  return useQuery({
    queryKey: ['discoverCoffees', params.limit ?? 12],
    queryFn: () => fetchDiscoverCoffees(params.supabase, params.limit ?? 12),
  });
}
