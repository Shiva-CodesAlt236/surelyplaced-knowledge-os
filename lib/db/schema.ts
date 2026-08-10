import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  real,
  jsonb,
  index,
} from 'drizzle-orm/pg-core'

/**
 * Sales Copilot — Database Schema (Phase 4A Foundation)
 *
 * Tables:
 * 1. copilot_sessions
 * 2. copilot_exchanges
 * 3. copilot_feedback
 *
 * Strict Rules:
 * - NO candidate_identifier / candidate PII stored
 * - NO objection_categories or sales_scripts database tables (lib/scripts-registry.ts is single source of truth)
 * - NO full response text persisted (matched_script_id stored only)
 */

export const copilotSessions = pgTable(
  'copilot_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    advisorIdentifier: text('advisor_identifier').notNull(),
    contextModuleId: text('context_module_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    lastActivityAt: timestamp('last_activity_at', { withTimezone: true }).defaultNow().notNull(),
    status: text('status', { enum: ['active', 'completed', 'abandoned'] })
      .default('active')
      .notNull(),
    outcomeStatus: text('outcome_status', { enum: ['enrolled', 'follow-up', 'lost'] }),
    outcomeReason: text('outcome_reason', {
      enum: ['price', 'trust', 'timing', 'competitor', 'other'],
    }),
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
    secondaryObjectionIds: jsonb('secondary_objection_ids').$type<string[]>().default([]).notNull(),
    numericConfidence: real('numeric_confidence').notNull(),
    confidenceBand: text('confidence_band', { enum: ['high', 'medium', 'low'] }).notNull(),
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
    rating: text('rating', { enum: ['thumbs-up', 'neutral', 'thumbs-down'] }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  }
)
