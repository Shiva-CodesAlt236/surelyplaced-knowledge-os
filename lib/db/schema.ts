import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  real,
  pgEnum,
  index,
  check,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

/**
 * Sales Copilot — Database Schema (Phase 4A.1 Foundation)
 *
 * PostgreSQL Enums:
 * - copilot_session_status ('active', 'completed', 'abandoned')
 * - copilot_outcome_status ('enrolled', 'follow-up', 'lost')
 * - copilot_outcome_reason ('price', 'trust', 'timing', 'competitor', 'other')
 * - copilot_confidence_band ('high', 'medium', 'low')
 * - copilot_feedback_rating ('thumbs-up', 'neutral', 'thumbs-down')
 *
 * Native Types:
 * - secondary_objection_ids text[] DEFAULT '{}'::text[]
 * - selected_level integer CHECK (selected_level IS NULL OR selected_level IN (1, 2))
 */

export const copilotSessionStatusEnum = pgEnum('copilot_session_status', [
  'active',
  'completed',
  'abandoned',
])

export const copilotOutcomeStatusEnum = pgEnum('copilot_outcome_status', [
  'enrolled',
  'follow-up',
  'lost',
])

export const copilotOutcomeReasonEnum = pgEnum('copilot_outcome_reason', [
  'price',
  'trust',
  'timing',
  'competitor',
  'other',
])

export const copilotConfidenceBandEnum = pgEnum('copilot_confidence_band', [
  'high',
  'medium',
  'low',
])

export const copilotFeedbackRatingEnum = pgEnum('copilot_feedback_rating', [
  'thumbs-up',
  'neutral',
  'thumbs-down',
])

export const copilotSessions = pgTable(
  'copilot_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    advisorIdentifier: text('advisor_identifier').notNull(),
    contextModuleId: text('context_module_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    lastActivityAt: timestamp('last_activity_at', { withTimezone: true }).defaultNow().notNull(),
    status: copilotSessionStatusEnum('status').default('active').notNull(),
    outcomeStatus: copilotOutcomeStatusEnum('outcome_status'),
    outcomeReason: copilotOutcomeReasonEnum('outcome_reason'),
    outcomeNotes: text('outcome_notes'),
    outcomeRecordedAt: timestamp('outcome_recorded_at', { withTimezone: true }),
  },
  (table) => [
    index('copilot_sessions_advisor_idx').on(table.advisorIdentifier),
    index('copilot_sessions_created_at_idx').on(table.createdAt),
    index('copilot_sessions_outcome_status_idx').on(table.outcomeStatus),
  ]
)

export const copilotExchanges = pgTable(
  'copilot_exchanges',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => copilotSessions.id, { onDelete: 'cascade' }),
    objectionText: text('objection_text').notNull(),
    isRefusal: boolean('is_refusal').default(false).notNull(),
    primaryObjectionId: text('primary_objection_id'),
    secondaryObjectionIds: text('secondary_objection_ids')
      .array()
      .default(sql`'{}'::text[]`)
      .notNull(),
    numericConfidence: real('numeric_confidence').notNull(),
    confidenceBand: copilotConfidenceBandEnum('confidence_band').notNull(),
    matchedScriptId: text('matched_script_id'),
    selectedLevel: integer('selected_level'),
    safetyFallback: boolean('safety_fallback').default(false).notNull(),
    isPersonalized: boolean('is_personalized').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('copilot_exchanges_session_id_idx').on(table.sessionId),
    index('copilot_exchanges_primary_objection_idx').on(table.primaryObjectionId),
    index('copilot_exchanges_created_at_idx').on(table.createdAt),
    index('copilot_exchanges_confidence_band_idx').on(table.confidenceBand),
    check('copilot_exchanges_selected_level_check', sql`${table.selectedLevel} IS NULL OR ${table.selectedLevel} IN (1, 2)`),
  ]
)

export const copilotFeedback = pgTable(
  'copilot_feedback',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    exchangeId: uuid('exchange_id')
      .notNull()
      .unique()
      .references(() => copilotExchanges.id, { onDelete: 'cascade' }),
    advisorIdentifier: text('advisor_identifier'),
    rating: copilotFeedbackRatingEnum('rating').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  }
)
