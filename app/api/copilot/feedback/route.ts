import { NextResponse } from 'next/server'
import { recordCopilotFeedback, isValidUuid } from '@/lib/copilot/persistence'

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

    const { exchangeId, rating, advisorId } = body || {}

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

    try {
      const feedback = await recordCopilotFeedback({
        exchangeId,
        rating: rating as 'thumbs-up' | 'neutral' | 'thumbs-down',
        advisorIdentifier: typeof advisorId === 'string' ? advisorId : undefined,
      })

      return NextResponse.json({ success: true, feedback })
    } catch (dbErr: any) {
      console.error('[API /api/copilot/feedback] Persistence error:', dbErr?.message || dbErr)
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
