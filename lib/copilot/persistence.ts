import { getDb } from '@/lib/db/client'
import { copilotSessions, copilotExchanges, copilotFeedback } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

/**
 * Sales Copilot MVP — Server-Side Persistence Service (Phase 4B)
 *
 * Implements safe, server-only data persistence for sessions, exchanges,
 * advisor feedback, and student outcomes against Neon PostgreSQL.
 *
 * ZERO candidate PII stored. ZERO sales response text stored.
 */

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
 */
export async function createCopilotSession(params: CreateSessionParams = {}) {
  const db = getDb()
  const advisorIdentifier = params.advisorIdentifier?.trim() || 'provisional-advisor'
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
 * Record a completed reasoning exchange linked to an active session.
 */
export async function recordCopilotExchange(params: RecordExchangeParams) {
  const db = getDb()

  if (!params.sessionId) {
    throw new Error('sessionId is required to record a Copilot exchange.')
  }
  if (!params.objectionText) {
    throw new Error('objectionText is required to record a Copilot exchange.')
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
  const db = getDb()

  if (!params.exchangeId) {
    throw new Error('exchangeId is required to record feedback.')
  }

  const validRatings = ['thumbs-up', 'neutral', 'thumbs-down']
  if (!validRatings.includes(params.rating)) {
    throw new Error(`Invalid feedback rating: ${params.rating}`)
  }

  const [feedback] = await db
    .insert(copilotFeedback)
    .values({
      exchangeId: params.exchangeId,
      advisorIdentifier: params.advisorIdentifier || null,
      rating: params.rating,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: copilotFeedback.exchangeId,
      set: {
        rating: params.rating,
        advisorIdentifier: params.advisorIdentifier || sql`copilot_feedback.advisor_identifier`,
        updatedAt: new Date(),
      },
    })
    .returning({ id: copilotFeedback.id, rating: copilotFeedback.rating })

  return feedback
}

/**
 * Record student outcome for a session and mark session completed.
 */
export async function updateCopilotOutcome(params: RecordOutcomeParams) {
  const db = getDb()

  let targetSessionId = params.sessionId

  // If exchangeId provided without sessionId, lookup sessionId from exchange
  if (!targetSessionId && params.exchangeId) {
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
  if (!validOutcomes.includes(params.outcomeStatus)) {
    throw new Error(`Invalid outcomeStatus: ${params.outcomeStatus}`)
  }

  const [updated] = await db
    .update(copilotSessions)
    .set({
      status: 'completed',
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
