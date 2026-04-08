import { defineConfig } from '@playwright/test';

const baseURL = process.env.WEB_BASE_URL ?? 'http://127.0.0.1:3000';

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  reporter: [['list']],
});
