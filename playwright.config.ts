import { defineConfig, devices } from "@playwright/test";

const isCI = process.env.CI !== undefined;

export default defineConfig({
  testDir: "tests",
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  ...(isCI ? { workers: 1 } : {}),
  reporter: isCI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:4322/",
    trace: "on-first-retry",
  },
  webServer: {
    command: "corepack pnpm build && corepack pnpm preview --host 127.0.0.1 --port 4322",
    url: "http://127.0.0.1:4322/",
    reuseExistingServer: !isCI,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
