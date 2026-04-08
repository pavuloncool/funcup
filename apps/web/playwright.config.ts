import { defineConfig } from '@playwright/test';
// @ts-ignore - module is provided by Next.js runtime dependency
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

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
