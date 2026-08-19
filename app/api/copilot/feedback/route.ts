import { NextResponse } from 'next/server'
import { recordCopilotFeedback, getCopilotExchangeOwnership, isValidUuid } from '@/lib/copilot/persistence'
import { isLevelCEnabled, isLegacyIdentityModeEnabled } from '@/lib/auth/level-c-flags'
import { resolveAuthorizedAdvisor, accessDenialMessage } from '@/lib/auth/access'
import { isOwnerOrAdmin, type OwnershipActor } from '@/lib/auth/ownership'

export async function POST(request: Request) {
  try {
    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request JSON payload.' },
        { status: 400 }
      )
    }

    // Phase 6A: Advisor Identity Resolution (see app/api/copilot/route.ts for the
    // full three-mode explanation; identical contract applies here).
    let normalizedAdvisor: string | undefined
    // Phase 6A.1: authenticated actor identity/role, used below for the
    // exchange-ownership check. Null in legacy mode by construction.
    let levelCActor: OwnershipActor | null = null
    if (isLevelCEnabled()) {
      const access = await resolveAuthorizedAdvisor()
      if (!access.authorized) {
        const status = access.reason === 'no-session' ? 401 : 403
        return NextResponse.json({ error: accessDenialMessage(access.reason) }, { status })
      }
      normalizedAdvisor = access.advisorIdentifier
      levelCActor = { advisorIdentifier: access.advisorIdentifier, role: access.role }
    } else if (isLegacyIdentityModeEnabled()) {
      normalizedAdvisor = typeof body?.advisorId === 'string' ? body.advisorId : undefined
    } else {
      return NextResponse.json(
        { error: 'Sales Copilot is not currently enabled in this environment.' },
        { status: 503 }
      )
    }

    const { exchangeId, rating } = body || {}

    if (!exchangeId || typeof exchangeId !== 'string' || !isValidUuid(exchangeId)) {
      return NextResponse.json(
        { error: 'Invalid input. exchangeId must be a valid UUID string.' },
        { status: 400 }
      )
    }

    const validRatings = ['thumbs-up', 'neutral', 'thumbs-down']
    if (!rating || typeof rating !== 'string' || !validRatings.includes(rating)) {
      return NextResponse.json(
        { error: 'Invalid rating. Expected "thumbs-up", "neutral", or "thumbs-down".' },
        { status: 400 }
      )
    }

    // Phase 6A.1: object-ownership authorization. OWNER = the advisor who owns
    // the exchange's session (persisted server-side). ACTOR = the authenticated
    // caller resolved above. These are deliberately distinct: normalizedAdvisor
    // (the ACTOR) is still what gets stamped onto the feedback row below as who
    // submitted it — an admin correcting another advisor's feedback is recorded
    // as the admin, not silently reattributed to the original owner. Only
    // applies in Level C mode; legacy mode has no actor model to check against.
    // If the exchange does not exist, deliberately fall through unchanged —
    // recordCopilotFeedback performs its own existence check and the catch
    // block below preserves the exact pre-6A.1 404 response.
    if (levelCActor) {
      let ownership
      try {
        ownership = await getCopilotExchangeOwnership(exchangeId)
      } catch (lookupErr) {
        console.error('[API /api/copilot/feedback] Ownership lookup error:', lookupErr)
        return NextResponse.json(
          { error: 'Database persistence error while saving feedback.' },
          { status: 500 }
        )
      }
      if (ownership.exists && !isOwnerOrAdmin(levelCActor, ownership.advisorIdentifier as string)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    try {
      const feedback = await recordCopilotFeedback({
        exchangeId,
        rating: rating as 'thumbs-up' | 'neutral' | 'thumbs-down',
        advisorIdentifier: normalizedAdvisor,
      })

      return NextResponse.json({ success: true, feedback })
    } catch (dbErr: any) {
      const msg = dbErr?.message || ''
      if (msg.includes('Exchange not found')) {
        return NextResponse.json(
          { error: 'Exchange not found for provided exchangeId.' },
          { status: 404 }
        )
      }

      console.error('[API /api/copilot/feedback] Persistence error:', msg)
      return NextResponse.json(
        { error: 'Database persistence error while saving feedback.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[API /api/copilot/feedback] Internal error:', error)
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    )
  }
}
