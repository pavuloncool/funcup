import { expect, test } from '@playwright/test';

import {
  insertRoasterCoffeeTag,
  provisionVerifiedRoaster,
} from './supabase-test-helpers';

const webBase = () => process.env.WEB_BASE_URL ?? 'http://127.0.0.1:3000';

type ApiQrResponse = {
  svg: string;
  png: string;
  url: string;
  error?: string;
  message?: string;
};

test.describe('POST /api/qr', () => {
  test('returns svg, png, and url for owned tag', async ({ request }) => {
    const actor = await provisionVerifiedRoaster(request, 'api-qr');
    const tag = await insertRoasterCoffeeTag(request, actor, 'api-qr');

    const res = await request.post(`${webBase()}/api/qr`, {
      headers: {
        Authorization: `Bearer ${actor.accessToken}`,
        'Content-Type': 'application/json',
      },
      data: { tagId: tag.id },
    });

    expect(res.status()).toBe(200);
    const body = (await res.json()) as ApiQrResponse;
    expect(body.svg).toContain('<svg');
    expect(body.png.length).toBeGreaterThan(32);
    expect(body.url).toContain(`/q/${tag.public_hash}`);
  });

  test('returns 404 for unknown tagId', async ({ request }) => {
    const actor = await provisionVerifiedRoaster(request, 'api-qr-404');

    const response = await request.post(`${webBase()}/api/qr`, {
      headers: {
        Authorization: `Bearer ${actor.accessToken}`,
        'Content-Type': 'application/json',
      },
      data: { tagId: '11111111-1111-4111-8111-111111111111' },
    });

    expect(response.status()).toBe(404);
    const body = (await response.json()) as ApiQrResponse;
    expect(body.error).toBe('not_found');
  });

  test('returns 403 when tag belongs to another roaster', async ({ request }) => {
    const owner = await provisionVerifiedRoaster(request, 'api-qr-owner');
    const intruder = await provisionVerifiedRoaster(request, 'api-qr-intruder');
    const tag = await insertRoasterCoffeeTag(request, owner, 'api-qr-forbidden');

    const response = await request.post(`${webBase()}/api/qr`, {
      headers: {
        Authorization: `Bearer ${intruder.accessToken}`,
        'Content-Type': 'application/json',
      },
      data: { tagId: tag.id },
    });

    expect(response.status()).toBe(403);
    const body = (await response.json()) as ApiQrResponse;
    expect(body.error).toBe('forbidden');
  });
});
