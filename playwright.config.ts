import { defineConfig, devices } from "@playwright/test";

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`;

// Playwright reads runtime environment through the npm scripts, which wrap the command with dotenvx.
export default defineConfig({
  testDir: "./tests",
  /* Timeout for each test in milliseconds. */
  timeout: 300000,
  /* Maximum time in milliseconds the whole test suite can run. */
  globalTimeout: 600000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retries */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use for local review artifacts. */
  reporter: "html",
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace when retrying a failed test. */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "global setup",
      testMatch: /global\.setup\.ts/,
    },

    {
      name: "api-tests",
      testMatch: "tests/api-tests/**/*.spec.ts",
      dependencies: ["global setup"],
    },

    {
      name: "app-tests - chromium",
      testMatch: "tests/app-tests/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["global setup"],
    },

    {
      name: "app-tests - firefox",
      testMatch: "tests/app-tests/**/*.spec.ts",
      use: { ...devices["Desktop Firefox"] },
      dependencies: ["global setup"],
    },

    {
      name: "app-tests - webkit",
      testMatch: "tests/app-tests/**/*.spec.ts",
      use: { ...devices["Desktop Safari"] },
      dependencies: ["global setup"],
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    url: baseURL,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
