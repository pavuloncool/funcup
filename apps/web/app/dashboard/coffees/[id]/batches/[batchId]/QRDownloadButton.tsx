'use client';

import { useState } from 'react';

import { supabaseBrowser } from '@/src/lib/supabase/browserClient';

type Props = {
  batchId: string;
};

type GenerateQrResponse = {
  created: boolean;
  hash: string;
  qr_url: string;
  svg_signed_url: string | null;
  png_signed_url: string | null;
};

function openDownload(url: string) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.click();
}

export default function QRDownloadButton({ batchId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(null);

  async function generateAndDownload(format: 'png' | 'svg') {
    setLoading(true);
    setError(null);

    const {
      data: { session },
    } = await supabaseBrowser.auth.getSession();

    if (!session?.access_token) {
      setLoading(false);
      setError('You must be logged in.');
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      setLoading(false);
      setError('Missing NEXT_PUBLIC_SUPABASE_URL.');
      return;
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/generate_qr`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ batch_id: batchId }),
    });

    const body = (await response.json()) as GenerateQrResponse & {
      error?: string;
      message?: string;
    };

    setLoading(false);
    if (!response.ok) {
      setError(body.message ?? body.error ?? 'Unable to generate QR.');
      return;
    }

    setHash(body.hash);
    const signedUrl = format === 'png' ? body.png_signed_url : body.svg_signed_url;
    if (!signedUrl) {
      setError(`Missing signed URL for ${format.toUpperCase()}.`);
      return;
    }

    openDownload(signedUrl);
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => void generateAndDownload('png')} disabled={loading}>
          {loading ? 'Generating...' : 'Download PNG'}
        </button>
        <button onClick={() => void generateAndDownload('svg')} disabled={loading}>
          {loading ? 'Generating...' : 'Download SVG'}
        </button>
      </div>
      {hash ? <p>Hash: {hash}</p> : null}
      {hash ? <p>Resolve URL: /q/{hash}</p> : null}
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
    </div>
  );
}
