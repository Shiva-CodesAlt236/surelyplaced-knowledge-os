# Final Content Quality Audit — SurelyPlaced Sales Academy

**Status:** Review-only audit — no lesson, overview, or component files were modified to produce this report
**Applies to:** All 54 Sales Academy lessons, all 7 module overview pages, the graduation experience, and all 162 Practice exercises
**Owner:** Chief Learning Experience Architect function
**Last updated:** 2026-08-05

This audit verifies the state of the Sales Academy after two prior sprints — the original ten-objective transformation sprint and the follow-on content-polish pass — against five checks: lesson framing, module overview completeness, the graduation experience, Practice exercise quality, and a Premium Academy Review against HubSpot Academy, Duolingo, Coursera, and Linear Learn. Every finding below was verified either programmatically against the full 54-lesson corpus or by direct reading of the flagged files. No files were changed to produce this report.

## 1. Lesson Framing (54 of 54 lessons)

All 54 lessons substantively answer why the lesson matters, when to use it, what skill it builds, and what happens next. This was verified programmatically across the full corpus, not sampled.

**How the 54 break down.** Eight lessons — one per module, each module's first lesson — use a "Start Here" block (`When do I use this?` / `What will this module help me achieve?` / `When should I move to the next module?`). The remaining 46 use an explicit four-line framing block (`**Why this matters:**` / `**When to use this:**` / `**What skill this builds:**` / `**What happens next:**`).

**Two genuine, minor inconsistencies found, neither a missing element:**

- **Four Discovery lessons use older label wording.** `building-rapport.mdx`, `candidate-qualification.mdx`, `discovery-call-checklist.mdx`, and `understanding-candidate-goals.mdx` were framed in the first polish pass, before the exact four-label standard (`Why this matters` / `When to use this` / `What skill this builds` / `What happens next`) was established. All four still substantively answer all four questions, but under the labels `**Why this matters:**`, `**When you'll use it:**`, `**How you'll use it:**`, and no explicit `What happens next` line — that fourth answer lives in the lesson's trailing end-of-module bridge text instead of inside the framing block itself. This is a labeling inconsistency, not a missing answer.
- **The eight "Start Here" openers don't separate "skill learned" from "why it matters."** `What will this module help me achieve?` answers both at once, by design, since Start Here operates at module-entry scope rather than single-lesson scope. This is a structural difference from the other 46 lessons' four-line format, not a defect — but it means a learner scanning only for a labeled "skill" line won't find one on these eight pages.

## 2. Module Overview Pages (7 of 7)

All seven `overview.mdx` pages contain all six required elements — Purpose, When used, Skills gained, Examples, Learning sequence, Bridge to next module — verified programmatically against each page's actual heading structure. All seven are correctly registered as the first page in their module's `meta.json`, so they are reachable in the content tree. No gaps found.

## 3. Graduation Experience

The Complete Sales Call Walkthrough's "Start Here" block explicitly states the page is a final exam, not new material ("there's no new skill to learn on this page, only the question of whether everything you've already learned actually holds together"). Its former "Roleplay" and "Practice Exercise" sections are relabeled "Final Assessment" and "Reflection Questions," each with a one-line statement distinguishing them from a normal lesson's drills.

**One real, residual gap.** The page still uses the identical section skeleton as every ordinary lesson for five of its non-conversation headings — `## Lesson Objective`, `## Coaching Notes`, `## Common Mistakes`, `## Quick Reference Cheat Sheet`, `## Module Completion` — the same headings that appear on all 53 other lessons. The prose framing at the top now clearly signals "this is an exam," but a learner scrolling the page's structure alone would still see a lesson-shaped page. Closing this fully would mean restructuring the page's section skeleton, not just its opening framing — a larger content change than this audit's review-only scope covers.

## 4. Practice Quality (162 of 162 PracticeBox exercises)

A full-corpus scan found:

- **Zero placeholder answers.** No `recommendedAnswer` contains bracket-instruction text (e.g., `[Name one specific thing...]`) — the four instances found and corrected in the prior polish sprint have not regressed.
- **Zero invented facts.** No `recommendedAnswer`, `bestAnswer` (DecisionPoint), or roleplay `recommendedAnswer` anywhere in the corpus states a dollar figure, a percentage, or an explicit guarantee claim.
- **Zero generic filler phrases** (e.g., "that's a great question," "trust me," "I guarantee") found in any answer.
- **One minor duplicate-answer instance, not previously caught.** `sales-coaching/reading-a-sales-conversation.mdx`'s Practice prompt — "Candidate sends a mixed signal — agreement followed by a deferral" — reuses, verbatim, the answer written for a plain "I need to think about it" objection elsewhere in the corpus ("Of course — can I ask what specifically you'd want to think through?"). The answer doesn't actually address the "mixed signal" the prompt specifically calls out (agreement immediately followed by a deferral is a different, more ambiguous moment than a plain request for time). This is the one place in 162 Practice exercises where an answer reads as reused rather than written for its own prompt. Two other duplicate instances of the same answer text (in `closing/handling-final-hesitation.mdx` and `objections/need-time-to-think.mdx`) are not a concern — both prompts are the same objection at different funnel stages, and the lessons explicitly cross-reference each other, so matching language there is intentional consistency, not reuse.

## 5. Academy Experience Review

Measured against HubSpot Academy, Duolingo, Coursera, and Linear Learn.

**Where the academy now holds up well.** The five-persona roster (Rahul, Priya, Neha, Akash, Emily) recurring across all 54 lessons and resolving in the Sales Constitution checklist's five-way callback gives it the kind of narrative continuity Duolingo and Linear Learn are built around, which most modular corporate LMS content (HubSpot Academy, Coursera) doesn't attempt. All 105 roleplays carry a specific, scenario-grounded Coach Explanation rather than a bare right answer, which is closer to Linear Learn's contextual tooltips than to a generic quiz rubric. Each module now opens with a labeled, six-point-verified overview page, genuinely comparable to a course syllabus. Progressive Easy/Medium/Difficult roleplay tiers within every lesson mirror Duolingo's core difficulty-ramp mechanic.

**Where a real gap remains.** Two things, both structural rather than content-quality issues at this point:

- The `PracticeBox` component has no `explanation` or `commonMistakes` prop, so every Practice question is structurally a single prompt-and-answer pair rather than a worked example with visible reasoning attached to the same widget — closer to a documentation exercise than to how HubSpot Academy or Coursera present a graded practice item. This is a component change, not a content change, and out of scope for a review-only or content-only pass.
- Neither the module overview pages nor the graduation experience are wired into the live product's `LearningJourneyStepper` or `firstLessonSlug` routing (a gap already documented in `07_LEARNER_JOURNEY.md`), and the graduation experience has no visual completion moment — a certificate screen or badge — the way Coursera or Duolingo mark a milestone. Both are content-ready and blocked only on engineering scope.

## Completed Items

- All 54 lessons verified to substantively answer why/when/skill/next (2 minor labeling inconsistencies noted, not missing content)
- All 7 module overview pages verified against the full 6-point checklist with zero gaps
- Graduation experience verified to explicitly frame itself as a final exam, not new material
- All 162 Practice exercises verified free of placeholders and invented facts; only 1 minor reused-answer instance found across the entire corpus
- Academy Experience Review completed against all 4 named products, with narrative continuity, feedback specificity, and unit orientation confirmed as genuine strengths

## Remaining Gaps

In priority order:

1. **`PracticeBox` component lacks `explanation`/`commonMistakes` props** — the single gap that most separates this academy's Practice exercises from a premium product's, and the only item on this list that requires an engineering change rather than content work.
2. **Four Discovery lessons use pre-standardization framing labels** (`When you'll use it` / `How you'll use it` instead of `When to use this` / `What skill this builds`, and no inline `What happens next` line) — a content fix, low effort, not yet done.
3. **Graduation page retains a lesson-shaped section skeleton** beneath its exam framing (`Lesson Objective`, `Coaching Notes`, `Common Mistakes`, `Quick Reference Cheat Sheet`, `Module Completion` headings are unchanged from ordinary lessons) — a larger content restructuring than a label change.
4. **One reused Practice answer** in `reading-a-sales-conversation.mdx` doesn't address its own prompt's specific "mixed signal" framing — a single-instance content fix.
5. **Module overview pages and graduation experience are not wired into live product navigation** (`LearningJourneyStepper`, `firstLessonSlug`, no certificate/badge surface) — engineering work, already documented in `07_LEARNER_JOURNEY.md`.

## Recommended Future Roadmap

**Near-term (content-only, no engineering dependency):** bring the four Discovery lessons' framing labels in line with the rest of the corpus; rewrite the one reused Practice answer in `reading-a-sales-conversation.mdx` to address its actual "mixed signal" prompt; consider whether the graduation page's five lesson-shaped headings should be renamed or restructured to fully match its exam framing.

**Medium-term (first engineering dependency):** add `explanation` and `commonMistakes` props to `PracticeBox`, then backfill all 162 Practice exercises to use them — this is the single change that would most measurably close the remaining gap against HubSpot Academy and Coursera's practice-item structure.

**Longer-term (product surface):** wire the seven module overview pages and the graduation experience into `LearningJourneyStepper` and `firstLessonSlug` routing, and evaluate whether a certificate or completion-badge moment is worth building for graduation, matching the closing ritual Coursera and Duolingo both use.

## Related Documents

- [09_LEARNING_EXPERIENCE_TRANSFORMATION_REVIEW.md](09_LEARNING_EXPERIENCE_TRANSFORMATION_REVIEW.md) — the two prior sprints this audit verifies the results of
- [07_LEARNER_JOURNEY.md](07_LEARNER_JOURNEY.md) — the engineering-side navigation gaps referenced in Sections 5 and "Remaining Gaps"
- [03_WIDGET_USAGE_GUIDE.md](03_WIDGET_USAGE_GUIDE.md) — the widget inventory, including `PracticeBox`'s current prop interface referenced throughout this audit
