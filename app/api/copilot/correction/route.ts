import { NextResponse } from 'next/server'
import { recordCopilotCorrection, getCopilotExchangeOwnership } from '@/lib/copilot/persistence'
import { validateCorrectionInput } from '@/lib/copilot/correction-validation'
import { isLevelCEnabled } from '@/lib/auth/level-c-flags'
import { resolveAuthorizedAdvisor, accessDenialMessage } from '@/lib/auth/access'
import { isOwnerOrAdmin, type OwnershipActor } from '@/lib/auth/ownership'

/**
 * Sales Copilot — Phase 6B Classification Correction Endpoint
 *
 * See lib/db/schema.ts's copilotCorrections doc comment for the append-only
 * data model, and lib/copilot/correction-validation.ts for the pure taxonomy/
 * shape validation this route delegates to before touching the database.
 */
export async function POST(request: Request) {
  try {
    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request JSON payload.' },
        { status: 400 }
      )
    }

    // Phase 6B: correction is a Level-C-only feature. Unlike the other three
    // Copilot routes, it has no legacy-mode fallback — Phase 4B.3's
    // self-entered/client-supplied identity flow never had a correction
    // concept, and inventing one now would mean accepting a client-supplied
    // "advisorIdentifier" as the correction actor, directly contradicting the
    // Phase 6A.1 authorization model this route must reuse, not weaken. If
    // Level C is not enabled, corrections are simply unavailable (503),
    // mirroring the other routes' fail-closed default when no identity mode
    // applies.
    if (!isLevelCEnabled()) {
      return NextResponse.json(
        { error: 'Sales Copilot classification corrections are not available in this environment.' },
        { status: 503 }
      )
    }

    const access = await resolveAuthorizedAdvisor()
    if (!access.authorized) {
      const status = access.reason === 'no-session' ? 401 : 403
      return NextResponse.json({ error: accessDenialMessage(access.reason) }, { status })
    }
    // Phase 6A.1 actor identity/role, used below for the object-ownership
    // check and stamped as the correction's ACTOR (see the ownership block
    // further down for the OWNER-vs-ACTOR distinction).
    const levelCActor: OwnershipActor = {
      advisorIdentifier: access.advisorIdentifier,
      role: access.role,
    }

    const validation = validateCorrectionInput(body)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    const { exchangeId, correctedPrimaryCategoryId, correctedSecondaryCategoryIds, correctionReason } =
      validation.data

    // Phase 6A.1 object-ownership authorization, reused unchanged (not
    // duplicated). OWNER = the advisor who owns the exchange's owning session,
    // resolved server-side via getCopilotExchangeOwnership's join — never from
    // any client-supplied field. ACTOR = levelCActor resolved above, always
    // what gets stamped onto the new correction row below: an admin correcting
    // another advisor's exchange is recorded as the admin, never silently
    // reattributed to the exchange's owner (see lib/db/schema.ts's
    // copilotCorrections doc comment).
    let ownership
    try {
      ownership = await getCopilotExchangeOwnership(exchangeId)
    } catch (lookupErr) {
      console.error('[API /api/copilot/correction] Ownership lookup error:', lookupErr)
      return NextResponse.json(
        { error: 'Database persistence error while saving correction.' },
        { status: 500 }
      )
    }

    if (!ownership.exists) {
      return NextResponse.json(
        { error: 'Exchange not found for provided exchangeId.' },
        { status: 404 }
      )
    }

    if (!isOwnerOrAdmin(levelCActor, ownership.advisorIdentifier as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    try {
      const correction = await recordCopilotCorrection({
        exchangeId,
        correctedPrimaryCategoryId,
        correctedSecondaryCategoryIds,
        correctionReason,
        advisorIdentifier: levelCActor.advisorIdentifier,
      })

      return NextResponse.json({ success: true, correction })
    } catch (dbErr: any) {
      const msg = dbErr?.message || ''
      if (msg.includes('Exchange not found')) {
        return NextResponse.json(
          { error: 'Exchange not found for provided exchangeId.' },
          { status: 404 }
        )
      }

      console.error('[API /api/copilot/correction] Persistence error:', msg)
      return NextResponse.json(
        { error: 'Database persistence error while saving correction.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[API /api/copilot/correction] Internal error:', error)
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    )
  }
}
