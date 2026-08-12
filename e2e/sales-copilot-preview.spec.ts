import { test, expect } from '@playwright/test'

test.describe('Sales Copilot Preview Smoke Suite', () => {

  test.beforeEach(async ({ page }) => {
    const previewUrl = process.env.PLAYWRIGHT_PREVIEW_URL
    const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET

    if (!previewUrl || !bypassSecret) {
      throw new Error(
        '[Preview E2E Configuration Error] PLAYWRIGHT_PREVIEW_URL and VERCEL_AUTOMATION_BYPASS_SECRET must both be configured in environment before running --project=preview.'
      )
    }

    await page.goto('/')
  })

  test('PREVIEW TEST 1: Protected access via Automation Bypass header', async ({ page }) => {
    // Verify page loads without Vercel Deployment Protection auth block
    await expect(page).not.toHaveTitle(/Vercel Authentication|Log In|Sign In/)
    await expect(page.locator('text=SurelyPlaced Knowledge OS')).toBeVisible()
  })

  test('PREVIEW TEST 2: Core persisted journey against protected Preview', async ({ page }) => {
    // Open sheet if needed
    const openSheetButton = page.locator('button:has-text("AI Assistant"), button[aria-label*="AI"]').first()
    if (await openSheetButton.isVisible()) {
      await openSheetButton.click()
    }

    // Set preview test advisor
    const advisorInput = page.locator('input[placeholder*="Yash Mishra"]')
    if (await advisorInput.isVisible()) {
      await advisorInput.fill('phase5b-e2e-preview-core')
      await page.locator('button:has-text("Save")').click()
    }

    // Analyze objection
    const objectionTextarea = page.locator('textarea[placeholder*="I want to think about it"]')
    await objectionTextarea.fill("It's too expensive for my budget.")
    await page.locator('button:has-text("Analyze Objection")').click()
    await expect(page.locator('text=Approved Response')).toBeVisible({ timeout: 20000 })

    // Submit feedback rating
    await page.locator('button[title="Thumbs Up"]').click()

    // Record follow-up outcome
    await page.locator('button:has-text("Follow-up")').click()
    await expect(page.locator('text=Recorded')).toBeVisible({ timeout: 10000 })
  })

  test('PREVIEW TEST 3: Session continuity smoke on protected Preview', async ({ page }) => {
    // Set preview test advisor
    const advisorInput = page.locator('input[placeholder*="Yash Mishra"]')
    if (await advisorInput.isVisible()) {
      await advisorInput.fill('phase5b-e2e-preview-continuity')
      await page.locator('button:has-text("Save")').click()
    }

    // Analyze objection
    const objectionTextarea = page.locator('textarea[placeholder*="I want to think about it"]')
    await objectionTextarea.fill('I want to think about it.')
    await page.locator('button:has-text("Analyze Objection")').click()
    await expect(page.locator('text=Approved Response')).toBeVisible({ timeout: 20000 })

    // Reload page
    await page.reload()

    // Verify advisor name preserved
    await expect(page.locator('text=phase5b-e2e-preview-continuity')).toBeVisible()
  })

})
