import { test, expect, Page } from '@playwright/test'

async function openSalesCopilotDialog(page: Page) {
  await expect(page.locator('text=SurelyPlaced Knowledge OS').first()).toBeVisible({ timeout: 30000 })

  const dialog = page.getByRole('dialog')
  if (await dialog.isVisible()) {
    return dialog
  }

  const askButton = page.getByRole('button', { name: 'Ask AI Assistant' }).first()
  await expect(askButton).toBeVisible()
  await expect(askButton).toBeEnabled()
  await askButton.click()

  await expect(dialog).toBeVisible({ timeout: 10000 })
  await expect(dialog.getByText('AI Sales Assistant')).toBeVisible({ timeout: 5000 })

  return dialog
}

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
    const dialog = await openSalesCopilotDialog(page)

    // Set preview test advisor
    const advisorInput = dialog.locator('input[placeholder*="Yash Mishra"]')
    if (await advisorInput.isVisible()) {
      await advisorInput.fill('phase5b-e2e-preview-core')
      await dialog.getByRole('button', { name: 'Save' }).click()
    }

    // Analyze objection
    const objectionTextarea = dialog.locator('textarea[placeholder*="I want to think about it"]')
    await objectionTextarea.fill("It's too expensive for my budget.")
    await dialog.getByRole('button', { name: 'Analyze Objection' }).click()
    await expect(dialog.getByText('Approved Response')).toBeVisible({ timeout: 20000 })

    // Submit feedback rating & verify success transition
    const thumbsUpButton = dialog.locator('button[title="Thumbs Up"]')
    await thumbsUpButton.click()
    await expect(thumbsUpButton).toHaveClass(/bg-fd-primary/, { timeout: 10000 })

    // Record follow-up outcome
    await dialog.getByRole('button', { name: 'Follow-up' }).click()
    await expect(dialog.getByText('Recorded')).toBeVisible({ timeout: 10000 })
  })

  test('PREVIEW TEST 3: Session continuity smoke on protected Preview', async ({ page }) => {
    let dialog = await openSalesCopilotDialog(page)

    // Set preview test advisor
    const advisorInput = dialog.locator('input[placeholder*="Yash Mishra"]')
    if (await advisorInput.isVisible()) {
      await advisorInput.fill('phase5b-e2e-preview-continuity')
      await dialog.getByRole('button', { name: 'Save' }).click()
    }

    // Analyze objection
    const objectionTextarea = dialog.locator('textarea[placeholder*="I want to think about it"]')
    await objectionTextarea.fill('I want to think about it.')
    await dialog.getByRole('button', { name: 'Analyze Objection' }).click()
    await expect(dialog.getByText('Approved Response')).toBeVisible({ timeout: 20000 })

    // Capture persisted active session ID before reload
    const sessionIdBefore = await page.evaluate(() => sessionStorage.getItem('surelyplaced_copilot_session_id'))
    expect(sessionIdBefore).toBeTruthy()

    // Reload page
    await page.reload()
    dialog = await openSalesCopilotDialog(page)

    // Verify advisor name preserved
    await expect(dialog.getByText('phase5b-e2e-preview-continuity')).toBeVisible()

    // Assert same non-empty session ID before and after reload
    const sessionIdAfter = await page.evaluate(() => sessionStorage.getItem('surelyplaced_copilot_session_id'))
    expect(sessionIdAfter).toBe(sessionIdBefore)

    // Submit second objection to prove restored session remains active and usable
    const secondObjectionTextarea = dialog.locator('textarea[placeholder*="I want to think about it"]')
    await secondObjectionTextarea.fill('Can you explain the placement guarantee?')
    await dialog.getByRole('button', { name: 'Analyze Objection' }).click()
    await expect(dialog.getByText('Approved Response')).toBeVisible({ timeout: 20000 })
  })

})
