import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local if present
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const LOCAL_PORT = process.env.PORT || '3099'
const LOCAL_BASE_URL = process.env.PLAYWRIGHT_LOCAL_URL || `http://localhost:${LOCAL_PORT}`
const PREVIEW_BASE_URL = process.env.PLAYWRIGHT_PREVIEW_URL || ''
const BYPASS_SECRET = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || ''

export default defineConfig({
  testDir: './e2e',
  timeout: 45000,
  fullyParallel: false, // Run sequentially for session continuity accuracy
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  globalTeardown: path.resolve(process.cwd(), 'e2e/global-teardown.ts'),

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'local',
      testMatch: '**/sales-copilot-local.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: LOCAL_BASE_URL,
      },
    },
    {
      name: 'preview',
      testMatch: '**/sales-copilot-preview.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: PREVIEW_BASE_URL,
        extraHTTPHeaders: {
          'x-vercel-protection-bypass': BYPASS_SECRET,
          'x-vercel-set-bypass-cookie': 'true',
        },
      },
    },
  ],

  webServer: {
    command: `pnpm exec next dev -p ${LOCAL_PORT}`,
    url: LOCAL_BASE_URL,
    reuseExistingServer: true,
    timeout: 120000,
  },
})
