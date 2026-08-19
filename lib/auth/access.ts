import { eq } from 'drizzle-orm'
import { auth } from './config'
import { getDb } from '@/lib/db/client'
import { authUsers } from '@/lib/db/schema'

/**
 * Sales Copilot — Level C Advisor Access Resolution (Phase 6A)
 *
 * Server-side-only authorization contract. Client-supplied advisorId/advisorIdentifier
 * values are NEVER consulted here or trusted as identity by any caller of this module.
 *
 * Split into a pure(ish) core (`resolveAdvisorAccessFromSession`) and a production
 * wrapper (`resolveAuthorizedAdvisor`) specifically so authorization branching logic
 * (domain check, provisioning check, levelCEnabled check, role check) can be exercised
 * deterministically in tests against a constructed session object, without needing a
 * real Google OAuth round trip. The wrapper is the only part that touches Auth.js's
 * `auth()` session resolution (which reads request cookies) and is what production
 * code paths call.
 */

export type AdvisorAccessDenialReason =
  | 'no-session'
  | 'domain-not-allowed'
  | 'database-unavailable'
  | 'user-not-provisioned'
  | 'level-c-disabled-for-user'

export type AdvisorRole = 'advisor' | 'admin'

export type AdvisorAccessResult =
  | { authorized: true; advisorIdentifier: string; role: AdvisorRole; userId: string }
  | { authorized: false; reason: AdvisorAccessDenialReason }

export interface MinimalSessionUser {
  email?: string | null
}

export interface MinimalSession {
  user?: MinimalSessionUser | null
}

const ALLOWED_GOOGLE_WORKSPACE_DOMAIN = (process.env.ALLOWED_GOOGLE_WORKSPACE_DOMAIN || '')
  .trim()
  .toLowerCase()

/**
 * Sanitized, advisor-facing message for each denial reason. Never leaks OAuth
 * provider internals, database error text, or infrastructure details.
 */
export function accessDenialMessage(reason: AdvisorAccessDenialReason): string {
  switch (reason) {
    case 'no-session':
      return 'Please sign in with your SurelyPlaced Google Workspace account to use Sales Copilot.'
    case 'domain-not-allowed':
      return 'This account is not authorized to use Sales Copilot.'
    case 'database-unavailable':
      return 'Sales Copilot access could not be verified. Please try again shortly.'
    case 'user-not-provisioned':
      return 'Your account has not yet been enabled for Sales Copilot. Contact your administrator.'
    case 'level-c-disabled-for-user':
      return 'Sales Copilot is not yet enabled for your account. Contact your administrator.'
    default:
      return 'Access denied.'
  }
}

/**
 * Core authorization logic, testable against a constructed session without real OAuth.
 * Order matters: domain check happens before any database access, so a wrong-domain
 * session can be denied even when no database is configured (defense-in-depth; the
 * primary domain enforcement is the Auth.js signIn callback, which prevents a session
 * from ever being created for a disallowed domain in the first place).
 */
export async function resolveAdvisorAccessFromSession(
  session: MinimalSession | null | undefined
): Promise<AdvisorAccessResult> {
  const email = session?.user?.email?.toLowerCase()
  if (!email) {
    return { authorized: false, reason: 'no-session' }
  }

  const domain = email.split('@')[1] || ''
  if (!ALLOWED_GOOGLE_WORKSPACE_DOMAIN || domain !== ALLOWED_GOOGLE_WORKSPACE_DOMAIN) {
    return { authorized: false, reason: 'domain-not-allowed' }
  }

  if (!process.env.DATABASE_URL) {
    // Fail closed: no database means no provisioning/authorization record can be
    // checked, so access cannot be granted.
    return { authorized: false, reason: 'database-unavailable' }
  }

  const db = getDb()
  const [record] = await db
    .select({ id: authUsers.id, role: authUsers.role, levelCEnabled: authUsers.levelCEnabled })
    .from(authUsers)
    .where(eq(authUsers.email, email))
    .limit(1)

  if (!record) {
    return { authorized: false, reason: 'user-not-provisioned' }
  }

  if (!record.levelCEnabled) {
    return { authorized: false, reason: 'level-c-disabled-for-user' }
  }

  if (record.role !== 'advisor' && record.role !== 'admin') {
    return { authorized: false, reason: 'user-not-provisioned' }
  }

  return {
    authorized: true,
    advisorIdentifier: email,
    role: record.role,
    userId: record.id,
  }
}

/**
 * Production entry point: resolves the real Auth.js session from request cookies,
 * then delegates to the testable core above.
 */
export async function resolveAuthorizedAdvisor(): Promise<AdvisorAccessResult> {
  const session = await auth()
  return resolveAdvisorAccessFromSession(session)
}
