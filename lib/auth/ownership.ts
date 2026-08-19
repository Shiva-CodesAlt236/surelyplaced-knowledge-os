import type { AdvisorRole } from './access'

/**
 * Sales Copilot — Phase 6A.1 Object-Ownership Authorization
 *
 * Phase 6A established WHO the authenticated actor is (real Auth.js identity,
 * fail-closed access gating). It did not establish whether that actor is allowed
 * to read or mutate a SPECIFIC session/exchange/feedback/outcome record belonging
 * to a different advisor. This module closes that gap with a single, narrow, pure
 * decision function shared by all three Copilot routes — deliberately not
 * duplicated three times.
 *
 * Locked Product Owner authorization policy:
 *   - role = 'advisor': may access/mutate ONLY Copilot records owned by that advisor.
 *   - role = 'admin':   may access/mutate Copilot records owned by any advisor.
 *   - Ownership is ALWAYS the persisted, server-side `advisorIdentifier` recorded on
 *     the session at creation time (via the authenticated session in Level C mode).
 *     Client-supplied advisorId/advisorIdentifier fields, localStorage, query
 *     strings, or any other client-controlled value are NEVER consulted here —
 *     they play no part in this decision, by construction (this function doesn't
 *     even accept them as a parameter).
 *
 * This function is intentionally identical for sessions and exchanges: exchange
 * ownership is always derived from its owning session's advisorIdentifier (see
 * lib/copilot/persistence.ts's getCopilotExchangeOwnership), so one comparison
 * covers both call sites.
 *
 * This module is ONLY reachable from Level C authenticated code paths (routes
 * gate on isLevelCEnabled() before ever calling this). Legacy compatibility mode
 * has no Auth.js actor model and must never call this function.
 */

export interface OwnershipActor {
  advisorIdentifier: string
  role: AdvisorRole
}

export function isOwnerOrAdmin(actor: OwnershipActor, ownerAdvisorIdentifier: string): boolean {
  return actor.advisorIdentifier === ownerAdvisorIdentifier || actor.role === 'admin'
}
