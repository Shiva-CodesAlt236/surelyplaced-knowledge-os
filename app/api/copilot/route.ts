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

    // ---------------------------------------------------------------------
    // Phase 6A: Advisor Identity Resolution
    //
    // Exactly one of three mutually-exclusive-by-construction modes applies:
    //   1. Level C enabled  -> server-derived identity from the authenticated
    //      Auth.js session ONLY. Client-supplied advisorId/advisorIdentifier in
    //      the request body is never read as identity in this mode.
    //   2. Legacy compatibility mode enabled (and Level C is NOT enabled) ->
    //      preserves the exact pre-Phase-6A self-entered/client-supplied
    //      identity behavior. Temporary technical debt; see lib/auth/level-c-flags.ts.
    //   3. Neither flag set -> Copilot is unavailable. This is the fail-closed
    //      default: no silent fallback to spoofable client-supplied identity.
    // ---------------------------------------------------------------------
    let normalizedAdvisor: string
    // Phase 6A.1: the authenticated actor's identity/role, used below to authorize
    // access to an EXISTING sessionId (object-ownership check). Only ever populated
    // in Level C mode — legacy mode has no Auth.js actor model and must never
    // participate in ownership checks (see lib/auth/ownership.ts).
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
      const advisorIdRaw = body?.advisorId || body?.advisorIdentifier
      const advisorValidation = validateAdvisorIdentifier(advisorIdRaw)
      if (!advisorValidation.valid || !advisorValidation.normalized) {
        return NextResponse.json(
          { error: advisorValidation.error || 'Advisor identifier is required.' },
          { status: 400 }
        )
      }
      normalizedAdvisor = advisorValidation.normalized
    } else {
      return NextResponse.json(
        { error: 'Sales Copilot is not currently enabled in this environment.' },
        { status: 503 }
      )
    }

    const objectionText = body?.objectionText || body?.input || ''
    const contextModuleId = body?.contextModuleId
    const previousObjectionId = body?.previousObjectionId
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

        // Phase 6A.1: object-ownership authorization. Only applies in Level C
        // mode (legacy mode has no Auth.js actor model, so levelCActor is null
        // and this branch never runs there). Not-found/inactive responses above
        // are untouched — this only intercepts a session that DOES exist and IS
        // active but belongs to a different advisor than the authenticated actor.
        // A DB error thrown here propagates to the outer catch below, which
        // returns a generic sanitized 500 and never reaches pipeline execution
        // or persistence — i.e. ownership-lookup failure fails closed.
        if (levelCActor && !isOwnerOrAdmin(levelCActor, sessionCheck.session.advisorIdentifier)) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      }
    }

    // 1. Run grounded AI reasoning pipeline
    const pipelineResponse = await runCopilotPipeline(objectionText, {
      contextModuleId,
      previousObjectionId,
    })

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
