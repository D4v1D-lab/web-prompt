import { defineConfig } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: BASE_URL,
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: BASE_URL.includes('localhost')
    ? {
        command: 'python3 -m http.server 3000',
        url: 'http://localhost:3000/index.html',
        reuseExistingServer: true,
        timeout: 10000,
      }
    : undefined,
});
