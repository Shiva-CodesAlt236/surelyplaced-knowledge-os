import { NextResponse } from 'next/server'
import { runCopilotPipeline } from '@/lib/copilot/pipeline'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const objectionText = body?.objectionText || body?.input || ''

    if (typeof objectionText !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input payload. Expected objectionText string.' },
        { status: 400 }
      )
    }

    const response = await runCopilotPipeline(objectionText)
    return NextResponse.json(response)
  } catch (error) {
    console.error('[API /api/copilot] Pipeline execution error:', error)
    return NextResponse.json(
      { error: 'An internal server error occurred while processing the objection.' },
      { status: 500 }
    )
  }
}
