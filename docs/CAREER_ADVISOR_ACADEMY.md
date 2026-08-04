# Career Advisor Academy

**Status:** Design proposal — not yet built
**Applies to:** The learning-platform layer proposed to sit on top of the existing Knowledge OS content library
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document is architecture and vision only. Nothing described here has been implemented, and nothing in `content/docs/` has been changed to support it. Every existing module, collection, and engineering standard remains exactly as it was before this document was written — this document describes a proposed layer built *on top of* that content, never a replacement for it.

## Terminology Note

The content corpus under `content/docs/` consistently addresses its `audience` as "Admissions Advisors" (see `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §3). This document and its siblings use "Career Advisor" as the platform-facing label for that same role — the two terms refer to the same person and are not a fork in the underlying content model. "Sales Executive" and "Sales Manager" are platform-layer roles this document introduces for the first time; no `content/docs/` module currently addresses either by name. Reconciling this terminology — whether to rename the content corpus's `audience` field, introduce a second field, or leave the two vocabularies to coexist — is a decision for a future, explicitly scoped sprint, not something this design document resolves unilaterally.

## Purpose

Everything under `content/docs/` today is reference material: an advisor finds an article when they need it, reads it, and applies it. The Career Advisor Academy is a proposed layer on top of that same material that turns it into a structured learning experience — sequencing, progress tracking, practice, and assessment — without duplicating or rewriting a single article. The content stays the single source of truth; the Academy is a way of moving through it with intention.

## Target Users

**Career Advisors** — the front-line role this repository's content has always addressed as "Admissions Advisors." The Academy is primarily built for this user: onboarding through mastery, module by module.

**Sales Executives** — a broader or more senior commercial role, not yet defined by any existing module, who would use the Academy for cross-functional literacy (candidate journey, pricing philosophy, objection patterns) without necessarily running full advisor call workflows day to day. This document does not define this role's scope in detail; a future sprint should do so before content is built specifically for it.

**Sales Managers** — the role responsible for developing and evaluating Career Advisors. A Sales Manager's use of the Academy is oversight- and coaching-oriented: tracking a team's progress, reviewing assessment outcomes, and applying the same materials `content/docs/sales-coaching/` already provides — but from a manager's vantage point rather than an advisor's self-review vantage point, which is what that module currently addresses. See `docs/LEARNING_PATHS.md` for how this distinction plays out in the proposed Sales Manager path.

## Learning Philosophy

The Academy's proposed philosophy extends, rather than replaces, the writing philosophy already stated in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §1: content exists to make advisors more effective and more honest, in that order, and teaches judgment rather than rote process. Translated into a learning philosophy, that suggests:

- Mastery over completion — moving through a path is a means to demonstrated understanding, not an end in itself.
- Judgment over memorization — assessment should test whether a learner can reason through a novel situation, not just recall a fact, consistent with how `content/docs/sales-constitution/` already frames selling as consultative judgment rather than scripted delivery.
- Honesty about uncertainty — a learning platform built on content that already refuses to invent pricing, guarantees, or statistics should carry that same discipline into how it teaches and assesses, never implying a learner's success guarantees a specific sales outcome.

These are proposed design principles, not measured outcomes of a system that doesn't yet exist.

## Knowledge Architecture

The Academy does not introduce a second content tree. `content/docs/` — the Sales Academy modules, the Candidate Intelligence Framework and its Role Collections, and the `*-intelligence` expansion modules (Interview, Resume, LinkedIn, Recruiter, Hiring) — remains the entire knowledge base. The Academy's job is to add structure on top of it:

- **Paths** (`docs/LEARNING_PATHS.md`) sequence existing modules into a journey.
- **Module surfacing** (`docs/MODULE_INDEX_STANDARD.md`) defines what metadata a module should eventually expose so it can participate in a path, in search, and in assessment.
- **Assessment** (`docs/ASSESSMENT_FRAMEWORK.md`) is built from existing content — composite case studies, objection categories, red-flags articles — rather than inventing new fictional scenarios outside what the content standard already permits.

## Learning Flow

A proposed learner journey moves through four stages: discover a path suited to their role and tenure (`docs/LEARNING_PATHS.md`), progress through that path's modules in sequence using the structure `docs/MODULE_INDEX_STANDARD.md` defines, demonstrate understanding at path-defined checkpoints (`docs/ASSESSMENT_FRAMEWORK.md`), and reach a path's completion criteria. None of these stages exist yet; this is the proposed shape, not a built flow.

## Certification Philosophy

Certification, where the Academy eventually offers it, is proposed to reflect demonstrated understanding at a point in time — not effort, not time spent, and never a guarantee of future sales performance or outcome, consistent with the no-guarantee discipline in `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §12. Full mechanics — scoring, retakes, passing thresholds — are proposed in `docs/ASSESSMENT_FRAMEWORK.md` and explicitly marked there as pending approval rather than decided policy.

## Future AI Integration

A grounded AI assistant is proposed as part of this platform layer, fully specified in `docs/AI_ASSISTANT_BLUEPRINT.md`. Its central constraint — inherited directly from this repository's own non-invention discipline — is that it answers only from repository content and says so explicitly when the repository doesn't contain an answer, the same way an article defers to "the latest approved internal process" today.

## Versioning Strategy

Individual articles already carry a `version` field per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §19. This document proposes the same discipline apply one level up: each platform-layer design document (this one and its siblings) carries its own "Last updated" date, and a structural change to a Learning Path, the Module Index Standard, or the Assessment Framework is a deliberate, reviewable revision to that specific document — never a silent edit folded into an unrelated change. Where a future path or module references a specific version of an underlying article, that reference should be treated as a snapshot to revisit, not an assumption that the underlying article is static.

## Related Documents

- `docs/LEARNING_PATHS.md` — the journeys this vision proposes
- `docs/MODULE_INDEX_STANDARD.md` — how a module participates in the Academy
- `docs/ASSESSMENT_FRAMEWORK.md` — how understanding is demonstrated
- `docs/AI_ASSISTANT_BLUEPRINT.md` — the grounded assistant this vision proposes
- `docs/DEPLOYMENT_READINESS_CHECKLIST.md` — what must exist before any of this ships
