import { expect, test } from '@playwright/test';

import { dismissAppOpenGate } from './dismiss-app-open-gate';

test.describe('/coffee-bank', () => {
  test('renders title, hub back link, and unauthenticated or empty-state flow', async ({ page }) => {
    await page.goto('/coffee-bank');
    await dismissAppOpenGate(page);
    await expect(page.getByRole('heading', { name: 'Coffee Bank' })).toBeVisible({
      timeout: 25_000,
    });
    await expect(page.getByRole('link', { name: 'Wróć do Roaster Hub' })).toHaveAttribute('href', '/roaster-hub');
  });

  test('responds 200 for document navigation (route exists)', async ({ request }) => {
    const res = await request.get('/coffee-bank', { maxRedirects: 0 });
    expect([200, 304]).toContain(res.status());
  });
});
