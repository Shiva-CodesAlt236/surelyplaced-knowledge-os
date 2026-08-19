import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { getDb } from '@/lib/db/client'
import { authUsers, authAccounts, authSessions, authVerificationTokens } from '@/lib/db/schema'

/**
 * Sales Copilot — Level C Application Authentication Configuration (Phase 6A)
 *
 * Google Workspace OAuth via Auth.js (NextAuth v5). Access is restricted to the
 * SurelyPlaced-controlled Google Workspace domain configured via the
 * ALLOWED_GOOGLE_WORKSPACE_DOMAIN environment variable (Product-Owner-supplied,
 * never hardcoded here). The signIn callback below is a fail-closed gate: if the
 * domain is not configured, or the authenticating account's email domain does not
 * match it exactly, sign-in is denied and the Auth.js adapter never creates a user
 * or account row for that identity.
 *
 * Session strategy is database-backed (via the Drizzle adapter below) whenever
 * DATABASE_URL is configured, matching this repository's existing lazy/conditional
 * DB-access pattern (see lib/db/client.ts, app/api/copilot/route.ts) so importing
 * this module never throws when DATABASE_URL is absent. Without a database, no
 * adapter is attached and Level C access resolution fails closed in
 * lib/auth/access.ts (no provisioning data can exist without persistence).
 */

const ALLOWED_GOOGLE_WORKSPACE_DOMAIN = (process.env.ALLOWED_GOOGLE_WORKSPACE_DOMAIN || '')
  .trim()
  .toLowerCase()

const hasDatabase = Boolean(process.env.DATABASE_URL)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: hasDatabase
    ? DrizzleAdapter(getDb(), {
        usersTable: authUsers,
        accountsTable: authAccounts,
        sessionsTable: authSessions,
        verificationTokensTable: authVerificationTokens,
      })
    : undefined,
  session: {
    strategy: hasDatabase ? 'database' : 'jwt',
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Fail closed: without a configured allowed domain, deny ALL sign-in rather
      // than silently allowing any Google account through (fail-closed, not fail-open).
      if (!ALLOWED_GOOGLE_WORKSPACE_DOMAIN) {
        console.error(
          '[auth] ALLOWED_GOOGLE_WORKSPACE_DOMAIN is not configured; denying sign-in for all accounts.'
        )
        return false
      }

      const email = (user?.email || '').toLowerCase()
      const domain = email.split('@')[1] || ''
      return domain === ALLOWED_GOOGLE_WORKSPACE_DOMAIN
    },
  },
})
