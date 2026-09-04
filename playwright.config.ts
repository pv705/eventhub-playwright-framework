import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';

// Load local endpoints before Playwright evaluates the rest of the configuration.
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Fail during startup instead of producing misleading navigation or API errors later.
const requiredEnvironment = ['BASE_URL', 'API_URL'] as const;
for (const name of requiredEnvironment) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

export default defineConfig({
  testDir: './tests',
  // Tests own their data, so files and individual tests can safely run in parallel.
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 2,
  // The shared remote API drops mutation connections under higher aggregate load.
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  outputDir: 'test-results',
  use: {
    baseURL: process.env.BASE_URL,
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    // Retain heavier diagnostic artifacts only when a retry or failure makes them useful.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    testIdAttribute: 'data-testid',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
