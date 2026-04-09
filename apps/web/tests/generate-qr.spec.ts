import { expect, test } from '@playwright/test';

import {
  createCoffeeAndBatch,
  provisionVerifiedRoaster,
  supabaseEnv,
} from './supabase-test-helpers';

type GenerateQrResponse = {
  created: boolean;
  hash: string;
  qr_url: string;
  svg_storage_path: string;
  png_storage_path: string;
  svg_signed_url: string | null;
  png_signed_url: string | null;
  error?: string;
  message?: string;
};

test.describe('generate_qr function', () => {
  test('returns 201 then idempotent 200 for same batch', async ({ request }) => {
    const actor = await provisionVerifiedRoaster(request, 'generate-qr');
    const { batch } = await createCoffeeAndBatch(request, actor, 'generate-qr');
    const { url, anonKey } = supabaseEnv();

    const first = await request.post(`${url}/functions/v1/generate_qr`, {
      headers: {
        Authorization: `Bearer ${actor.accessToken}`,
        apikey: anonKey,
        'Content-Type': 'application/json',
      },
      data: { batch_id: batch.id },
    });
    expect(first.status()).toBe(201);
    const firstBody = (await first.json()) as GenerateQrResponse;
    expect(firstBody.created).toBe(true);
    expect(firstBody.hash).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(firstBody.qr_url).toContain(`/q/${firstBody.hash}`);
    expect(firstBody.png_signed_url).toBeTruthy();
    expect(firstBody.svg_signed_url).toBeTruthy();

    const second = await request.post(`${url}/functions/v1/generate_qr`, {
      headers: {
        Authorization: `Bearer ${actor.accessToken}`,
        apikey: anonKey,
        'Content-Type': 'application/json',
      },
      data: { batch_id: batch.id },
    });
    expect(second.status()).toBe(200);
    const secondBody = (await second.json()) as GenerateQrResponse;
    expect(secondBody.created).toBe(false);
    expect(secondBody.hash).toBe(firstBody.hash);
    expect(secondBody.png_storage_path).toBe(firstBody.png_storage_path);
    expect(secondBody.svg_storage_path).toBe(firstBody.svg_storage_path);
  });

  test('returns 404 for unknown batch_id', async ({ request }) => {
    const actor = await provisionVerifiedRoaster(request, 'generate-qr-404');
    const { url, anonKey } = supabaseEnv();

    const response = await request.post(`${url}/functions/v1/generate_qr`, {
      headers: {
        Authorization: `Bearer ${actor.accessToken}`,
        apikey: anonKey,
        'Content-Type': 'application/json',
      },
      data: { batch_id: '11111111-1111-4111-8111-111111111111' },
    });

    expect(response.status()).toBe(404);
    const body = (await response.json()) as GenerateQrResponse;
    expect(body.error).toBe('not_found');
  });
});
