import type { Page } from '@playwright/test';

/**
 * Root layout wraps the app in AppOpenGate (AnimatedSplash) until the user taps
 * the fingerprint. Full `page.goto` loads need this before asserting on routes.
 */
export async function dismissAppOpenGate(page: Page) {
  const splash = page.getByRole('button', { name: /Fingerprint funcup/i });
  try {
    await splash.waitFor({ state: 'visible', timeout: 5000 });
  } catch {
    return;
  }
  await splash.click();
}
