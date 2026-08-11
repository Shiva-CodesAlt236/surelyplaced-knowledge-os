import { NextResponse } from 'next/server'
import { recordCopilotFeedback } from '@/lib/copilot/persistence'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { exchangeId, rating, advisorId } = body || {}

    if (!exchangeId || typeof exchangeId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. exchangeId string is required.' },
        { status: 400 }
      )
    }

    const validRatings = ['thumbs-up', 'neutral', 'thumbs-down']
    if (!rating || !validRatings.includes(rating)) {
      return NextResponse.json(
        { error: 'Invalid rating. Expected "thumbs-up", "neutral", or "thumbs-down".' },
        { status: 400 }
      )
    }

    try {
      const feedback = await recordCopilotFeedback({
        exchangeId,
        rating,
        advisorIdentifier: advisorId,
      })

      return NextResponse.json({ success: true, feedback })
    } catch (dbErr) {
      console.error('[API /api/copilot/feedback] Persistence error:', dbErr)
      return NextResponse.json(
        { error: 'Database persistence error while saving feedback.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[API /api/copilot/feedback] Request parsing error:', error)
    return NextResponse.json(
      { error: 'Invalid request JSON payload.' },
      { status: 400 }
    )
  }
}
