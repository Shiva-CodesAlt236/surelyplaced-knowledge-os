# Collection Bootstrap

**Status:** Canonical reference — permanent bootstrap specification
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

## Purpose

This is the permanent bootstrap specification for every future Role Collection. It consolidates the invariant, collection-level rules already defined across [Knowledge OS Documentation Standard](/docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md), [Role Collection Template](/docs/ROLE_COLLECTION_TEMPLATE.md), [Sprint Generation Template](/docs/SPRINT_GENERATION_TEMPLATE.md), and [Antigravity Pipeline Standard](/docs/ANTIGRAVITY_PIPELINE_STANDARD.md) into one reference point. It does not replace or duplicate any of those documents — it points to them. Where this document and a source document appear to conflict, the source document governs and the discrepancy should be flagged rather than resolved silently.

Any future sprint instruction may simply say "Generate according to COLLECTION_BOOTSTRAP.md" instead of repeating the full engineering instructions each time.

## Naming Conventions

- Role Collection folders: lowercase, kebab-case, named after the role family (never a tool, employer, or certification). Full convention and canonical examples in [Role Registry](/docs/ROLE_REGISTRY.md#naming-convention).
- Article filenames within a collection: lowercase kebab-case matching the article's `slug` frontmatter field.
- A folder or file name that doesn't follow this pattern is a naming defect, corrected only via a rename-only correction sprint — never by regenerating content.

## Folder Conventions

- All Role Collections live under `content/docs/candidate-intelligence/<collection-name>/`.
- Every collection folder carries its own `meta.json`, and the collection is registered in the parent `content/docs/candidate-intelligence/meta.json`.
- `docs/` (engineering standards) is never part of the rendered site content tree; `content/docs/` is.

## Required 14-File Structure

Every Role Collection contains exactly 14 `.mdx` articles plus `meta.json`, per [Role Collection Template](/docs/ROLE_COLLECTION_TEMPLATE.md):

1. Overview
2–5. Four working-pattern / specialization articles spanning the role family's spectrum
6. Technology ecosystem
7. Candidate behaviour
8. Buying patterns
9. Discovery guide
10. Presentation guide
11. Objection guide
12. Closing guide
13. Advisor coaching
14. Role checklist

Every narrative article uses the same seven sections, in order: Purpose, Scope, Core Content, Cross-Module Alignment, Advisor Guidance, Related Articles, Key Takeaways.

## Required Frontmatter

Every article carries the full frontmatter schema defined in [Knowledge OS Documentation Standard](/docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md): `title`, `description`, `slug`, `type`, `category`, `audience`, `funnel_stage`, `countries`, `version`, `last_updated`, `owner`, `status`, `tags`, `related`. No article ships without a complete, accurate set of these fields.

## Internal Linking Rules

- Every article links forward and backward within its own collection's sequence (Related Articles section) and to at least one equivalent article in a prior collection where a genuine structural parallel exists.
- Advisor-stage guides (discovery through closing) link to the corresponding core sales-stage module they apply (Discovery, Discussion, Objections, Closing).
- No internal link may point to a file that doesn't exist at the time of writing.

## Disclaimer Rules

- Technology ecosystem articles carry an explicit "illustrative only, never compared or ranked" disclaimer, both in a callout and restated in Advisor Guidance.
- Any collection touching a regulated, licensed, or compliance-sensitive domain (e.g. Healthcare) states no regulatory, licensure, or clinical fact directly — such questions are always routed to an appropriate expert or "the latest approved internal process."
- Where the repository has no authoritative answer, articles defer explicitly rather than inventing one.

## Duplicate-Content Policy

- No 10+-word sentence may appear verbatim in more than one file, excluding standardized boilerplate patterns already established (e.g. "Operational Policy Pending," "Illustrative Only," "latest approved internal process").
- Every collection must use phrasing written independently for that collection — not templated too literally from a prior collection or from a sibling collection in the same batch. Close structural mirroring of a prior collection's exact sentence construction is the most common cause of duplicate-content violations and should be avoided from the first draft, not fixed after the fact.
- Each collection's candidate-behaviour and buying-patterns articles anchor to a differentiating sales-intelligence theme genuinely distinct from every previously completed collection.

## QA Sequence

Per [Sprint Generation Template](/docs/SPRINT_GENERATION_TEMPLATE.md), run in order: frontmatter completeness, required-section completeness, internal links (repo-wide), meta.json registration (repo-wide), duplicate-content scan, AI-filler scan, invented-content scan (pricing, stats, salaries, guarantees, employers, candidates), and any sprint- or batch-specific constraint checks. Deliver results as a QA Report with an explicit pass/fail per step.

## Never-Allowed Content

No article, in any collection, ever states or implies: pricing or discounts, guarantees or promised outcomes, hiring or placement statistics, salary figures, employer-specific policy, invented certifications or requirements, or any fake candidate, employer, or project. No technology-ecosystem article compares, ranks, or recommends one named product over another.

## Batch Generation Rules

- Multiple collections may be generated in a single batch when explicitly instructed. Generate all collections in the batch first, writing each one's phrasing independently, before running any QA.
- A batch does not modify, revisit, or regenerate any previously completed collection.
- Batch-specific constraints stated in the sprint instruction (e.g. platform-neutrality rules) apply in addition to, never in place of, the standing rules in this document.

## Batch QA Rules

- Run the QA Sequence once per batch, not once per collection.
- Scope the duplicate-content scan to: the current batch, structurally equivalent articles across all prior collections, and any collection explicitly referenced by the new ones. A full repository re-scan remains acceptable as a superset of this scope and is the safer default when in doubt.
- Produce one consolidated Delivery Manifest and one consolidated QA Report covering the entire batch.

## Antigravity Ownership Boundaries

- The Documentation Engineer role never performs Git operations (add, commit, push) — these belong to the Antigravity pipeline, documented in [Antigravity Pipeline Standard](/docs/ANTIGRAVITY_PIPELINE_STANDARD.md).
- In [Role Registry](/docs/ROLE_REGISTRY.md), only Antigravity sets **Status** to Completed, populates **Completion %** above 0%, or records a **Git Commit** hash. The Documentation Engineer may add rows, update Dependencies/Priority/Owner, and update the Naming Convention section.
- [Project Roadmap](/docs/PROJECT_ROADMAP.md) statistics and integration fields are kept in sync by Antigravity between sprints; the Documentation Engineer does not revert these updates.

## Repository Ownership Rules

- `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md`, `docs/ROLE_COLLECTION_TEMPLATE.md`, `docs/SPRINT_GENERATION_TEMPLATE.md`, `docs/ANTIGRAVITY_PIPELINE_STANDARD.md`, and this document are locked engineering standards — content sprints reference them but never edit them.
- `docs/ROLE_REGISTRY.md` and `docs/PROJECT_ROADMAP.md` are living documents updated at the end of each sprint or batch, within the field boundaries defined above.
- A sprint or batch touches only the files its own scope requires: the new collection's own articles and meta.json, the parent `candidate-intelligence/meta.json`, and the two living registry/roadmap documents.

## Future Scalability Guidance

- This document is written to remain valid regardless of how many future collections are added, how many are batched together, or what domain (technical role, platform ecosystem, or otherwise) they cover.
- Where a future collection type introduces a genuinely new category of constraint (e.g. platform-neutrality, regulatory caution), that constraint is stated in the sprint instruction itself and treated as additive to this document, not a reason to rewrite it.
- If a future need requires changing an invariant rule in this document, that is a deliberate revision to COLLECTION_BOOTSTRAP.md itself, not a one-off exception buried in a single sprint's output.

---

Generate according to COLLECTION_BOOTSTRAP.md.
