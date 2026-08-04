# Assessment Component Spec

**Status:** Implementation specification — Milestone 3D, final documentation sprint before implementation
**Applies to:** Every component behind Knowledge Checks, Quizzes, Scenario Tests, Role Plays, Certification Exams, and their manager-facing review counterparts
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document gives full component contracts to the assessment elements already designed in `docs/ASSESSMENT_FRAMEWORK.md` and templated in `docs/PAGE_TEMPLATES.md`'s Assessment Template. It does not redesign assessment mechanics, scoring philosophy, or policy figures — `docs/ASSESSMENT_FRAMEWORK.md` remains authoritative, including its explicit statement that passing thresholds and retake limits are proposals pending Sales Leadership approval, not values this document or its components assert as final.

## Quiz Layout

**Purpose.** Implementation contract for `docs/COMPONENT_LIBRARY.md`'s `KnowledgeCheckRunner` and `QuizRunner`, covering both assessment types since they share one structural layout per `docs/ASSESSMENT_FRAMEWORK.md`'s description of a Quiz as an aggregation of Knowledge Checks.

**Responsibilities.** Present questions one at a time or as a single scrollable set (implementation choice, not fixed by this document); capture responses; submit for scoring; hand off to Results below.

**Inputs:** The assessment's question set, tied to the underlying article's or module's Learning Objectives per `docs/MODULE_INDEX_STANDARD.md`.

**Outputs:** A submitted response set.

**Props:** `assessmentId`, `assessmentType` (`knowledge-check` | `quiz`).

**State:** Current responses (in progress, not yet submitted), current question index (if one-at-a-time).

**Events:** `onAnswerQuestion(questionId, response)`, `onSubmit()`, `onRetake()`.

**Dependencies:** `docs/API_CONTRACTS.md` Assessments contract, `docs/ASSESSMENT_FRAMEWORK.md` Knowledge Checks and Quizzes sections.

**Responsive behavior:** Single-column question layout at all breakpoints; no desktop-specific multi-column arrangement, since a linear question flow doesn't benefit from extra horizontal space the way a Dashboard grid does.

**Accessibility:** Each question's response controls (radio group, checkbox group, or text input as appropriate) use correct native or ARIA-equivalent grouping so assistive technology announces the question-to-answer relationship correctly; progress through a multi-question set is announced ("Question 3 of 8").

**Error states:** A submission failure (network or server error) preserves the learner's in-progress responses client-side and offers a retry, rather than discarding answered questions.

**Loading states:** Skeleton matching the question layout while the assessment definition loads.

**Future extensibility:** A Knowledge Check is proposed to be retaken without limit per `docs/ASSESSMENT_FRAMEWORK.md`'s Completion Rules; a Quiz's retake cooling-off period (duration unspecified, pending tuning) is a configuration value this component reads rather than hard-codes, so a future policy decision doesn't require a component change.

## Scenario Layout

**Purpose.** Implementation contract for `docs/COMPONENT_LIBRARY.md`'s `ScenarioTestRunner`.

**Responsibilities.** Present a situation-based prompt (built from existing content categories, per `docs/ASSESSMENT_FRAMEWORK.md`'s Scenario Tests — never a newly invented scenario outside the content standard's disclaimer rules); capture the learner's identified response category or free-form response; submit for reasoning-based feedback.

**Inputs:** The scenario prompt text (carrying whatever disclaimer label — Composite Case Study, Illustrative Only, and so on — its source content requires, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §9), the response options where the assessment is categorical rather than free-form.

**Outputs:** A submitted response.

**Props:** `scenarioId`.

**State:** The learner's in-progress response.

**Events:** `onSubmitResponse(response)`.

**Dependencies:** `docs/ASSESSMENT_FRAMEWORK.md` Scenario Tests, `docs/API_CONTRACTS.md` Assessments contract.

**Responsive behavior:** Single-column, consistent with Quiz Layout.

**Accessibility:** The scenario's disclaimer label (e.g., "Composite Case Study") is rendered as visible, programmatically associated text near the scenario prompt — not a tooltip or icon-only indicator — so a learner using any input method understands the scenario's illustrative status before responding.

**Error states:** Same submission-preservation pattern as Quiz Layout.

**Loading states:** Skeleton matching the scenario-prompt-plus-response-area shape.

**Future extensibility:** None beyond its current scope — deliberately kept structurally simple (prompt, response, submit) so it can host either a categorical or free-form response mode without a structural change.

## Roleplay

**Purpose.** Implementation contract for `docs/COMPONENT_LIBRARY.md`'s `RolePlayRunner`, covering both the advisor and manager variants per `docs/ASSESSMENT_FRAMEWORK.md`'s Role Plays.

**Responsibilities.** Advisor variant: run a simulated practice conversation built from an existing Composite Case Study. Manager variant: present a recorded or simulated conversation for the manager to review using the same lens as `content/docs/sales-coaching/coach-review-framework.mdx`.

**Inputs:** The underlying Composite Case Study content (advisor variant), or the conversation record being reviewed (manager variant).

**Outputs:** The learner's in-exercise responses (advisor variant) or the manager's review notes and assessment (manager variant, distinct from a Manager Note per `docs/NOTES_SYSTEM.md` — a Role Play review is scoped to one exercise, not a general per-advisor annotation).

**Props:** `roleplayId`, `variant` (`advisor` | `manager`).

**State:** The in-progress exercise turn sequence (advisor variant) or the reviewer's in-progress notes (manager variant).

**Events:** `onRespond(text)` (advisor variant), `onSubmitReview(notes, assessment)` (manager variant).

**Dependencies:** `docs/ASSESSMENT_FRAMEWORK.md` Role Plays, existing Composite Case Studies in `content/docs/sales-coaching/`, `docs/API_CONTRACTS.md` Assessments contract.

**Responsive behavior:** Conversation-style turn layout, single column at all breakpoints, similar in structure to the AI Chat Conversation Layout (`docs/AI_CHAT_COMPONENT_SPEC.md`) though a distinct component, since a Role Play's turns are exercise-scored rather than AI-retrieval-grounded.

**Accessibility:** Turn-by-turn content is exposed in reading order matching its visual order, with clear speaker attribution (learner vs. simulated candidate, or advisor vs. manager-reviewer) for assistive technology.

**Error states:** Same submission-preservation pattern as Quiz Layout, applied per-turn rather than only at final submission, given a Role Play's longer interaction length.

**Loading states:** Skeleton matching the conversation-turn layout while the underlying case study loads.

**Future extensibility:** None specified beyond the advisor/manager variant distinction already in scope.

## Results

**Purpose.** The shared results-display pattern across Knowledge Checks, Quizzes, Scenario Tests, and Certification Exams — specified once here rather than restated per assessment type, since `docs/ASSESSMENT_FRAMEWORK.md`'s Scoring Philosophy applies uniformly.

**Responsibilities.** Render the outcome of a completed attempt, routed to Feedback below for the explanatory content, per `docs/ASSESSMENT_FRAMEWORK.md`'s "Formative over punitive" principle — a bare score is never the sole content of a Results view.

**Inputs:** The completed attempt's outcome (correct/incorrect per question for Knowledge Checks/Quizzes; a categorical or narrative outcome for Scenario Tests and Role Plays; pass/retake status for Certification Exams).

**Outputs:** A retake action (where permitted), a continue action (return to the originating Lesson or Module page).

**Props:** `attemptId`, `assessmentType`.

**State:** None locally.

**Events:** `onRetake()`, `onContinue()`.

**Dependencies:** `docs/API_CONTRACTS.md` Assessments contract, Feedback component below.

**Responsive behavior:** No structural change across breakpoints.

**Accessibility:** The outcome is stated in text ("2 of 3 correct," "scenario response reviewed") — never conveyed through color or icon alone.

**Error states:** A failed result fetch (attempt exists but result unavailable) shows an explicit "results unavailable, try again" state, distinct from an in-progress attempt's absence of results.

**Loading states:** A brief in-progress indicator while scoring resolves, distinct from the attempt-submission Loading state that precedes it.

**Future extensibility:** Certification Exam Results extends this component with `docs/COMPONENT_LIBRARY.md`'s `CertificateView` hand-off rather than a separate Results variant, per `docs/PAGE_TEMPLATES.md`'s Assessment Template Certificate variant.

## Manager Review

**Purpose.** Implementation contract for the manager-facing review flow, per `docs/COMPONENT_LIBRARY.md`'s `ManagerRolePlayReviewPanel` and `docs/SCREEN_INVENTORY.md`'s Manager Role Play review flow entry.

**Responsibilities.** Present a completed advisor Role Play (or a recorded call, per `docs/ASSESSMENT_FRAMEWORK.md`'s manager Role Plays description) to a Sales Manager for structured review using the Roleplay component's manager variant.

**Inputs:** The advisor's completed Role Play attempt or recorded conversation.

**Outputs:** A submitted review (see Roleplay's manager variant `onSubmitReview` event).

**Props:** `advisorId`, `roleplayAttemptId`.

**State:** Same as Roleplay manager variant.

**Events:** Same as Roleplay manager variant.

**Dependencies:** `docs/ASSESSMENT_FRAMEWORK.md`, `docs/MANAGER_COMPONENT_SPEC.md` (this component is reached from the Manager Dashboard, per that document's Coaching section).

**Responsive behavior:** Standard single-column conversation review layout.

**Accessibility:** Same as Roleplay.

**Error states:** Same submission-preservation pattern.

**Loading states:** Skeleton matching the review layout.

**Future extensibility:** None beyond its current scope.

## Attempts

**Purpose.** Not a single rendered surface but the shared attempt-history data every retake-aware component above depends on, per `docs/API_CONTRACTS.md` Assessments contract's "retrieve a learner's attempt history" operation — specified once here to avoid restating it per assessment type.

**Responsibilities.** Track every attempt at a given assessment, its outcome, and its timestamp, so retake eligibility (per `docs/ASSESSMENT_FRAMEWORK.md`'s Completion Rules) can be evaluated without each component independently reconstructing that history.

**Inputs:** None — this is a read from the Assessments contract, not a component with its own inputs beyond `assessmentId` and the current learner's identity.

**Outputs:** Retake-eligibility state, consumed by Quiz Layout, Scenario Layout, and Results above.

**Dependencies:** `docs/API_CONTRACTS.md` Assessments contract.

**Error states:** A failed attempt-history fetch defaults to treating retake as unavailable (fail closed, showing an explicit "unable to determine retake eligibility, try again" message) rather than fail open (silently allowing an unlimited retake that may violate a future-configured policy limit).

**Future extensibility:** Once Sales Leadership approves specific retake-limit values, this shared logic is where that configuration is read from — no individual component above needs to change.

## Progress

**Purpose.** The assessment-family's own progress indicator, distinct from `docs/LEARNING_COMPONENT_SPEC.md`'s module/path `ProgressBar` — this entry specifies in-assessment progress (question N of M) specifically.

**Responsibilities.** Show how far through a multi-question or multi-turn assessment the learner currently is.

**Inputs:** Current question/turn index, total count.

**Outputs:** None — read-only.

**Props:** `current` (number), `total` (number).

**State:** None.

**Events:** None.

**Dependencies:** None beyond the parent runner component supplying `current`/`total`.

**Responsive behavior:** No structural change.

**Accessibility:** Same accessible-value pattern as `docs/LEARNING_COMPONENT_SPEC.md`'s `ProgressBar`.

**Error states:** Not applicable.

**Loading states:** Not applicable — resolved synchronously from the runner's already-loaded question set.

**Future extensibility:** None beyond its current scope.

## Feedback

**Purpose.** Implementation contract for `docs/COMPONENT_LIBRARY.md`'s `FormativeFeedbackPanel`.

**Responsibilities.** Render reasoning-based feedback explaining why a response was correct or incorrect, per `docs/ASSESSMENT_FRAMEWORK.md`'s Scoring Philosophy — never a bare score without explanation.

**Inputs:** The scored attempt's per-question or per-scenario feedback text, sourced from the assessment's own authored content (never generated ad hoc by this component).

**Outputs:** None — display-only, composed within Results above.

**Props:** `feedback` (per-item feedback text and correctness/outcome state).

**State:** None.

**Events:** None.

**Dependencies:** `docs/ASSESSMENT_FRAMEWORK.md` Scoring Philosophy.

**Responsive behavior:** No structural change.

**Accessibility:** Feedback text is programmatically associated with the question it explains, not a disconnected block at the page's end.

**Error states:** Missing feedback text for a given item (an authoring gap) renders that item's outcome (correct/incorrect) without a fabricated explanation, rather than inventing reasoning the underlying content doesn't actually provide.

**Loading states:** Loads with Results, no independent loading state.

**Future extensibility:** None beyond its current scope — deliberately kept as a display of authored content, not a generative component, consistent with this repository's non-invention discipline extending into assessment feedback.

## Related Documents

- `docs/ASSESSMENT_FRAMEWORK.md` — the design and Scoring Philosophy this document gives component contracts to
- `docs/PAGE_TEMPLATES.md` — the Assessment Template these components are assembled into
- `docs/MANAGER_COMPONENT_SPEC.md` — the Coaching section that reaches into Manager Review
- `docs/API_CONTRACTS.md` — the Assessments contract every component above depends on
