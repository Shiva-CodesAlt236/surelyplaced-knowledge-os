import { test, expect, Page } from '@playwright/test'

async function openSalesCopilotDialog(page: Page) {
  // 1. Ensure dashboard is loaded
  await expect(page.locator('text=SurelyPlaced Knowledge OS').first()).toBeVisible({ timeout: 30000 })

  // 2. Check if dialog is already open
  const dialog = page.getByRole('dialog')
  if (await dialog.isVisible()) {
    return dialog
  }

  // 3. Click Ask AI Assistant button normally
  const askButton = page.getByRole('button', { name: 'Ask AI Assistant' }).first()
  await expect(askButton).toBeVisible()
  await expect(askButton).toBeEnabled()
  await askButton.click()

  // 4. Scoped dialog handles all panel controls
  await expect(dialog).toBeVisible({ timeout: 10000 })
  await expect(dialog.getByText('AI Sales Assistant')).toBeVisible({ timeout: 5000 })

  return dialog
}

test.describe('Sales Copilot Local E2E Journeys', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await openSalesCopilotDialog(page)
  })

  test('Journey A: Open Sales Copilot, verify PII warning, enter advisor, analyze objection', async ({ page }) => {
    const dialog = page.getByRole('dialog')

    // Verify Candidate PII Privacy Warning inside dialog
    await expect(dialog.getByText('Do not include candidate names, email addresses, phone numbers')).toBeVisible()

    // Enter Advisor Identity if prompt is shown
    const advisorInput = dialog.locator('input[placeholder*="Yash Mishra"]')
    if (await advisorInput.isVisible()) {
      await advisorInput.fill('phase5b-e2e-local-a')
      await dialog.getByRole('button', { name: 'Save' }).click()
    }

    // Verify Advisor identity text inside dialog
    await expect(dialog.getByText('phase5b-e2e-local-a')).toBeVisible()

    // Enter Objection Text
    const objectionTextarea = dialog.locator('textarea[placeholder*="I want to think about it"]')
    await objectionTextarea.fill("It's too expensive for my budget.")

    // Click Analyze Objection
    await dialog.getByRole('button', { name: 'Analyze Objection' }).click()

    // Verify Response Card Renders inside dialog
    await expect(dialog.getByText('Detected Objection')).toBeVisible({ timeout: 20000 })
    await expect(dialog.getByText('Approved Response')).toBeVisible()
  })

  test('Journey B: Feedback Persistence', async ({ page }) => {
    const dialog = page.getByRole('dialog')

    const advisorInput = dialog.locator('input[placeholder*="Yash Mishra"]')
    if (await advisorInput.isVisible()) {
      await advisorInput.fill('phase5b-e2e-local-b')
      await dialog.getByRole('button', { name: 'Save' }).click()
    }

    const objectionTextarea = dialog.locator('textarea[placeholder*="I want to think about it"]')
    await objectionTextarea.fill("It's too expensive for my budget.")
    await dialog.getByRole('button', { name: 'Analyze Objection' }).click()
    await expect(dialog.getByText('Approved Response')).toBeVisible({ timeout: 20000 })

    const thumbsUpButton = dialog.locator('button[title="Thumbs Up"]')
    await thumbsUpButton.click()

    // Assert successful state transition: thumbs-up button has primary active class
    await expect(thumbsUpButton).toHaveClass(/bg-fd-primary/, { timeout: 10000 })

    // Verify no feedback errors are shown
    await expect(dialog.getByText('Could not save feedback')).not.toBeVisible()
    await expect(dialog.getByText('Feedback unavailable')).not.toBeVisible()
  })

  test('Journey C: Follow-up Outcome Recording', async ({ page }) => {
    const dialog = page.getByRole('dialog')

    const advisorInput = dialog.locator('input[placeholder*="Yash Mishra"]')
    if (await advisorInput.isVisible()) {
      await advisorInput.fill('phase5b-e2e-local-c')
      await dialog.getByRole('button', { name: 'Save' }).click()
    }

    const objectionTextarea = dialog.locator('textarea[placeholder*="I want to think about it"]')
    await objectionTextarea.fill("It's too expensive for my budget.")
    await dialog.getByRole('button', { name: 'Analyze Objection' }).click()
    await expect(dialog.getByText('Approved Response')).toBeVisible({ timeout: 20000 })

    await dialog.getByRole('button', { name: 'Follow-up' }).click()
    await expect(dialog.getByText('Recorded')).toBeVisible({ timeout: 15000 })
  })

  test('Journey D: Completion Outcome Recording', async ({ page }) => {
    const dialog = page.getByRole('dialog')

    const advisorInput = dialog.locator('input[placeholder*="Yash Mishra"]')
    if (await advisorInput.isVisible()) {
      await advisorInput.fill('phase5b-e2e-local-d')
      await dialog.getByRole('button', { name: 'Save' }).click()
    }

    const objectionTextarea = dialog.locator('textarea[placeholder*="I want to think about it"]')
    await objectionTextarea.fill('I want to think about it.')
    await dialog.getByRole('button', { name: 'Analyze Objection' }).click()
    await expect(dialog.getByText('Approved Response')).toBeVisible({ timeout: 20000 })

    await dialog.getByRole('button', { name: 'Enrolled' }).click()
    await expect(dialog.getByText('Approved Response')).not.toBeVisible({ timeout: 15000 })
  })

  test('Journey E: Refresh Session Continuity', async ({ page }) => {
    let dialog = page.getByRole('dialog')

    const advisorInput = dialog.locator('input[placeholder*="Yash Mishra"]')
    if (await advisorInput.isVisible()) {
      await advisorInput.fill('phase5b-e2e-local-e')
      await dialog.getByRole('button', { name: 'Save' }).click()
    }

    const objectionTextarea = dialog.locator('textarea[placeholder*="I want to think about it"]')
    await objectionTextarea.fill('I am already applying myself.')
    await dialog.getByRole('button', { name: 'Analyze Objection' }).click()
    await expect(dialog.getByText('Approved Response')).toBeVisible({ timeout: 20000 })

    // Capture persisted active session ID before reload
    const sessionIdBefore = await page.evaluate(() => sessionStorage.getItem('surelyplaced_copilot_session_id'))
    expect(sessionIdBefore).toBeTruthy()

    await page.reload()
    dialog = await openSalesCopilotDialog(page)

    // Verify advisor identity persisted
    await expect(dialog.getByText('phase5b-e2e-local-e')).toBeVisible()

    // Assert same non-empty session ID before and after reload
    const sessionIdAfter = await page.evaluate(() => sessionStorage.getItem('surelyplaced_copilot_session_id'))
    expect(sessionIdAfter).toBe(sessionIdBefore)

    // Submit second objection to prove restored session remains active and usable
    const secondObjectionTextarea = dialog.locator('textarea[placeholder*="I want to think about it"]')
    await secondObjectionTextarea.fill('Can you explain the placement guarantee?')
    await dialog.getByRole('button', { name: 'Analyze Objection' }).click()
    await expect(dialog.getByText('Approved Response')).toBeVisible({ timeout: 20000 })
  })

  test('Journey F: Start New Conversation Clears State', async ({ page }) => {
    const dialog = page.getByRole('dialog')

    const advisorInput = dialog.locator('input[placeholder*="Yash Mishra"]')
    if (await advisorInput.isVisible()) {
      await advisorInput.fill('phase5b-e2e-local-f')
      await dialog.getByRole('button', { name: 'Save' }).click()
    }

    const objectionTextarea = dialog.locator('textarea[placeholder*="I want to think about it"]')
    await objectionTextarea.fill("It's too expensive for my budget.")
    await dialog.getByRole('button', { name: 'Analyze Objection' }).click()
    await expect(dialog.getByText('Approved Response')).toBeVisible({ timeout: 20000 })

    await dialog.getByRole('button', { name: 'Start New Conversation' }).click()
    await expect(dialog.getByText('Approved Response')).not.toBeVisible()
  })

  test('Journey G: Network/API Analysis Failure Graceful Handling', async ({ page }) => {
    const dialog = page.getByRole('dialog')

    const advisorInput = dialog.locator('input[placeholder*="Yash Mishra"]')
    if (await advisorInput.isVisible()) {
      await advisorInput.fill('phase5b-e2e-local-g')
      await dialog.getByRole('button', { name: 'Save' }).click()
    }

    await page.route('**/api/copilot', (route) => route.abort('failed'))

    const objectionTextarea = dialog.locator('textarea[placeholder*="I want to think about it"]')
    await objectionTextarea.fill("It's too expensive for my budget.")
    await dialog.getByRole('button', { name: 'Analyze Objection' }).click()

    await expect(dialog.getByText('Unable to reach Sales Copilot. Please try again.')).toBeVisible({ timeout: 15000 })
    await expect(dialog.getByText('Approved Response')).not.toBeVisible()
  })

  test('Journey H: Not-Persisted Response Disables Persistence Controls', async ({ page }) => {
    const dialog = page.getByRole('dialog')

    const advisorInput = dialog.locator('input[placeholder*="Yash Mishra"]')
    if (await advisorInput.isVisible()) {
      await advisorInput.fill('phase5b-e2e-local-h')
      await dialog.getByRole('button', { name: 'Save' }).click()
    }

    // Intercept /api/copilot to return valid response with persistenceStatus: "not-persisted"
    await page.route('**/api/copilot', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          objectionId: 'price-objection',
          objectionTitle: 'Pricing / Investment',
          objectionLabel: 'Pricing / Investment',
          confidence: 'high',
          numericConfidence: 0.95,
          matchedScriptId: '/docs/objections/price-objection#roleplay-1',
          recommendedResponse: 'I understand your budget concerns. Let us look at the value delivered.',
          whyItWorks: 'Acknowledges concerns directly.',
          nextQuestion: 'What timeline are you targeting?',
          secondaryObjections: [],
          persistenceStatus: 'not-persisted',
        }),
      })
    })

    // Track whether any POST /api/copilot/feedback request is dispatched
    let feedbackDispatched = false
    page.on('request', (req) => {
      if (req.url().includes('/api/copilot/feedback') && req.method() === 'POST') {
        feedbackDispatched = true
      }
    })

    const objectionTextarea = dialog.locator('textarea[placeholder*="I want to think about it"]')
    await objectionTextarea.fill("It's too expensive for my budget.")
    await dialog.getByRole('button', { name: 'Analyze Objection' }).click()

    // 1. Visible response renders
    await expect(dialog.getByText('Approved Response')).toBeVisible({ timeout: 20000 })

    // 2. Visible "not saved" warning banner appears on card
    await expect(dialog.getByText('Response Not Persisted')).toBeVisible()

    // 3. Feedback thumbs-up button is disabled
    const thumbsUpButton = dialog.locator('button[title*="Feedback unavailable"]').first()
    await expect(thumbsUpButton).toBeDisabled()

    // 4. Outcome buttons (Enrolled, Follow-up, Lost) are disabled
    const enrolledButton = dialog.getByRole('button', { name: 'Enrolled' })
    const followUpButton = dialog.getByRole('button', { name: 'Follow-up' })
    const lostButton = dialog.getByRole('button', { name: 'Lost' })

    await expect(enrolledButton).toBeDisabled()
    await expect(followUpButton).toBeDisabled()
    await expect(lostButton).toBeDisabled()

    // 5. Attempt clicking disabled feedback button and assert no selected state or API call
    await thumbsUpButton.click({ force: true }).catch(() => {})
    await expect(thumbsUpButton).not.toHaveClass(/bg-fd-primary/)
    expect(feedbackDispatched).toBe(false)
  })

})
