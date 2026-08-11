import { NextResponse } from 'next/server'
import { runCopilotPipeline } from '@/lib/copilot/pipeline'
import {
  createCopilotSession,
  recordCopilotExchange,
  getActiveCopilotSession,
  isValidUuid,
} from '@/lib/copilot/persistence'
import { validateAdvisorIdentifier } from '@/lib/copilot/advisor'
import { MAX_OBJECTION_TEXT_LENGTH } from '@/lib/copilot/limits'

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

    const objectionText = body?.objectionText || body?.input || ''
    const advisorIdRaw = body?.advisorId || body?.advisorIdentifier
    const contextModuleId = body?.contextModuleId
    let sessionId = body?.sessionId

    if (typeof objectionText !== 'string' || !objectionText.trim()) {
      return NextResponse.json(
        { error: 'Invalid input payload. Expected non-empty objectionText string.' },
        { status: 400 }
      )
    }

    if (objectionText.length > MAX_OBJECTION_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Objection text must be ${MAX_OBJECTION_TEXT_LENGTH} characters or fewer.` },
        { status: 400 }
      )
    }

    // Require and validate self-entered advisor identifier
    const advisorValidation = validateAdvisorIdentifier(advisorIdRaw)
    if (!advisorValidation.valid || !advisorValidation.normalized) {
      return NextResponse.json(
        { error: advisorValidation.error || 'Advisor identifier is required.' },
        { status: 400 }
      )
    }
    const normalizedAdvisor = advisorValidation.normalized

    // Server-side validation of client-supplied sessionId
    if (sessionId) {
      if (typeof sessionId !== 'string' || !isValidUuid(sessionId)) {
        return NextResponse.json(
          { error: 'Invalid sessionId format. Must be a valid UUID.' },
          { status: 400 }
        )
      }

      // Check if session exists and is active in DB
      if (process.env.DATABASE_URL) {
        const sessionCheck = await getActiveCopilotSession(sessionId)
        if (!sessionCheck.valid) {
          if (sessionCheck.reason === 'session-completed') {
            return NextResponse.json(
              { error: 'Cannot append exchange to a completed session. Please start a new session.' },
              { status: 400 }
            )
          }
          if (sessionCheck.reason === 'not-found') {
            return NextResponse.json(
              { error: 'Session not found for provided sessionId.' },
              { status: 400 }
            )
          }
          return NextResponse.json(
            { error: 'Invalid or inactive session.' },
            { status: 400 }
          )
        }
      }
    }

    // 1. Run grounded AI reasoning pipeline
    const pipelineResponse = await runCopilotPipeline(objectionText)

    // 2. Attempt runtime persistence if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      try {
        // Create session if not provided
        if (!sessionId) {
          const session = await createCopilotSession({
            advisorIdentifier: normalizedAdvisor,
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

        // Return DB UUIDs and explicit persistenceStatus = 'persisted'
        return NextResponse.json({
          ...pipelineResponse,
          exchangeId: exchange.id,
          sessionId,
          persistenceStatus: 'persisted',
        })
      } catch (dbErr) {
        console.error('[API /api/copilot] DB Persistence warning (falling back to unpersisted output):', dbErr)
        return NextResponse.json({
          ...pipelineResponse,
          sessionId: null, // Do NOT return unpersisted session ID as DB UUID
          persistenceStatus: 'not-persisted',
        })
      }
    }

    // Fallback if DATABASE_URL is not configured
    return NextResponse.json({
      ...pipelineResponse,
      sessionId: null,
      persistenceStatus: 'not-persisted',
    })
  } catch (error) {
    console.error('[API /api/copilot] Pipeline execution error:', error)
    return NextResponse.json(
      { error: 'An internal server error occurred while processing the objection.' },
      { status: 500 }
    )
  }
}
