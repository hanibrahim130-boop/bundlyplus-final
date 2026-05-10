import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Match the PORT/BASE_PATH the vite config expects. Fall back to 4173 which
// is Vite's default preview port.
const PREVIEW_PORT = Number(process.env.E2E_PORT) || 4173;
const BASE_URL = process.env.E2E_BASE_URL || `http://127.0.0.1:${PREVIEW_PORT}`;
const REUSE_EXISTING = process.env.CI ? false : true;

/**
 * Playwright config for @workspace/bundlyplus.
 *
 * The test target is the *built* SPA served by `vite preview`. We avoid the
 * dev server deliberately — preview mirrors production output (hashed chunks,
 * prerendered per-route HTML) which is what we want to guard in CI.
 *
 * Tests must not depend on live Firestore or Clerk. Firestore hooks degrade
 * to empty state when the network call fails, so we let them fail naturally
 * offline. Clerk renders a "missing publishable key" fallback when
 * VITE_CLERK_PUBLISHABLE_KEY is absent — that path is exercised by the
 * sign-in tests.
 */
export default defineConfig({
  testDir: path.resolve(__dirname, "tests/e2e"),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 2,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: `pnpm run serve --port ${PREVIEW_PORT} --strictPort`,
    cwd: __dirname,
    url: BASE_URL,
    reuseExistingServer: REUSE_EXISTING,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 120_000,
    env: {
      PORT: String(PREVIEW_PORT),
      BASE_PATH: "/",
    },
  },
});
