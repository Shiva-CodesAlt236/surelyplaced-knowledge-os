/**
 * Sales Copilot — Level C Feature Gate & Legacy-Compatibility Flags (Phase 6A)
 *
 * Two independent, mutually-exclusive-by-construction environment gates:
 *
 * - LEVEL_C_ENABLED: turns on the new Auth.js-authenticated, server-derived-identity
 *   Copilot flow. Default OFF (unset/anything other than the literal string 'true').
 * - COPILOT_LEGACY_IDENTITY_MODE: TEMPORARY migration-compatibility flag that keeps the
 *   pre-Phase-6A self-entered/client-supplied advisor identity flow reachable, for
 *   environments not yet migrated to Level C. Default OFF. TECHNICAL DEBT — this exists
 *   only to avoid a hard cutover before Level C auth is configured in every environment
 *   that still needs Copilot to function; it must be removed once every environment has
 *   migrated. It is NEVER checked unless LEVEL_C_ENABLED is off (see the API routes'
 *   if/else-if branching), so it can never be reachable at the same time as Level C mode
 *   regardless of how both flags happen to be set.
 *
 * If NEITHER flag is set, Copilot is unavailable. This is the intentional, fail-closed
 * default after Phase 6A ships: an operator must explicitly opt into one identity mode
 * rather than the system silently continuing to trust spoofable client-supplied identity.
 */

export function isLevelCEnabled(): boolean {
  return process.env.LEVEL_C_ENABLED === 'true'
}

export function isLegacyIdentityModeEnabled(): boolean {
  if (isLevelCEnabled()) return false
  return process.env.COPILOT_LEGACY_IDENTITY_MODE === 'true'
}
