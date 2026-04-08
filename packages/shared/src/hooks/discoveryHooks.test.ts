import { describe, expect, it } from 'vitest';

import { fetchDiscoverCoffees } from './useDiscoverCoffees';
import { fetchDiscoverRoasters } from './useDiscoverRoasters';

type CoffeeSelectRow = {
  id: string;
  name: string;
  processing_method: string | null;
  roasters: { id: string; name: string; country: string | null; city: string | null } | null;
};

type RoasterSelectRow = {
  id: string;
  name: string;
  country: string | null;
  city: string | null;
  description: string | null;
  website: string | null;
};

function createMockSupabase(input: {
  coffees?: CoffeeSelectRow[];
  roasters?: RoasterSelectRow[];
  follows?: string[];
  error?: Error | null;
}): unknown {
  return {
    from: (table: string) => ({
      select: () => ({
        eq: () => {
          if (table === 'users') {
            return {
              maybeSingle: async () => ({
                data: { following_roaster_ids: input.follows ?? [] },
                error: input.error ?? null,
              }),
            };
          }
          return {
            order: () => ({
              limit: async () => ({
                data:
                  table === 'coffees'
                    ? (input.coffees ?? [])
                    : table === 'roasters'
                      ? (input.roasters ?? [])
                      : [],
                error: input.error ?? null,
              }),
            }),
          };
        },
      }),
    }),
  };
}

describe('discovery hooks fetchers', () => {
  it('maps coffees payload', async () => {
    const supabase = createMockSupabase({
      coffees: [
        {
          id: 'coffee-1',
          name: 'Kenya AA',
          processing_method: 'washed',
          roasters: { id: 'roaster-1', name: 'A', country: 'PL', city: 'WAW' },
        },
      ],
    });

    const result = await fetchDiscoverCoffees(supabase as never);
    expect(result[0]?.name).toBe('Kenya AA');
    expect(result[0]?.roaster?.name).toBe('A');
  });

  it('returns roaster follow state', async () => {
    const supabase = createMockSupabase({
      roasters: [
        {
          id: 'roaster-1',
          name: 'Roaster One',
          country: 'PL',
          city: 'Krakow',
          description: null,
          website: null,
        },
      ],
      follows: ['roaster-1'],
    });

    const result = await fetchDiscoverRoasters(supabase as never, { userId: 'user-1' });
    expect(result[0]?.isFollowed).toBe(true);
  });

  it('throws when supabase returns error', async () => {
    const supabase = createMockSupabase({ error: new Error('boom') });
    await expect(fetchDiscoverCoffees(supabase as never)).rejects.toThrow('boom');
  });
});
