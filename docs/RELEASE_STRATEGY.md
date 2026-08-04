# Release Strategy

**Status:** Design proposal — not yet built
**Applies to:** The proposed rollout stages for the Career Advisor Academy, from first internal use through any future external possibility
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document proposes a staged rollout, gated at each stage by the readiness criteria already defined in `docs/DEPLOYMENT_READINESS_CHECKLIST.md` and sequenced against the MVP / Post-MVP / Future tiers `docs/IMPLEMENTATION_BACKLOG.md` already assigns. It states no launch date, no user-count target, and no adoption or revenue figure — every stage below is described by scope and gate, not by a number this document has no basis to assert.

## Internal Alpha

**Scope:** A small group of Career Advisors and at least one Sales Manager, using the MVP tier defined in `docs/IMPLEMENTATION_BACKLOG.md`'s MVP Summary — Dashboard, Module and Lesson pages, basic Search, single-turn grounded Ask AI, Bookmarks, and Knowledge Checks.
**Purpose:** Validate that the core loop (browse or search, read, ask AI, track progress) works end to end against real content, and that the AI Assistant's Unknown-Answer Behaviour (`docs/AI_ASSISTANT_BLUEPRINT.md`) holds up against real, unscripted questions.
**Gate to proceed:** The Content Layer, Search, and AI Assistant Readiness sections of `docs/DEPLOYMENT_READINESS_CHECKLIST.md` are satisfied for MVP scope specifically, not the full checklist.

## Sales Team Beta

**Scope:** A wider group of Career Advisors across the team, still MVP-scoped functionally, with the addition of whatever Post-MVP features Internal Alpha feedback prioritizes moving up (per `docs/IMPLEMENTATION_BACKLOG.md`'s Post-MVP Summary).
**Purpose:** Validate the platform under more realistic day-to-day usage variety, and begin exercising Learning Paths (`docs/LEARNING_PATHS.md`) as an actual onboarding tool for advisors joining during this period, not just Internal Alpha participants.
**Gate to proceed:** Internal Alpha surfaced no unresolved AI grounding failure (an ungrounded or fabricated answer reaching a user), and the UI and Navigation Readiness section of `docs/DEPLOYMENT_READINESS_CHECKLIST.md` is satisfied.

## Manager Beta

**Scope:** Sales Managers gain access to the Manager Dashboard, Team Progress Detail Screen, and the manager variant of Roleplays (`docs/FEATURE_SPECIFICATIONS.md`), layered on top of an already-running Sales Team Beta.
**Purpose:** Validate the oversight and coaching experience specifically, including the Manager Notes sensitivity question `docs/NOTES_SYSTEM.md` flags as needing a resolved policy before that specific feature ships — Manager Beta is the natural point to resolve it, not before.
**Gate to proceed:** The Manager Notes visibility and retention policy question is resolved (per `docs/NOTES_SYSTEM.md`'s Sensitivity note), and Sales Team Beta has run long enough to have real Progress and Completion data for the Manager Dashboard to meaningfully display.

## Production

**Scope:** Full internal availability to all Career Advisors, Sales Managers, Trainers, and Admins, at whatever feature scope the three prior stages have validated — this document does not assume every Post-MVP feature in `docs/IMPLEMENTATION_BACKLOG.md` ships by this point, only that MVP is fully stable and Post-MVP features ship as they individually clear their own readiness bar.
**Purpose:** The platform becomes the default, expected way advisors and managers interact with the Knowledge OS, rather than a beta program a subset of the team opts into.
**Gate to proceed:** The full `docs/DEPLOYMENT_READINESS_CHECKLIST.md` is satisfied, not just the MVP-scoped subset used at earlier stages, including the Engineering and Ownership Readiness and Documentation Readiness sections.

## Future Marketplace

**Scope:** Unscoped and speculative. A possible future direction — extending some version of this platform beyond Surely Placed's own internal use, whether to partner organizations or as a standalone product — that this document does not design, size, or commit to. No business model, pricing, or partner arrangement is proposed here; doing so would require real market and legal input this repository has no basis to invent.
**Purpose:** Named in this document only so a long-range possibility isn't foreclosed by a Production-stage architecture decision that assumes single-tenant, Surely Placed–only use where that assumption isn't actually necessary. This is a design-awareness note, not a commitment or a roadmap item.
**Gate to proceed:** Not applicable — this stage has no defined entry criteria and is not part of the sequence `docs/IMPLEMENTATION_BACKLOG.md` schedules work against. Any future decision to pursue it would begin as its own scoped initiative, with its own vision document, not an extension of this one.

## Related Documents

- `docs/DEPLOYMENT_READINESS_CHECKLIST.md` — the specific gate criteria each stage above references
- `docs/IMPLEMENTATION_BACKLOG.md` — the MVP / Post-MVP / Future tiers this strategy sequences against
- `docs/NOTES_SYSTEM.md` — the Manager Notes policy question Manager Beta is gated on resolving
- `docs/ACADEMY_PRODUCT_VISION.md` — the internal-only vision this strategy's first four stages implement
