/**
 * Sales Copilot MVP — Session Storage & Continuity Utilities (Phase 4B.1)
 *
 * Provides constants and pure helper classification functions for tab-level
 * session continuity and stale session recovery.
 */

export const SESSION_STORAGE_KEY = 'surelyplaced_copilot_session_id'

/**
 * Classify whether an API error response indicates a stale or completed session
 * that should trigger a one-time automatic client-side session reset and retry.
 */
export function isStaleSessionError(status: number, errorMessage?: string): boolean {
  if (status !== 400 || typeof errorMessage !== 'string') {
    return false
  }

  const lower = errorMessage.toLowerCase()
  return (
    lower.includes('completed session') ||
    lower.includes('session not found') ||
    lower.includes('inactive session')
  )
}
