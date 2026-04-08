import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import QRCode from 'https://esm.sh/qrcode@1.5.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function decodeDataUrl(dataUrl: string): Uint8Array {
  const [, base64] = dataUrl.split(',');
  const bytes = atob(base64);
  return Uint8Array.from(bytes, char => char.charCodeAt(0));
}

serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      return jsonResponse(
        { error: 'server_error', message: 'Supabase env is not configured.' },
        500
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return jsonResponse(
        { error: 'unauthorized', message: 'Valid session required.' },
        401
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return jsonResponse(
        { error: 'unauthorized', message: 'Valid session required.' },
        401
      );
    }

    const { batch_id } = await req.json();

    if (!batch_id || typeof batch_id !== 'string' || !isValidUUID(batch_id)) {
      return jsonResponse(
        { error: 'bad_request', message: 'Valid batch_id (UUID) is required.' },
        400
      );
    }

    const { data: batch, error: batchError } = await supabase
      .from('roast_batches')
      .select(
        `
        id,
        coffees!inner (
          id,
          roasters!inner (
            id,
            user_id,
            verification_status
          )
        )
      `
      )
      .eq('id', batch_id)
      .single();

    if (batchError || !batch) {
      return jsonResponse(
        { error: 'not_found', message: 'Batch not found.' },
        404
      );
    }

    const roaster = batch.coffees.roasters;
    if (roaster.user_id !== user.id) {
      return jsonResponse(
        { error: 'forbidden', message: 'You do not own this batch.' },
        403
      );
    }

    if (roaster.verification_status !== 'verified') {
      return jsonResponse(
        {
          error: 'forbidden',
          message: 'Roaster must be verified to generate QR codes.',
        },
        403
      );
    }

    const { data: existingQr } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('batch_id', batch_id)
      .maybeSingle();

    if (existingQr) {
      const [{ data: svgSigned }, { data: pngSigned }] = await Promise.all([
        supabase.storage
          .from('qr')
          .createSignedUrl(existingQr.svg_storage_path, 3600),
        supabase.storage
          .from('qr')
          .createSignedUrl(existingQr.png_storage_path, 3600),
      ]);

      return jsonResponse({
        created: false,
        hash: existingQr.hash,
        qr_url: existingQr.qr_url,
        svg_storage_path: existingQr.svg_storage_path,
        png_storage_path: existingQr.png_storage_path,
        svg_signed_url: svgSigned?.signedUrl ?? null,
        png_signed_url: pngSigned?.signedUrl ?? null,
      });
    }

    const hash = crypto.randomUUID();
    const qrUrl = `https://funcup.app/q/${hash}`;
    const storagePrefix = `roasters/${roaster.id}/batches/${batch_id}`;
    const svgStoragePath = `${storagePrefix}/qr.svg`;
    const pngStoragePath = `${storagePrefix}/qr.png`;

    const [svg, pngDataUrl] = await Promise.all([
      QRCode.toString(qrUrl, {
        type: 'svg',
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 1024,
      }),
      QRCode.toDataURL(qrUrl, {
        type: 'image/png',
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 1024,
      }),
    ]);

    const pngBytes = decodeDataUrl(pngDataUrl);

    const [{ error: svgUploadError }, { error: pngUploadError }] =
      await Promise.all([
        supabase.storage.from('qr').upload(svgStoragePath, svg, {
          contentType: 'image/svg+xml',
          upsert: true,
        }),
        supabase.storage.from('qr').upload(pngStoragePath, pngBytes, {
          contentType: 'image/png',
          upsert: true,
        }),
      ]);

    if (svgUploadError || pngUploadError) {
      return jsonResponse(
        {
          error: 'storage_upload_failed',
          message: svgUploadError?.message ?? pngUploadError?.message,
        },
        500
      );
    }

    const { error: insertError } = await supabase.from('qr_codes').insert({
      batch_id,
      hash,
      qr_url: qrUrl,
      svg_storage_path: svgStoragePath,
      png_storage_path: pngStoragePath,
    });

    if (insertError) {
      return jsonResponse(
        { error: 'insert_failed', message: insertError.message },
        500
      );
    }

    const [{ data: svgSigned }, { data: pngSigned }] = await Promise.all([
      supabase.storage.from('qr').createSignedUrl(svgStoragePath, 3600),
      supabase.storage.from('qr').createSignedUrl(pngStoragePath, 3600),
    ]);

    return jsonResponse(
      {
        created: true,
        hash,
        qr_url: qrUrl,
        svg_storage_path: svgStoragePath,
        png_storage_path: pngStoragePath,
        svg_signed_url: svgSigned?.signedUrl ?? null,
        png_signed_url: pngSigned?.signedUrl ?? null,
      },
      201
    );
  } catch (error) {
    return jsonResponse(
      {
        error: 'server_error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});
