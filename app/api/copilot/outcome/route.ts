import { NextResponse } from 'next/server'
import { updateCopilotOutcome } from '@/lib/copilot/persistence'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, exchangeId, outcome, reason, notes } = body || {}

    if (!sessionId && !exchangeId) {
      return NextResponse.json(
        { error: 'Invalid input. Either sessionId or exchangeId is required.' },
        { status: 400 }
      )
    }

    const validOutcomes = ['enrolled', 'follow-up', 'lost']
    if (!outcome || !validOutcomes.includes(outcome)) {
      return NextResponse.json(
        { error: 'Invalid outcome. Expected "enrolled", "follow-up", or "lost".' },
        { status: 400 }
      )
    }

    if (outcome === 'lost' && reason) {
      const validReasons = ['price', 'trust', 'timing', 'competitor', 'other']
      if (!validReasons.includes(reason)) {
        return NextResponse.json(
          { error: 'Invalid loss reason. Expected "price", "trust", "timing", "competitor", or "other".' },
          { status: 400 }
        )
      }
    }

    try {
      const result = await updateCopilotOutcome({
        sessionId,
        exchangeId,
        outcomeStatus: outcome,
        outcomeReason: reason,
        outcomeNotes: notes,
      })

      return NextResponse.json(result)
    } catch (dbErr) {
      console.error('[API /api/copilot/outcome] Persistence error:', dbErr)
      return NextResponse.json(
        { error: 'Database persistence error while saving outcome.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[API /api/copilot/outcome] Request parsing error:', error)
    return NextResponse.json(
      { error: 'Invalid request JSON payload.' },
      { status: 400 }
    )
  }
}
