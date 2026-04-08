'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { supabaseBrowser } from '@/src/lib/supabase/browserClient';

type CoffeeRow = { id: string; name: string; status: string };

export default function CoffeesPage() {
  const [coffees, setCoffees] = useState<CoffeeRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!session || !supabaseUrl || !anonKey) {
        setError('Missing auth session or Supabase env.');
        setLoading(false);
        return;
      }

      const roasterResponse = await fetch(
        `${supabaseUrl}/rest/v1/roasters?select=id&user_id=eq.${user.id}&limit=1`,
        {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
      const roasterRows = (await roasterResponse.json()) as Array<{ id: string }>;
      const roasterId = roasterRows[0]?.id;
      if (!roasterId) {
        setError('No roaster profile linked to this account.');
        setLoading(false);
        return;
      }

      const listResponse = await fetch(
        `${supabaseUrl}/rest/v1/coffees?select=id,name,status&roaster_id=eq.${roasterId}&order=created_at.desc`,
        {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
      const rows = (await listResponse.json()) as CoffeeRow[];
      if (!listResponse.ok) {
        setError('Failed to load coffees list.');
      } else {
        setCoffees(rows ?? []);
      }
      setLoading(false);
    }
    void load();
  }, []);

  return (
    <main style={{ maxWidth: 760, margin: '30px auto', fontFamily: 'system-ui' }}>
      <h1>Roaster coffees</h1>
      <p>
        <Link href="/dashboard/coffees/new">+ New coffee</Link>
      </p>
      {loading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      {!loading && coffees.length === 0 ? <p>No coffees yet.</p> : null}
      <ul>
        {coffees.map(coffee => (
          <li key={coffee.id}>
            <Link href={`/dashboard/coffees/${coffee.id}`}>
              {coffee.name} ({coffee.status})
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
