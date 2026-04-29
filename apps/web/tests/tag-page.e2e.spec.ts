import { expect, test } from '@playwright/test';

import { dismissAppOpenGate } from './dismiss-app-open-gate';

test.describe('/tag roaster coffee tag form', () => {
  test('shows calendar trigger, today button, and file upload', async ({ page }) => {
    await page.goto('/tag');
    await dismissAppOpenGate(page);
    await expect(page.getByRole('heading', { name: 'Dodaj tag kawy' })).toBeVisible({
      timeout: 25_000,
    });
    await expect(page.getByTestId('date-picker-roast-trigger')).toBeVisible();
    await expect(page.getByTestId('btn-roast-date-today')).toBeVisible();
    await expect(page.getByTestId('coffee-label-filepond')).toBeVisible();
    await expect(page.getByTestId('btn-save-coffee-tag')).toBeVisible();
  });
});
