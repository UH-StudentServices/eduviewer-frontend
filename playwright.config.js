const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 150000,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      animations: 'disabled',
      // Full-page screenshots vary greatly in height, so a fixed pixel limit would be brittle.
      // Using ratio instead keeps tolerance proportional across page sizes.
      // 0.00001 = 0.001% of pixels may differ.
      maxDiffPixelRatio: 0.00001
    }
  },
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',
  projects: [
    {
      name: 'desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 320, height: 568 }
      }
    }
  ],
  webServer: {
    command: 'USE_MOCKS=true npm run dev',
    port: 8080,
    reuseExistingServer: !process.env.CI
  }
});
