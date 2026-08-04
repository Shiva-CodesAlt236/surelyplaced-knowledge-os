# Deployment Readiness Checklist

**Status:** Design proposal — not yet built; this is a pre-deployment gate, not a status report
**Applies to:** Everything that must exist before the Career Advisor Academy platform layer reaches public or internal deployment
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document is a checklist, not a status report — every item below is currently unchecked, since no part of the Academy platform layer has been implemented. It exists so a future implementation phase has a single, explicit gate to satisfy before deployment, referencing rather than duplicating the design already specified across this document's sibling files and the repository's existing engineering standards.

## Content Layer Readiness

- [ ] Every module referenced by any Learning Path in `docs/LEARNING_PATHS.md` still exists, at the file paths that document names — reverify directly against the live repository rather than trusting this document's descriptions, which can go stale as the repository grows.
- [ ] `docs/MODULE_INDEX_STANDARD.md`'s proposed new fields (Learning Objectives, Reading Time, Difficulty, Prerequisites) have actually been added where the standard requires them, through a properly scoped content-enrichment sprint following `docs/SPRINT_GENERATION_TEMPLATE.md`.
- [ ] The full repository QA sequence in `docs/MASTER_QA_PLAYBOOK.md` passes cleanly across all of `content/docs/`, including any content added during the enrichment sprint above.

## Assessment Layer Readiness

- [ ] Sales Leadership has reviewed and formally approved the proposed policy figures flagged as pending in `docs/ASSESSMENT_FRAMEWORK.md` (passing thresholds, retake limits, cooling-off periods) — none of them should reach production still marked "proposed."
- [ ] Every Knowledge Check, Quiz, and Scenario Test has been authored, reviewed against `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md`'s non-invention and disclaimer rules, and QA'd the same way any other content is.
- [ ] Every Role Play scenario draws from an existing, properly disclaimer-labeled Composite Case Study rather than an unlabeled or newly invented scenario.

## Search and AI Assistant Readiness

- [ ] The faceted search experience in `docs/SEARCH_EXPERIENCE.md` is built and returns correct results across all six proposed facets (Global, Module, Topic, Role, Candidate, Problem).
- [ ] The AI Assistant in `docs/AI_ASSISTANT_BLUEPRINT.md` has been tested specifically for Unknown-Answer Behaviour — confirming it defers rather than invents an answer for pricing, guarantees, statistics, and undocumented policy, the exact categories `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §11–14 protect.
- [ ] Every citation the Assistant produces in testing resolves to a real, existing article — the same standard `docs/MASTER_QA_PLAYBOOK.md`'s Link Validation already holds content to.
- [ ] The Assistant has been evaluated against a set of questions the repository deliberately does not answer (pricing figures, guaranteed outcomes, invented statistics) to confirm it declines rather than fabricates in every case, not just the ones anticipated during design.

## UI and Navigation Readiness

- [ ] Every element in `docs/UI_NAVIGATION_BLUEPRINT.md` marked "proposed, new" has been implemented and is functionally distinguishable from the elements marked "already exists," which should require no rebuilding.
- [ ] Dark Mode, Keyboard Shortcuts, and the Search Overlay have been tested for basic accessibility (keyboard navigability, screen-reader compatibility) before deployment, not treated as purely cosmetic.
- [ ] Progress, Bookmarks, and Completion Status correctly persist per learner account and don't leak between accounts.

## Live Chat Script Readiness (if in scope for this deployment)

- [ ] If `content/docs/live-chat-scripts/` is populated ahead of this deployment, every script has passed the same QA sequence as any other module, and the module is correctly registered in the root `content/docs/meta.json`.
- [ ] If live chat scripts are not yet in scope, `docs/MODULE_INDEX_STANDARD.md`'s Call Scripts field degrades gracefully (empty, not broken) for every module.

## Engineering and Ownership Readiness

- [ ] The full Antigravity pipeline in `docs/ANTIGRAVITY_PIPELINE_STANDARD.md` — install, lint, build — passes cleanly with the platform layer's own code included, once that code exists.
- [ ] `docs/REPOSITORY_OWNERSHIP.md`'s ownership matrix has been extended to cover the new platform-layer components (who owns Assessment content, who owns Assistant retrieval configuration, and so on) rather than leaving them unowned.
- [ ] `docs/REPOSITORY_SYNCHRONIZATION.md`'s single-source-of-truth discipline has been applied to any new platform-layer statistic (completion rates, assessment pass rates) so it's stated in exactly one place, not duplicated across a dashboard and a report.

## Documentation Readiness

- [ ] Every "Status: Design proposal — not yet built" header across this document's sibling files (`docs/CAREER_ADVISOR_ACADEMY.md`, `docs/LEARNING_PATHS.md`, `docs/MODULE_INDEX_STANDARD.md`, `docs/SEARCH_EXPERIENCE.md`, `docs/LIVE_CHAT_SCRIPT_FRAMEWORK.md`, `docs/ASSESSMENT_FRAMEWORK.md`, `docs/UI_NAVIGATION_BLUEPRINT.md`, `docs/AI_ASSISTANT_BLUEPRINT.md`) has been updated to reflect actual implementation status once that status changes — a stale "not yet built" header on a shipped feature is itself a documentation defect.
- [ ] `docs/AI_CONTEXT_PACK.md` has been updated to reference this platform layer's design documents, so a future agent working on this repository discovers them the same way it discovers every other engineering document.

## What This Checklist Does Not Cover

This checklist gates the platform layer described across this document's siblings. It does not gate ordinary content sprints (new Role Collections, new Sales Academy modules), which continue to follow `docs/SPRINT_GENERATION_TEMPLATE.md` and `docs/MASTER_QA_PLAYBOOK.md` exactly as they did before this design phase began.

## Related Documents

- `docs/CAREER_ADVISOR_ACADEMY.md` — the vision this checklist gates
- `docs/MASTER_QA_PLAYBOOK.md` — the content-layer QA process this checklist references rather than duplicates
- `docs/REPOSITORY_OWNERSHIP.md` — where platform-layer ownership would need to be formally extended
