import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export const STORAGE_STATE = path.join(__dirname, '.auth', 'user.json');

export default defineConfig({
  testDir: './',
  timeout: 60_000,
  retries: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      // Step 1: Session setup (runs once, no auth state yet)
      name: 'setup',
      testMatch: /global-setup\.ts/,
    },
    {
      // Step 2: Real tests, re-use stored session
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
      testMatch: /.*\.spec\.ts/,
    },
  ],
});
