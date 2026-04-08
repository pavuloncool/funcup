'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type ScanResponse = {
  coffee?: { name?: string };
  batch?: { id?: string; lot_number?: string };
  roaster?: { name?: string };
  error?: string;
  message?: string;
};

export default function ResolveHashPage() {
  const params = useParams<{ hash: string }>();
  const [data, setData] = useState<ScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function resolve() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        setError('Missing NEXT_PUBLIC_SUPABASE_URL.');
        return;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/scan_qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash: params.hash }),
      });

      const body = (await response.json()) as ScanResponse;
      if (!response.ok) {
        setError(body.message ?? body.error ?? 'Unable to resolve hash.');
        return;
      }

      setData(body);
    }
    void resolve();
  }, [params.hash]);

  return (
    <main style={{ maxWidth: 760, margin: '30px auto', fontFamily: 'system-ui' }}>
      <h1>QR Hash Resolver</h1>
      <p>
        <strong>Hash:</strong> {params.hash}
      </p>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      {data ? (
        <>
          <p>
            <strong>Roaster:</strong> {data.roaster?.name ?? 'n/a'}
          </p>
          <p>
            <strong>Coffee:</strong> {data.coffee?.name ?? 'n/a'}
          </p>
          <p>
            <strong>Batch:</strong> {data.batch?.lot_number ?? data.batch?.id ?? 'n/a'}
          </p>
        </>
      ) : (
        <p>Resolving...</p>
      )}
    </main>
  );
}
