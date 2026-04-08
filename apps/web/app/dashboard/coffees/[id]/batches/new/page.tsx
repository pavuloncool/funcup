'use client';

import { useRouter, useParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { supabaseBrowser } from '@/src/lib/supabase/browserClient';

export default function NewBatchPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [lotNumber, setLotNumber] = useState('');
  const [roastDate, setRoastDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { session },
    } = await supabaseBrowser.auth.getSession();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!session?.access_token || !supabaseUrl || !anonKey) {
      setError('Missing auth session or Supabase env.');
      setLoading(false);
      return;
    }

    const createResponse = await fetch(`${supabaseUrl}/rest/v1/roast_batches?select=id`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        coffee_id: params.id,
        lot_number: lotNumber,
        roast_date: roastDate,
        status: 'active',
      }),
    });
    const rows = (await createResponse.json()) as Array<{ id: string }>;
    const batchId = rows[0]?.id;

    setLoading(false);
    if (!createResponse.ok || !batchId) {
      setError('Unable to create batch.');
      return;
    }

    router.push(`/dashboard/coffees/${params.id}/batches/${batchId}`);
  }

  return (
    <main style={{ maxWidth: 760, margin: '30px auto', fontFamily: 'system-ui' }}>
      <h1>Create batch</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <input
          placeholder="Lot number"
          value={lotNumber}
          onChange={event => setLotNumber(event.target.value)}
          required
        />
        <input
          type="date"
          value={roastDate}
          onChange={event => setRoastDate(event.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create batch'}
        </button>
      </form>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
    </main>
  );
}
