import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

import { dismissAppOpenGate } from './dismiss-app-open-gate';
import { insertRoasterCoffeeTag, provisionVerifiedRoaster } from './supabase-test-helpers';

test('US2 tag happy path: /q/{hash} resolves roaster coffee tag details', async ({
  page,
  request,
}) => {
  const actor = await provisionVerifiedRoaster(request, 'us2-tag-happy-path');
  const tag = await insertRoasterCoffeeTag(request, actor, 'us2-tag-happy-path');
  const hash = tag.public_hash || randomUUID();

  const payload = {
    kind: 'tag',
    tag: {
      id: tag.id,
      public_hash: hash,
      roaster_id: actor.roasterId,
      roaster_short_name: 'KozaPress',
      img_coffee_label: 'https://example.com/label.png',
      bean_origin_country: 'Colombia',
      bean_origin_farm: 'kolumb01',
      bean_origin_tradename: 'kolumb01',
      bean_origin_region: 'kolumb01',
      bean_type: 'arabica',
      bean_varietal_main: 'kolumb01',
      bean_varietal_extra: '',
      bean_origin_height: 1400,
      bean_processing: 'wet-hulled',
      bean_roast_date: '2026-04-22',
      bean_roast_level: 'medium',
      brew_method: 'filter',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    archived: false,
  };

  await page.route('**/functions/v1/scan_qr', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(payload),
    });
  });

  await page.goto(`/q/${hash}`);
  await dismissAppOpenGate(page);

  await expect(page.getByRole('heading', { name: 'Coffee tag' })).toBeVisible({
    timeout: 25_000,
  });
  await expect(page.getByText('KozaPress')).toBeVisible();
  await expect(page.getByText('Trade name: kolumb01')).toBeVisible();
  await expect(page.getByText('Origin: Colombia · kolumb01 · kolumb01')).toBeVisible();
  await expect(page.getByText('Bean: arabica · kolumb01')).toBeVisible();
  await expect(page.getByText('Processing: wet-hulled')).toBeVisible();
  await expect(page.getByText('Roast: 2026-04-22 (medium)')).toBeVisible();
  await expect(page.getByText('Brew: filter')).toBeVisible();
  await expect(page.getByText('Elevation: 1400 m')).toBeVisible();

  const label = page.getByRole('img', { name: 'Coffee label' });
  await expect(label).toBeVisible();
  await expect(label).toHaveAttribute('src', 'https://example.com/label.png');
});
