import { NextResponse } from 'next/server'
import { updateCopilotOutcome, isValidUuid } from '@/lib/copilot/persistence'
import { isLevelCEnabled, isLegacyIdentityModeEnabled } from '@/lib/auth/level-c-flags'
import { resolveAuthorizedAdvisor, accessDenialMessage } from '@/lib/auth/access'

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

    // Phase 6A: Advisor Identity/Access Gate (see app/api/copilot/route.ts for the
    // full three-mode explanation). The outcome record itself carries no per-call
    // advisor field today (only the session it belongs to does, set at session
    // creation), so this gate is purely an access-control check — it does not
    // change what gets persisted.
    if (isLevelCEnabled()) {
      const access = await resolveAuthorizedAdvisor()
      if (!access.authorized) {
        const status = access.reason === 'no-session' ? 401 : 403
        return NextResponse.json({ error: accessDenialMessage(access.reason) }, { status })
      }
    } else if (!isLegacyIdentityModeEnabled()) {
      return NextResponse.json(
        { error: 'Sales Copilot is not currently enabled in this environment.' },
        { status: 503 }
      )
    }

    const { sessionId, exchangeId, outcome, reason, notes } = body || {}

    if (!sessionId && !exchangeId) {
      return NextResponse.json(
        { error: 'Invalid input. Either sessionId or exchangeId is required.' },
        { status: 400 }
      )
    }

    if (sessionId && (typeof sessionId !== 'string' || !isValidUuid(sessionId))) {
      return NextResponse.json(
        { error: 'Invalid sessionId format. Must be a valid UUID.' },
        { status: 400 }
      )
    }

    if (exchangeId && (typeof exchangeId !== 'string' || !isValidUuid(exchangeId))) {
      return NextResponse.json(
        { error: 'Invalid exchangeId format. Must be a valid UUID.' },
        { status: 400 }
      )
    }

    const validOutcomes = ['enrolled', 'follow-up', 'lost']
    if (!outcome || typeof outcome !== 'string' || !validOutcomes.includes(outcome)) {
      return NextResponse.json(
        { error: 'Invalid outcome. Expected "enrolled", "follow-up", or "lost".' },
        { status: 400 }
      )
    }

    if (outcome === 'lost' && reason) {
      const validReasons = ['price', 'trust', 'timing', 'competitor', 'other']
      if (typeof reason !== 'string' || !validReasons.includes(reason)) {
        return NextResponse.json(
          { error: 'Invalid loss reason. Expected "price", "trust", "timing", "competitor", or "other".' },
          { status: 400 }
        )
      }
    }

    try {
      const result = await updateCopilotOutcome({
        sessionId: typeof sessionId === 'string' ? sessionId : undefined,
        exchangeId: typeof exchangeId === 'string' ? exchangeId : undefined,
        outcomeStatus: outcome as 'enrolled' | 'follow-up' | 'lost',
        outcomeReason: typeof reason === 'string' ? (reason as any) : undefined,
        outcomeNotes: typeof notes === 'string' ? notes : undefined,
      })

      return NextResponse.json(result)
    } catch (dbErr: any) {
      const msg = dbErr?.message || ''
      if (msg.includes('Session not found')) {
        return NextResponse.json(
          { error: 'Session not found for provided identifier.' },
          { status: 404 }
        )
      }

      if (msg.includes('Completed session cannot be changed to follow-up')) {
        return NextResponse.json(
          { error: msg },
          { status: 400 }
        )
      }

      console.error('[API /api/copilot/outcome] Persistence error:', msg)
      return NextResponse.json(
        { error: 'Database persistence error while saving outcome.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[API /api/copilot/outcome] Internal error:', error)
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    )
  }
}
