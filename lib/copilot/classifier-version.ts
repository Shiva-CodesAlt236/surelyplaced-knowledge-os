/**
 * Sales Copilot — Classifier Version Constant (Phase 6B)
 *
 * Deliberately kept in its own file, separate from `lib/copilot/pipeline.ts`,
 * `lib/copilot/objection-categories.ts`, and `lib/copilot/confidence.ts`. Those
 * three files are the classifier's actual scoring/taxonomy/matching engine and
 * must remain provably diff-free across Phase 6B (a reviewer or CI diff check
 * can see "0 changes to pipeline.ts" and know classifier behavior is untouched,
 * without having to manually distinguish a metadata edit from a behavior edit
 * inside that file's diff).
 *
 * This constant represents the frozen CLASSIFIER ENGINE release that produced
 * an exchange's classification — NOT the application/product phase number.
 * Phase 6B does not change classifier scoring or taxonomy behavior in any way,
 * so this value stays "phase5f.1" (the same classifier engine already frozen
 * and documented in docs/SALES_COPILOT_STATUS.md at commit
 * b09c9287f2cc9996fae209a6c01cf7cb41e14877) even though the *application* is
 * now in Phase 6B. Only bump this constant when a future phase actually changes
 * classifier scoring, taxonomy, or matching behavior (e.g. a hypothetical
 * Phase 7 classifier hardening pass) — never for a persistence/auth/UI-only
 * phase like 6A, 6A.1, or 6B.
 *
 * Server-only. Never read from or trusted from client-supplied request data —
 * `app/api/copilot/correction/route.ts` and `lib/copilot/persistence.ts` are the
 * only intended callers, both server-side.
 */
export const CLASSIFIER_VERSION = 'phase5f.1'

/**
 * Sentinel value stamped onto historical `copilot_exchanges` rows created before
 * this column existed. Phase 6B's migration cannot safely claim every historical
 * exchange was produced by the "phase5f.1" classifier engine — the taxonomy and
 * scoring logic materially changed across Phase 5C, 5D, 5E, 5F, and 5F.1, and
 * rows were written to the non-production database throughout that evolution
 * (see docs/SALES_COPILOT_STATUS.md's Phase 5B/5C/5D/5E/5F/5F.1 sections). Rather
 * than fabricating a uniform version for rows whose real originating classifier
 * version was never recorded, historical rows are explicitly and honestly marked
 * with this neutral sentinel instead of silently defaulting to the current value.
 */
export const LEGACY_UNVERSIONED_CLASSIFIER_VERSION = 'legacy-unversioned'
