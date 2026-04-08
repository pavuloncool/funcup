import { expect, test } from '@playwright/test';

import { provisionVerifiedRoaster } from './supabase-test-helpers';

test('US2 happy path: dashboard -> QR -> hash resolve', async ({ page, request, context }) => {
  const actor = await provisionVerifiedRoaster(request, 'us2-happy-path');

  await page.goto('/login');
  await page.getByPlaceholder('Email').fill(actor.email);
  await page.getByPlaceholder('Password').fill(actor.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('heading', { name: 'Roaster coffees' })).toBeVisible();
  await page.getByRole('link', { name: '+ New coffee' }).click();

  await expect(page.getByRole('heading', { name: 'Create coffee' })).toBeVisible();
  await page.getByPlaceholder('Coffee name').fill('Phase4 E2E Coffee');
  await page.getByRole('button', { name: 'Create coffee' }).click();

  await expect(page.getByRole('heading', { name: 'Coffee details' })).toBeVisible();
  await page.getByRole('link', { name: '+ Create batch' }).click();

  await expect(page.getByRole('heading', { name: 'Create batch' })).toBeVisible();
  await page.getByPlaceholder('Lot number').fill('E2E-LOT-001');
  await page.getByRole('button', { name: 'Create batch' }).click();

  await expect(page.getByRole('heading', { name: 'Batch details' })).toBeVisible();

  const popupPromise = context.waitForEvent('page');
  await page.getByRole('button', { name: 'Download PNG' }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState('domcontentloaded');
  await popup.close();

  await expect(page.getByText(/^Hash:\s+/)).toBeVisible();
  const resolveLine = page.getByText(/^Resolve URL:\s+\/q\//);
  await expect(resolveLine).toBeVisible();

  const resolveText = await resolveLine.textContent();
  const hash = resolveText?.replace('Resolve URL: /q/', '').trim() ?? '';
  expect(hash).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );

  await page.goto(`/q/${hash}`);
  await expect(page.getByRole('heading', { name: 'QR Hash Resolver' })).toBeVisible();
  await expect(page.getByText('Roaster:')).toBeVisible();
  await expect(page.getByText('Coffee:')).toBeVisible();
  await expect(page.getByText('Batch:')).toBeVisible();
  await expect(page.getByText(/Phase4 E2E Coffee/)).toBeVisible();
  await expect(page.getByText(/E2E-LOT-001/)).toBeVisible();
});
