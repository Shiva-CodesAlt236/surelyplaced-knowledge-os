import { NextResponse } from 'next/server'
import { runCopilotPipeline } from '@/lib/copilot/pipeline'
import { createCopilotSession, recordCopilotExchange } from '@/lib/copilot/persistence'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const objectionText = body?.objectionText || body?.input || ''
    const advisorId = body?.advisorId || body?.advisorIdentifier
    const contextModuleId = body?.contextModuleId
    let sessionId = body?.sessionId

    if (typeof objectionText !== 'string' || !objectionText.trim()) {
      return NextResponse.json(
        { error: 'Invalid input payload. Expected non-empty objectionText string.' },
        { status: 400 }
      )
    }

    // 1. Run grounded AI reasoning pipeline
    const pipelineResponse = await runCopilotPipeline(objectionText)

    // 2. Attempt runtime persistence if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      try {
        // Create session if not provided
        if (!sessionId) {
          const session = await createCopilotSession({
            advisorIdentifier: advisorId,
            contextModuleId,
          })
          sessionId = session.id
        }

        // Record exchange
        const primaryObjectionId =
          pipelineResponse.primaryObjection?.objectionId || pipelineResponse.objectionId
        const secondaryObjectionIds =
          pipelineResponse.secondaryObjections?.map((s) => s.objectionId) || []

        const exchange = await recordCopilotExchange({
          sessionId,
          objectionText,
          isRefusal: pipelineResponse.isRefusal ?? false,
          primaryObjectionId,
          secondaryObjectionIds,
          numericConfidence: pipelineResponse.numericConfidence,
          confidenceBand: pipelineResponse.confidenceBand,
          matchedScriptId: pipelineResponse.matchedScriptId,
          selectedLevel: pipelineResponse.selectedLevel || 1,
          safetyFallback: pipelineResponse.safetyFallback ?? false,
          isPersonalized: pipelineResponse.isPersonalized ?? false,
        })

        // Return DB UUIDs
        return NextResponse.json({
          ...pipelineResponse,
          exchangeId: exchange.id,
          sessionId,
        })
      } catch (dbErr) {
        console.error('[API /api/copilot] DB Persistence warning (fallback to pipeline result):', dbErr)
        return NextResponse.json({
          ...pipelineResponse,
          sessionId: sessionId || null,
        })
      }
    }

    // Fallback if DATABASE_URL is not set
    return NextResponse.json(pipelineResponse)
  } catch (error) {
    console.error('[API /api/copilot] Pipeline execution error:', error)
    return NextResponse.json(
      { error: 'An internal server error occurred while processing the objection.' },
      { status: 500 }
    )
  }
}
