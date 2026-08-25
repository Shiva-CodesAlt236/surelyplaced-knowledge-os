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
  primaryKey,
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
    // Phase 6B: which classifier engine version produced this exchange's
    // classification. NOT NULL with no ORM-level default — every INSERT (see
    // lib/copilot/persistence.ts's recordCopilotExchange) must explicitly supply
    // this value (CLASSIFIER_VERSION from lib/copilot/classifier-version.ts for
    // new rows). Historical rows predating this column are backfilled by the
    // migration itself with the explicit LEGACY_UNVERSIONED_CLASSIFIER_VERSION
    // sentinel, not silently assumed to be "phase5f.1" (see
    // lib/copilot/classifier-version.ts's doc comment for why that assumption
    // would be factually false).
    classifierVersion: text('classifier_version').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('copilot_exchanges_session_id_idx').on(table.sessionId),
    index('copilot_exchanges_primary_objection_idx').on(table.primaryObjectionId),
    index('copilot_exchanges_created_at_idx').on(table.createdAt),
    index('copilot_exchanges_confidence_band_idx').on(table.confidenceBand),
    index('copilot_exchanges_classifier_version_idx').on(table.classifierVersion),
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

/**
 * Sales Copilot — Correction Audit Trail (Phase 6B)
 *
 * Append-only history, NOT a one-row-per-exchange upsert table: deliberately no
 * UNIQUE constraint on exchangeId. Each submitted correction becomes a new
 * immutable row; the current corrected interpretation of an exchange is
 * whichever correction row has the latest createdAt (see
 * getLatestCopilotCorrection in lib/copilot/persistence.ts). Prior correction
 * rows are never edited or deleted during normal operation, preserving a real
 * audit trail (e.g. if Advisor A's correction is later revised by Admin B, both
 * events remain queryable).
 *
 * This table intentionally does NOT duplicate objectionText or the exchange's
 * original primaryObjectionId/secondaryObjectionIds — those remain the single
 * source of truth on copilot_exchanges (which this table's write path never
 * modifies) and are joined via exchangeId when needed.
 *
 * advisorIdentifier here is always the ACTOR who submitted the correction (may
 * be an admin correcting another advisor's exchange), never silently rewritten
 * to the exchange's owning advisor — the same OWNER-vs-ACTOR distinction Phase
 * 6A.1 already established for copilot_feedback.
 */
export const copilotCorrections = pgTable(
  'copilot_corrections',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    exchangeId: uuid('exchange_id')
      .notNull()
      .references(() => copilotExchanges.id, { onDelete: 'cascade' }),
    correctedPrimaryCategoryId: text('corrected_primary_category_id').notNull(),
    correctedSecondaryCategoryIds: text('corrected_secondary_category_ids')
      .array()
      .default(sql`'{}'::text[]`)
      .notNull(),
    correctionReason: text('correction_reason'),
    advisorIdentifier: text('advisor_identifier').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('copilot_corrections_exchange_id_idx').on(table.exchangeId),
    index('copilot_corrections_created_at_idx').on(table.createdAt),
  ]
)

/**
 * Sales Copilot — Level C Application Authentication Schema (Phase 6A Foundation)
 *
 * Auth.js (NextAuth v5) Drizzle-adapter-compatible tables, defined explicitly here
 * (rather than relying on the adapter's built-in defaults) so that:
 * - table names follow this schema file's existing `snake_case`/domain-prefixed
 *   convention instead of Auth.js's bare `user`/`account`/`session` defaults, and
 * - two Sales-Copilot-specific authorization columns (`role`, `level_c_enabled`)
 *   can live directly on the user record without a separate settings table.
 *
 * PostgreSQL Enums:
 * - copilot_user_role ('advisor', 'admin')
 *
 * Security default: `levelCEnabled` defaults to `false`. Auth.js's Drizzle adapter
 * auto-creates a user row on first successful sign-in (`createUser`) using only the
 * fields it knows about (id/name/email/emailVerified/image); it never sets `role` or
 * `levelCEnabled` explicitly, so every newly-authenticated account is provisioned
 * with zero Sales Copilot access by default and must be explicitly enabled by an
 * operator. This is a schema-level fail-closed guarantee, not application logic that
 * could be bypassed by a code path forgetting to check something.
 */

export const copilotUserRoleEnum = pgEnum('copilot_user_role', ['advisor', 'admin'])

export const authUsers = pgTable('auth_users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: copilotUserRoleEnum('role').default('advisor').notNull(),
  levelCEnabled: boolean('level_c_enabled').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const authAccounts = pgTable(
  'auth_accounts',
  {
    userId: text('userId')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
)

export const authSessions = pgTable('auth_sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const authVerificationTokens = pgTable(
  'auth_verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => [
    primaryKey({ columns: [vt.identifier, vt.token] }),
  ]
)
