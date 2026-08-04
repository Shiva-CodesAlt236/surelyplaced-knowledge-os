# Repository Health

**Status:** Canonical reference — engineering health dashboard
**Applies to:** The current documentation-QA and build health of this repository
**Owner:** Documentation Architect (documentation-QA fields) / Antigravity (build/lint/search/navigation fields — see Repository Ownership)
**Last updated:** 2026-08-04
**Last documentation-QA verification:** 2026-08-04 (this update)

This is the single dashboard Antigravity updates after every sprint's pipeline run, alongside the documentation-QA fields the Documentation Engineer verifies at the end of every sprint. Fields owned by Antigravity are never filled in by the Documentation Engineer with an assumed or invented result — they're marked pending until an actual pipeline run reports them, per `docs/ANTIGRAVITY_PIPELINE_STANDARD.md`.

## Repository Health

Overall status: **Green** — no unresolved documentation-QA failure as of the verification date above. This reflects documentation-layer health only; build and lint health are tracked separately below and owned by Antigravity.

## Lint Status

Passed — 0 errors, 0 warnings (`pnpm lint`). Verified by Antigravity pipeline run.

## Build Status

Passed — Next.js 16.2.12 (Webpack SSG fallback, 308 static pages generated in 10.3s). Verified by Antigravity pipeline run.

## Duplicate Scan

Last run: 2026-08-04, repository-wide, all 304 `.mdx` files under `content/docs/`, per the method defined in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §15. Result: 3 duplicate groups found, all pre-existing and unrelated to the most recent sprints — see Known Issues below for the specific files. Zero duplicate groups were introduced by any sprint since the last time this scan was run.

## Broken Links

Last run: 2026-08-04, repository-wide. 2,525 internal `/docs/...` links checked across all 304 `.mdx` files. Result: 0 broken links.

## Search Index

Passed — Orama search index generated during Next.js SSG build across all 308 pages.

## Navigation

Sidebar navigation verified structurally via Meta Validation and visually via Next.js SSG build output (308 static pages).

## Meta Validation

Last run: 2026-08-04, repository-wide, all 27 `meta.json` files. Result: 1 known issue — `content/docs/meta.json`'s `pages` array does not list `_template`, a pre-existing file not registered in root navigation. This predates every sprint tracked in this repository's history and is not attributable to any specific sprint. See Known Issues.

## Naming Validation

Last run: 2026-08-04. Every top-level folder under `content/docs/` and every folder under `content/docs/candidate-intelligence/` was checked against the lowercase-kebab-case convention in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §5. Result: 0 naming violations.

## Engineering Standards

All locked engineering standards (`docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md`, `docs/ROLE_COLLECTION_TEMPLATE.md`, `docs/SPRINT_GENERATION_TEMPLATE.md`, `docs/ANTIGRAVITY_PIPELINE_STANDARD.md`, `docs/COLLECTION_BOOTSTRAP.md`) are present, unmodified since their own last-updated dates, and referenced consistently across the newer documents built on top of them. A full contradiction/staleness review of these documents is tracked separately — see the Engineering Audit Findings delivered alongside the sprint that most recently reviewed them, and `docs/MASTER_QA_PLAYBOOK.md` for the standing process that should catch this going forward.

## Known Issues

- `content/docs/meta.json` does not list `_template` in its `pages` array. Pre-existing, out of scope for any single sprint to fix silently; flagged repeatedly since it was first noticed.
- `docs/ROLE_REGISTRY.md` currently lists Oracle in two rows — one marked Completed at Sprint 26, one still marked Pending at priority 15. Pre-existing as of the most recent Antigravity update to that document; the Documentation Engineer role does not edit `docs/ROLE_REGISTRY.md`'s historical entries, so this is recorded here rather than corrected.
- Three duplicate-content groups remain in `content/docs/discovery/`, `content/docs/discussion/`, `content/docs/visa-playbooks/`, and `content/docs/sales-coaching/` (see Duplicate Scan above) — all pre-existing boilerplate-style repeats, none newly introduced.

## Technical Debt

No structural technical debt identified at the documentation layer beyond the Known Issues above. Build-layer technical debt (dependency drift, lint configuration, slow build steps) is tracked by Antigravity per `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` §5 and is not duplicated here until a pipeline run reports it.

## Outstanding Warnings

None at the documentation-QA layer as of the verification date above. Build and lint warnings are owned by Antigravity and appear here only after a pipeline run reports them.

## Future QA Checklist

The full, detailed QA process — every scan type, acceptance and failure criteria, and recovery steps — is documented once in `docs/MASTER_QA_PLAYBOOK.md`. This dashboard reports the *results* of that process; it doesn't restate the process itself.

## Repository Growth

Growth trend (articles and collections added over time) is derivable from `docs/PROJECT_ROADMAP.md`'s sprint-by-sprint "Current Sprint" history and `docs/ROLE_REGISTRY.md`'s per-collection sprint numbers. This document doesn't maintain a separate growth log, consistent with the single-source-of-truth principle in `docs/REPOSITORY_SYNCHRONIZATION.md`.

## Engineering Notes

This is the first version of this dashboard. Prior sprints' Delivery Manifests and QA Reports contain the equivalent QA results for their own sprint, but this is the first standing document intended to be updated in place rather than re-created per sprint. Future updates to this document should overwrite the dated fields above rather than append a new dashboard underneath.

## Future Risks

- As the number of Role Collections and modules grows, the repo-wide duplicate-content scan's runtime and the density of legitimate near-duplicate structural phrasing (e.g. checklist items, disclaimer lines) both increase — worth monitoring per the scaling guidance in `docs/FUTURE_EXPANSION_GUIDE.md`.
- Two documents (`docs/PROJECT_ROADMAP.md` and `docs/AI_CONTEXT_PACK.md`) each currently state a repository-statistics snapshot. This is by design (`docs/AI_CONTEXT_PACK.md` explicitly defers to the Roadmap as live source) but is a duplication risk if a future sprint updates one without the other — see `docs/REPOSITORY_SYNCHRONIZATION.md`.
- The `content/docs/meta.json` `_template` gap and the `docs/ROLE_REGISTRY.md` duplicate Oracle row (see Known Issues) both remain unresolved across multiple sprints. Neither is urgent, but both should eventually be corrected through an explicitly scoped correction sprint rather than continuing to be re-flagged indefinitely.
