# Learning Experience Transformation Review

**Status:** Sprint closeout report — covers the original transformation sprint against `08_LEARNER_EXPERIENCE_IMPLEMENTATION_SPEC.md` and a second content-polish pass that closed the first sprint's flagship-only framing gap
**Applies to:** All 54 Sales Academy lessons across 7 modules, plus 7 module landing pages
**Owner:** Chief Learning Experience Architect function
**Last updated:** 2026-08-05

This document closes the sprint that began with ten explicit objectives: making every lesson answer why/when/how/next, standardizing the lesson flow, verifying every ConversationViewer is self-sufficient, verifying every Practice exercise and Roleplay is complete, building module landing pages, reducing repetition into a real skill progression, capping every Quick Reference at one page, building a graduation experience, and reviewing the result against HubSpot Academy, Duolingo, Coursera, and Linear Learn. No engineering code was modified — every change in this sprint is MDX lesson content, `meta.json` registration, or documentation.

**Update (same day, second pass):** a follow-on content-polish sprint closed the biggest gap this document originally flagged — the Why/When/How framing was extended from Discovery-only to all 42 remaining non-opening lessons across the other six modules, the seven module overview pages were audited against an explicit six-point checklist and each given a labeled Purpose section, the Complete Sales Call Walkthrough was reframed to read as a final exam rather than another lesson, and four Practice answers that had degraded into bracket-placeholder text were rewritten as fully modeled examples. Sections below are updated in place to reflect this; superseded claims are marked rather than silently removed.

## 1. What Actually Changed

**Section reorder (all 54 lessons).** Common Mistakes now appears after Practice Exercise in every lesson, matching the flow objective: Overview → Watch Conversation → Coaching Notes → Roleplay → Practice → Compare Answer → Common Mistakes → Quick Reference → Next Lesson. This was mechanical and verified programmatically across the full corpus — zero exceptions.

**Coach Explanation on every Roleplay (105 of 105).** Every `RoleplayCard` across all 7 modules now carries a `managerTip` — a specific, non-generic one-sentence explanation of why the recommended response works, not a restatement of the scenario. This was hand-authored per roleplay, not templated, and verified programmatically for full coverage with zero brace or JSX errors introduced.

**Seven module landing pages, one per module.** Each new `overview.mdx` (registered as the first page in its module's `meta.json`, following the same pattern already established in this repository's Hiring Intelligence and Interview Intelligence modules) answers when the module is used, gives real, corpus-grounded examples using the existing five-persona roster, lists the skills built, states an honest estimated completion time computed from the actual sum of each lesson's `EstimatedTime` values (never invented), and bridges explicitly to the next module.

**Graduation experience.** `sales-constitution-checklist.mdx` — the last lesson of the last module — now has an explicit "Graduation" section naming the full seven-module arc, pointing back to the Complete Sales Call Walkthrough as proof the skills hold together as one conversation, and stating plainly that what comes next is real calls, not another lesson. Its Quick Reference was also trimmed from 9 items to 8 to meet the one-page cap.

**Explicit Why/When/How/Next framing on all 54 lessons.** Discovery's first lesson already carried a "Start Here" block from an earlier phase of this engagement, and this sprint originally added a compact Why/When/How micro-block to Discovery's remaining four lessons only. The second-pass polish sprint extended the same explicit, scannable framing — Why this matters, When to use this, What skill this builds, What happens next — to all 42 non-opening lessons across the remaining six modules, so every one of the 54 lessons now answers all four framing questions explicitly, not just Discovery. The seven module-opening lessons retain their existing "Start Here" blocks rather than a duplicate framing block, since "Start Here" already answers the same four questions at module-entry scope.

**Module overview pages audited and labeled.** All seven `overview.mdx` pages were checked against an explicit six-point checklist — Purpose, When used, Skills gained, Candidate examples, Learning sequence, Bridge to next module — and each was given a labeled `## Purpose` heading where that content previously existed only as an unlabeled opening paragraph. No other content was rewritten; the audit found the other five points already clearly present in every overview.

**Graduation experience reframed as an exam, not a lesson.** The Complete Sales Call Walkthrough's "Start Here" now states plainly that the page is a final exam, not new material. Its `## Roleplay` section is renamed `## Final Assessment` and its `## Practice Exercise` section is renamed `## Reflection Questions`, both with a one-line framing sentence distinguishing them from a normal lesson's drills — no underlying content was rewritten, only relabeled to match its actual function.

**Four Practice answers strengthened.** A full-corpus scan for bracket-placeholder answers (e.g., `[Name one specific thing that worked, concretely.]`) found four genuine instances across `call-self-review-checklist.mdx`, `coach-review-framework.mdx` (two), and `what-we-believe.mdx`, where the model answer had degraded into an instruction to the learner instead of a worked example. All four were rewritten as fully modeled, specific answers. Every other bracketed placeholder found in the corpus (for example, `[state the real constraint honestly]` or `[exact channel]`) was left as-is on review, since those are intentional variables that must come from the real call rather than an invented specific — filling them with fake detail would violate the academy's own never-invent principle.

## 2. What Was Verified, Not Just Assumed

A programmatic spot-check confirmed every `PracticeBox` (162 total) and every `DecisionPoint` (56 total) across the full corpus has a substantive `recommendedAnswer` or `bestAnswer` — none under 15 characters, none templated placeholder text. A hand-read sample spanning Discovery, Closing, Objections, Pricing, and Sales Constitution confirmed the main `ConversationViewer` in each lesson is genuinely self-sufficient: full scenario context (`visaStatus`, `difficulty`, `expectedOutcome`), a `DecisionPoint` that resolves the moment, and a `ManagerTip` that names the underlying principle — so a learner who only watches the conversation, without reading the surrounding prose, still understands the lesson's point. This was not exhaustively re-verified lesson-by-lesson across all 54 files; the sample was chosen to span every module rather than cluster in one.

## 3. Honest Scope Disclosure

This sprint did not treat every objective at the same depth, and that tradeoff should be visible rather than implied.

**Full corpus, full depth:** the section reorder, the Coach Explanation coverage, the seven module landing pages, the graduation close, and — as of the second-pass polish sprint — the explicit Why/When/How/Next framing were all completed and verified across every module, not a flagship sample. This closes what was originally the largest disclosed gap in this document.

**Sampled, not exhaustive:** ConversationViewer self-sufficiency was verified programmatically for completeness (no missing or trivial `DecisionPoint` answers anywhere) and hand-verified on a cross-module sample, not read lesson-by-lesson across the full 54-file corpus. Practice answer quality was verified programmatically for completeness and then specifically re-scanned corpus-wide for bracket-placeholder degradation (the second-pass sprint's Practice review), which is a narrower, more targeted check than a full qualitative read of all 162 answers — a genuine remaining gap, not a false claim of completeness.

## 4. A Known Widget Constraint

Objective 4 asked that no Practice question exist without an expected answer, an explanation, and common mistakes attached. `PracticeBox` (`components/learning/PracticeBox.tsx`) only accepts `prompt`, `recommendedAnswer`, and an optional `placeholder` — there is no `explanation` or `commonMistakes` prop. Because this sprint's constraint was MDX and documentation only, no component code was changed. The practical resolution: every `recommendedAnswer` was written to carry its own reasoning inline rather than as a bare answer, and every lesson's `MistakesPanel` covers the common-mistakes half of the requirement at the lesson level rather than per-question. This is a real gap against the letter of the objective, not a silent workaround — closing it properly means adding `explanation` and `commonMistakes` props to `PracticeBox`, which is engineering work for a future sprint.

## 5. Premium Product Review

Measured against HubSpot Academy, Duolingo, Coursera, and Linear Learn on the dimensions that actually separate a training product from documentation with exercises bolted on.

**Narrative continuity.** Duolingo and Linear Learn both win here structurally — a single throughline (a language learner's streak, a product's own onboarding) that never breaks character. The Sales Academy's five-persona roster (Rahul, Priya, Neha, Akash, Emily) recurring across all 54 lessons, resolving in the Sales Constitution checklist's five-way callback, is the same design instinct, and it's now genuinely present end to end — this sprint's graduation section makes that payoff explicit rather than implicit. HubSpot Academy and Coursera, by contrast, tend to reset context every module; the Sales Academy no longer does.

**Feedback specificity.** This was the sprint's biggest structural gain. HubSpot Academy's roleplay-adjacent content typically gives a right answer with little reasoning attached; Coursera leans on peer or auto-graded quizzes with generic rubric feedback. Every one of this academy's 105 roleplays now has a specific, scenario-grounded Coach Explanation — closer to what Linear Learn does with contextual product tooltips than to a generic LMS quiz.

**Progressive difficulty within a single skill.** Duolingo's core mechanic. The Sales Academy already had this in each lesson's Easy/Medium/Difficult roleplay tiers before this sprint; it remains a genuine strength and wasn't a focus of this sprint's changes.

**Orientation at the start of a unit.** HubSpot Academy and Coursera both open each course with a syllabus-style overview. The Sales Academy now has a labeled, six-point-checked `overview.mdx` per module (Purpose, when used, skills gained, candidate examples, learning sequence, bridge to next module) in addition to the whole-academy docs and each module's "Start Here" — genuinely comparable to a course syllabus now. The real remaining gap is not the content but the wiring: these pages are not yet connected to the live product's `LearningJourneyStepper` or `firstLessonSlug` routing, a known engineering gap already documented in `07_LEARNER_JOURNEY.md`'s "Current Gaps" section and unchanged by either sprint's no-code constraint.

**Closing ritual.** Coursera issues a certificate; Duolingo marks a milestone with a distinct visual moment. The Sales Academy's graduation now exists as genuine content and now explicitly names itself a final exam rather than a lesson — the five-persona callback, the "there's no next module" statement, the Final Assessment and Reflection Questions relabeling. It still has no equivalent visual or systemic moment (a certificate screen, a completion badge) because that would require product surface, not MDX. This remains content-ready for an engineering follow-up, not yet built.

**What still reads as documentation rather than training.** With the framing gap closed, one real gap remains: the `PracticeBox` component (Section 4) has no `explanation` or `commonMistakes` prop, so every Practice question is structurally a single prompt-and-answer pair rather than a worked example with visible reasoning and a named failure mode attached to the same widget. This sprint improved the four answers that had visibly degraded into placeholder text, but it did not and could not close the structural gap — that requires a component change, which is out of scope for a content-only sprint.

## 6. Recommended Next Sprint

With the framing, overview-page, and graduation gaps closed, two items remain, in priority order: scope the `PracticeBox` component change (`explanation` and `commonMistakes` props) as the first engineering task once code changes are back in scope, since it's the one gap no content-only sprint can close; and wire the seven module overview pages and the graduation experience into the live product's `LearningJourneyStepper`, `firstLessonSlug` routing, and (if pursued) a certificate or completion-badge surface — all three are content-ready and blocked only on engineering scope, not on further writing.

## Related Documents

- [07_LEARNER_JOURNEY.md](07_LEARNER_JOURNEY.md) — the gaps this review references (empty-state misroute, lesson-level Prev/Next, journey stepper step 8, generic Featured Knowledge Check) remain open and unchanged by this sprint
- [08_LEARNER_EXPERIENCE_IMPLEMENTATION_SPEC.md](08_LEARNER_EXPERIENCE_IMPLEMENTATION_SPEC.md) — the specification this sprint's content changes were built to eventually support once the corresponding engineering work is scoped
- [03_WIDGET_USAGE_GUIDE.md](03_WIDGET_USAGE_GUIDE.md) — the widget inventory, including `PracticeBox`'s current prop interface referenced in Section 4
