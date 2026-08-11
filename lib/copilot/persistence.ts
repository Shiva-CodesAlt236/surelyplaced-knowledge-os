import { getDb } from '@/lib/db/client'
import { copilotSessions, copilotExchanges, copilotFeedback } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { validateAdvisorIdentifier } from './advisor'

/**
 * Sales Copilot MVP — Server-Side Persistence Service (Phase 4B.2 Remediation)
 *
 * Implements safe, server-only data persistence for sessions, exchanges,
 * advisor feedback, and student outcomes against Neon PostgreSQL.
 *
 * ZERO candidate PII stored. ZERO sales response text stored.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isValidUuid(id: string): boolean {
  return typeof id === 'string' && UUID_REGEX.test(id)
}

export interface CreateSessionParams {
  advisorIdentifier?: string
  contextModuleId?: string
}

export interface RecordExchangeParams {
  sessionId: string
  objectionText: string
  isRefusal?: boolean
  primaryObjectionId?: string
  secondaryObjectionIds?: string[]
  numericConfidence: number
  confidenceBand: 'high' | 'medium' | 'low'
  matchedScriptId?: string
  selectedLevel?: number
  safetyFallback?: boolean
  isPersonalized?: boolean
}

export interface RecordFeedbackParams {
  exchangeId: string
  rating: 'thumbs-up' | 'neutral' | 'thumbs-down'
  advisorIdentifier?: string
}

export interface RecordOutcomeParams {
  sessionId?: string
  exchangeId?: string
  outcomeStatus: 'enrolled' | 'follow-up' | 'lost'
  outcomeReason?: 'price' | 'trust' | 'timing' | 'competitor' | 'other'
  outcomeNotes?: string
}

/**
 * Create a new active Copilot session.
 * REQUIRES a valid, non-blank self-entered advisor identifier.
 */
export async function createCopilotSession(params: CreateSessionParams = {}) {
  const advisorValidation = validateAdvisorIdentifier(params.advisorIdentifier)
  if (!advisorValidation.valid || !advisorValidation.normalized) {
    throw new Error('Valid advisor identifier is required to create a Copilot session.')
  }

  const db = getDb()
  const advisorIdentifier = advisorValidation.normalized
  const contextModuleId = params.contextModuleId?.trim() || null

  const [session] = await db
    .insert(copilotSessions)
    .values({
      advisorIdentifier,
      contextModuleId,
      status: 'active',
    })
    .returning({ id: copilotSessions.id })

  return session
}

/**
 * Validate that a session exists and is currently active.
 */
export async function getActiveCopilotSession(sessionId: string) {
  if (!isValidUuid(sessionId)) {
    return { valid: false, reason: 'invalid-uuid' } as const
  }

  const db = getDb()
  const [session] = await db
    .select({
      id: copilotSessions.id,
      status: copilotSessions.status,
      advisorIdentifier: copilotSessions.advisorIdentifier,
    })
    .from(copilotSessions)
    .where(eq(copilotSessions.id, sessionId))
    .limit(1)

  if (!session) {
    return { valid: false, reason: 'not-found' } as const
  }

  if (session.status !== 'active') {
    return { valid: false, reason: 'session-completed', session } as const
  }

  return { valid: true, session } as const
}

/**
 * Record a completed reasoning exchange linked to an active session.
 */
export async function recordCopilotExchange(params: RecordExchangeParams) {
  if (!params.sessionId || !isValidUuid(params.sessionId)) {
    throw new Error('Valid sessionId UUID is required to record a Copilot exchange.')
  }
  if (!params.objectionText || !params.objectionText.trim()) {
    throw new Error('objectionText is required to record a Copilot exchange.')
  }

  // Server-side protection: Verify session exists and is active
  const sessionCheck = await getActiveCopilotSession(params.sessionId)
  if (!sessionCheck.valid) {
    if (sessionCheck.reason === 'not-found') {
      throw new Error(`Session not found for ID: ${params.sessionId}`)
    }
    if (sessionCheck.reason === 'session-completed') {
      throw new Error(`Cannot append exchange to a completed session (${params.sessionId}).`)
    }
    throw new Error(`Invalid session ID: ${params.sessionId}`)
  }

  // Validate selectedLevel DB constraint (NULL or 1 or 2)
  if (
    params.selectedLevel !== undefined &&
    params.selectedLevel !== null &&
    params.selectedLevel !== 1 &&
    params.selectedLevel !== 2
  ) {
    throw new Error('selectedLevel must be 1 or 2.')
  }

  const secondaryObjectionIds = Array.isArray(params.secondaryObjectionIds)
    ? params.secondaryObjectionIds
    : []

  const db = getDb()
  const [exchange] = await db
    .insert(copilotExchanges)
    .values({
      sessionId: params.sessionId,
      objectionText: params.objectionText,
      isRefusal: params.isRefusal ?? false,
      primaryObjectionId: params.primaryObjectionId || null,
      secondaryObjectionIds,
      numericConfidence: params.numericConfidence,
      confidenceBand: params.confidenceBand,
      matchedScriptId: params.matchedScriptId || null,
      selectedLevel: params.selectedLevel || null,
      safetyFallback: params.safetyFallback ?? false,
      isPersonalized: params.isPersonalized ?? false,
    })
    .returning({ id: copilotExchanges.id })

  // Update session lastActivityAt
  await db
    .update(copilotSessions)
    .set({ lastActivityAt: new Date() })
    .where(eq(copilotSessions.id, params.sessionId))

  return exchange
}

/**
 * Record or update advisor feedback rating for an exchange.
 * Respects UNIQUE(exchange_id) by using ON CONFLICT DO UPDATE.
 */
export async function recordCopilotFeedback(params: RecordFeedbackParams) {
  if (!params.exchangeId || !isValidUuid(params.exchangeId)) {
    throw new Error('Valid exchangeId UUID is required to record feedback.')
  }

  const validRatings = ['thumbs-up', 'neutral', 'thumbs-down']
  if (!params.rating || !validRatings.includes(params.rating)) {
    throw new Error(`Invalid feedback rating: ${params.rating}`)
  }

  const db = getDb()

  // Verify exchange exists before inserting to avoid raw FK violation 500 error
  const [existingExchange] = await db
    .select({ id: copilotExchanges.id })
    .from(copilotExchanges)
    .where(eq(copilotExchanges.id, params.exchangeId))
    .limit(1)

  if (!existingExchange) {
    throw new Error(`Exchange not found for ID: ${params.exchangeId}`)
  }

  const advisorValidation = validateAdvisorIdentifier(params.advisorIdentifier)
  const normalizedAdvisor = advisorValidation.valid ? advisorValidation.normalized : null

  const [feedback] = await db
    .insert(copilotFeedback)
    .values({
      exchangeId: params.exchangeId,
      advisorIdentifier: normalizedAdvisor,
      rating: params.rating,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: copilotFeedback.exchangeId,
      set: {
        rating: params.rating,
        advisorIdentifier: normalizedAdvisor || sql`copilot_feedback.advisor_identifier`,
        updatedAt: new Date(),
      },
    })
    .returning({ id: copilotFeedback.id, rating: copilotFeedback.rating })

  return feedback
}

/**
 * Record student outcome for a session.
 *
 * Rules:
 * - ACTIVE session + 'follow-up' -> status remains 'active'
 * - ACTIVE session + 'enrolled' / 'lost' -> status set to 'completed'
 * - COMPLETED session + 'enrolled' / 'lost' -> outcome details updated, status remains 'completed'
 * - COMPLETED session + 'follow-up' -> REJECTED (cannot reopen completed session to follow-up)
 */
export async function updateCopilotOutcome(params: RecordOutcomeParams) {
  const db = getDb()
  let targetSessionId = params.sessionId

  if (targetSessionId && !isValidUuid(targetSessionId)) {
    throw new Error(`Invalid sessionId format: ${targetSessionId}`)
  }

  // If exchangeId provided without sessionId, lookup sessionId from exchange
  if (!targetSessionId && params.exchangeId) {
    if (!isValidUuid(params.exchangeId)) {
      throw new Error(`Invalid exchangeId format: ${params.exchangeId}`)
    }
    const exchange = await db
      .select({ sessionId: copilotExchanges.sessionId })
      .from(copilotExchanges)
      .where(eq(copilotExchanges.id, params.exchangeId))
      .limit(1)

    if (exchange.length > 0) {
      targetSessionId = exchange[0].sessionId
    }
  }

  if (!targetSessionId) {
    throw new Error('Valid sessionId or exchangeId is required to record outcome.')
  }

  const validOutcomes = ['enrolled', 'follow-up', 'lost']
  if (!params.outcomeStatus || !validOutcomes.includes(params.outcomeStatus)) {
    throw new Error(`Invalid outcomeStatus: ${params.outcomeStatus}`)
  }

  // Check existing session status
  const [existingSession] = await db
    .select({ id: copilotSessions.id, status: copilotSessions.status })
    .from(copilotSessions)
    .where(eq(copilotSessions.id, targetSessionId))
    .limit(1)

  if (!existingSession) {
    throw new Error(`Session not found for ID: ${targetSessionId}`)
  }

  // Reopening check: Completed sessions cannot be changed back to follow-up
  if (existingSession.status === 'completed' && params.outcomeStatus === 'follow-up') {
    throw new Error('Completed session cannot be changed to follow-up. Start a new conversation instead.')
  }

  // Lifecycle rule:
  // If active and follow-up -> stays active
  // If active and enrolled/lost -> becomes completed
  // If completed and enrolled/lost -> stays completed
  const newStatus =
    existingSession.status === 'completed'
      ? 'completed'
      : params.outcomeStatus === 'follow-up'
      ? 'active'
      : 'completed'

  const [updated] = await db
    .update(copilotSessions)
    .set({
      status: newStatus,
      outcomeStatus: params.outcomeStatus,
      outcomeReason: params.outcomeReason || null,
      outcomeNotes: params.outcomeNotes || null,
      outcomeRecordedAt: new Date(),
      lastActivityAt: new Date(),
    })
    .where(eq(copilotSessions.id, targetSessionId))
    .returning({
      id: copilotSessions.id,
      status: copilotSessions.status,
      outcomeStatus: copilotSessions.outcomeStatus,
      outcomeReason: copilotSessions.outcomeReason,
    })

  return { success: true, session: updated }
}
