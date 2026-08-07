import { NextResponse } from 'next/server'
import { runCopilotPipeline } from '@/lib/copilot/pipeline'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { input, candidateName } = body || {}

    if (!input || typeof input !== 'string' || !input.trim()) {
      return NextResponse.json(
        { success: false, error: 'Student objection input text is required.' },
        { status: 400 }
      )
    }

    const result = await runCopilotPipeline(input.trim(), { candidateName })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error('Copilot API error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process objection.' },
      { status: 500 }
    )
  }
}
