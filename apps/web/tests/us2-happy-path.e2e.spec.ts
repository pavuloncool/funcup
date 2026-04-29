import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

import { dismissAppOpenGate } from './dismiss-app-open-gate';
import {
  createCoffeeAndBatch,
  insertQrCodeForBatch,
  provisionVerifiedRoaster,
} from './supabase-test-helpers';

test('US2 happy path: seeded batch -> /q/{hash} resolves coffee and batch', async ({
  page,
  request,
}) => {
  const actor = await provisionVerifiedRoaster(request, 'us2-happy-path');
  const { coffee, batch } = await createCoffeeAndBatch(request, actor, 'us2-happy-path');
  const hash = randomUUID();
  await insertQrCodeForBatch(request, batch.id, hash, 'us2-happy-path');

  /** Local `scan_qr` Edge often returns 503 until the functions stack can reach PostgREST. */
  const scanPayload = {
    kind: 'batch',
    batch: {
      id: batch.id,
      roast_date: '2026-04-08',
      lot_number: batch.lot_number,
      status: 'active',
      brewing_notes: null,
      roaster_story: null,
    },
    coffee: {
      id: coffee.id,
      name: coffee.name,
      variety: null,
      processing_method: null,
      producer_notes: null,
      cover_image_url: null,
      status: 'active',
    },
    origin: null,
    roaster: {
      id: actor.roasterId,
      name: actor.roasterName,
      city: null,
      country: null,
      logo_url: null,
    },
    stats: {
      total_count: 0,
      avg_rating: 0,
      rating_distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
      top_flavor_notes: [],
    },
    archived: false,
  };

  await page.route('**/functions/v1/scan_qr', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(scanPayload),
    });
  });

  await page.goto(`/q/${hash}`);
  await dismissAppOpenGate(page);
  await expect(page.getByRole('heading', { name: 'QR Hash Resolver' })).toBeVisible({
    timeout: 25_000,
  });
  await expect(page.getByText('Roaster:')).toBeVisible();
  await expect(page.getByText('Coffee:')).toBeVisible();
  await expect(page.getByText('Batch:')).toBeVisible();
  await expect(page.getByText(coffee.name)).toBeVisible();
  await expect(page.getByText(batch.lot_number)).toBeVisible();
});
