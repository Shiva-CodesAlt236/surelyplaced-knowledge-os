# Assessment Framework

**Status:** Design proposal — not yet built; policy figures below are proposals pending approval, not decided rules
**Applies to:** How understanding is proposed to be demonstrated across the Career Advisor Academy
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document designs the assessment layer referenced throughout `docs/CAREER_ADVISOR_ACADEMY.md` and `docs/LEARNING_PATHS.md`. Every specific number in this document — a passing threshold, a retake limit — is a proposed default, explicitly flagged as such, and would need confirmation from Sales Leadership before being treated as actual policy. This mirrors the existing **Operational Policy Pending** pattern already used throughout `content/docs/` for any specific process this repository doesn't yet define.

## Knowledge Checks

Proposed short, per-article assessments — a handful of questions tied directly to that article's proposed Learning Objectives field (`docs/MODULE_INDEX_STANDARD.md`). Purpose: confirm a learner engaged with the specific content, not a comprehensive test of the whole module. Proposed to be low-stakes and immediately retakeable without limit.

## Quizzes

Proposed per-module assessments, aggregating across a module's Knowledge Checks into a single module-level result. Purpose: confirm a learner can synthesize a module's content as a whole, not just recall individual articles. A Quiz is proposed to sit between a Knowledge Check's low stakes and a Scenario Test's applied judgment.

## Scenario Tests

Proposed written, situation-based assessments that present a novel situation and ask a learner to identify the appropriate response category — for example, presented with a candidate statement, identify which objection category from `content/docs/objections/objection-handling-framework.mdx` it belongs to and the appropriate response pattern. Scenario Tests are built from the categories and frameworks that already exist in `content/docs/`, never from a new invented scenario outside what the content standard already permits — any illustrative scenario used in a Scenario Test would need the same **Composite Case Study** self-identification `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §9 already requires of any hypothetical example.

## Role Plays

Proposed live or simulated practice conversations. Two proposed variants:

- **Advisor role plays** — a Career Advisor practices a conversation (a discovery call, an objection-handling moment) against a simulated candidate, built from the same composite case studies already published in `content/docs/sales-coaching/` (for example, `composite-case-study-opt-software-engineer.mdx`) rather than inventing new fictional candidates for this purpose specifically.
- **Manager role plays** — a Sales Manager reviews a recorded or simulated conversation using the same lens `content/docs/sales-coaching/coach-review-framework.mdx` already establishes, per the Sales Manager path in `docs/LEARNING_PATHS.md`.

## Certification Exams

Proposed capstone assessments, one per Learning Path, sitting at the end of a path's full module sequence per `docs/LEARNING_PATHS.md`. A Certification Exam is proposed to combine a Scenario Test component and a Quiz-style knowledge component, scoped to the specific path's modules. No Certification Exam exists yet, and this document does not draft one.

## Completion Rules

Proposed default policy, pending Sales Leadership approval:

- A Knowledge Check may be retaken without limit.
- A Quiz may be retaken, with a proposed short cooling-off period between attempts to encourage genuine review rather than rapid guessing — no specific duration is proposed here, since that's a tuning decision better made once real usage exists.
- A Scenario Test or Role Play is proposed to use narrative feedback (what was right, what to reconsider) rather than a pass/fail score alone, consistent with the mastery-oriented philosophy in `docs/CAREER_ADVISOR_ACADEMY.md`.
- A Certification Exam is proposed to allow a limited number of retakes with a mandatory review period in between, the specific number to be set by Sales Leadership rather than assumed here.

## Scoring Philosophy

Proposed principles:

- **Mastery over ranking.** Assessment exists to confirm a learner's own understanding, never to rank learners against each other. No leaderboard or comparative scoring is proposed.
- **Formative over punitive.** Feedback is proposed to explain the reasoning behind a correct or incorrect response, not just report a score, consistent with `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §1's emphasis on teaching judgment rather than rote process.
- **No outcome guarantee, ever.** Consistent with `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §12, no assessment result — a passing score, a certification — is ever proposed to imply a guaranteed sales outcome, placement rate, or performance result. This applies to the platform's own language about its own certifications, not just to advisor-facing content about candidates.
- **No invented passing threshold stated as final.** Any specific percentage or point threshold appearing in a future implementation of this framework is Sales Leadership's decision to make, not a number this design document asserts as already decided.

## Relationship to Existing Content

Every assessment type above is built from content that already exists — objection categories, composite case studies, red-flags articles, the coach-review framework — rather than requiring new fictional material invented specifically for testing purposes. Where a future implementation finds it needs a scenario the existing content doesn't cover, the correct process is a normal content sprint that adds that scenario to `content/docs/` properly (with its own disclaimer labels and QA), not an assessment-only shortcut that bypasses the standing content rules.

## Related Documents

- `docs/CAREER_ADVISOR_ACADEMY.md` — the certification philosophy this framework implements
- `docs/LEARNING_PATHS.md` — where each path's specific completion criteria are defined
- `docs/MODULE_INDEX_STANDARD.md` — the Quiz and Practice fields this framework populates
- `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` — the disclaimer and non-invention rules any assessment content must follow
