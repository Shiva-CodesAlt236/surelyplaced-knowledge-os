# Learner Experience Implementation Specification

**Status:** Canonical reference — Phase 1 implementation specification
**Applies to:** Academy Home, the Learning Journey, Navigation, and the full learner-facing Information Architecture chain
**Owner:** Chief Learning Experience Architect function
**Last updated:** 2026-08-05

This document is the definitive specification for Phase 1 of the learner journey, written against `01_SALES_ACADEMY_VISION.md` through `07_LEARNER_JOURNEY.md` and the UX specification in `01_ACADEMY_UX_BIBLE.md`, `02_LEARNING_EXPERIENCE_GUIDELINES.md`, and `03_WIDGET_USAGE_GUIDE.md`, all of which are now the source of truth this document implements rather than reinterprets. It is a product experience specification, not an implementation plan — it says exactly what a learner should see, in what order, and why, and leaves how it gets built to the engineering work that follows. Where this specification requires behavior that the gaps identified in `07_LEARNER_JOURNEY.md` show is not currently true of the live product, that requirement stands as-is; closing that gap is exactly what Phase 1 is for.

## 1. Academy Home

**What should a learner see, and in what order.** Academy Home has exactly one job in its first screenful: tell the learner, instantly, where they are in their journey and what to do next. Everything else is secondary. The order, top to bottom, is: a single resume-or-start action, the Learning Journey's current position, then supporting material — recommended next content, saved items, recent activity, quick access to Search and any AI capability. A learner should never have to scroll to find out what to do next.

**What should be above the fold.** The resume-or-start action and the Learning Journey's current position, together, in the same first screenful, on every device down to the smallest supported mobile width. Nothing else on Academy Home is important enough to compete with these two for that space. A metric, a recommendation, a bookmark preview — all of these belong below the fold, because none of them answers "what do I do right now" as directly as the primary action does.

**Returning learner.** Sees their real progress reflected immediately: the specific lesson and module they were last in, a visible sense of how far through the overall journey they are, and one action that takes them straight back in. This should require zero interpretation — not "here are your modules, find where you left off," but "here is where you left off, continue."

**New learner.** Sees the same page structure, not a different onboarding flow, but with every progress-dependent element replaced by its honest empty state: no resume point, so the primary action becomes "start the journey" and points directly at Discovery's first lesson; no recent activity, no bookmarks yet, each stated plainly rather than hidden or faked. A new learner should understand within seconds that this is a guided, sequential academy, not a library to browse at random.

**Empty state.** Every empty state on Academy Home explains what will appear there once the learner has real activity, and never displays placeholder content that could be mistaken for real data. An empty state is not a dead end — each one carries its own path back into the guided journey, so a learner with nothing yet is never looking at a widget with nothing to do.

**Continue Learning.** The single highest-priority element on the page after the learner has any history at all. It names the specific lesson, the module it belongs to, and gives one unambiguous action. It never resolves to a module's front page as a substitute for the exact lesson — "continue" means continue exactly where the learner stopped, not "return to roughly the right area."

**Resume logic.** Resume always targets the most recently active lesson, full stop — not the most recently completed lesson, not the first incomplete lesson in sequence, and never a different module's entry point regardless of how the underlying journey step is structured. If a learner was three minutes into a lesson and closed the tab, resume takes them back into that same lesson. This is the exact behavior `07_LEARNER_JOURNEY.md` found is not yet true for a brand-new learner's empty state, which currently resolves outside the Sales Academy entirely — Phase 1 must correct this as a first-priority fix, not a follow-up.

## 2. Learning Journey

**How the journey should feel.** Continuous and cumulative — each step visibly building on the last, never a flat menu of equally-weighted options. A learner should be able to glance at the journey and feel the same thing a runner feels looking at a marked course: exactly how far they've come and exactly how far remains, never "which of these seven things should I do."

**Phases vs. modules.** A module is a real content unit — Discovery, Discussion, Closing, and so on — each a specific, bounded set of lessons. A phase is a larger grouping the journey can use to communicate momentum at a coarser grain than eight individual steps: for example, an Outbound Foundations phase spanning Discovery and Discussion, a Candidate Conversation phase spanning Closing, Objection Handling, and Pricing, and a Mastery phase spanning Sales Coaching, Sales Constitution, and the Complete Sales Call Walkthrough. Phases never replace modules in the underlying content structure — they are a presentation grouping the Learning Journey uses to make an eight-step sequence easier to hold in mind at a glance, particularly on Academy Home where full step-by-step detail would compete with the primary resume action.

**Estimated time.** Shown at both the module level (already established per module) and reflected honestly at the phase level as a sum of its modules — never independently estimated at the phase level in a way that could drift from the module figures underneath it. Every estimate is explicitly a planning figure until real usage data exists to replace it, consistent with the honesty standard the rest of this documentation set already applies to every other unmeasured number.

**Progress.** Always computed from genuine lesson completion, never from time spent or pages visited. Progress is shown at three grains simultaneously and consistently — lesson, module, and overall journey — and all three must always agree with each other; a learner should never see a module marked complete while the journey view still shows it as in progress.

**Locked and unlocked.** The default Sales Academy journey is not gated — every module is reachable at any time, consistent with `05_ACADEMY_INFORMATION_ARCHITECTURE.md`'s description of a self-paced, non-blocking lesson-to-lesson flow. What changes with progress is not access but framing: an unstarted module is presented as "up next" once the module before it is complete, and available but not yet recommended before that. Hard locking is reserved for a future, explicitly scoped decision (for example, a formal certification path with genuine prerequisites) — Phase 1 introduces no lock a learner can't see through and understand the reason for.

**Completed.** A module is marked complete only when every lesson inside it is complete, and that state is reflected identically everywhere it's shown — the journey view, the module page, and Academy Home. Completion is a real, earned state, never inferred from having merely opened every lesson without engaging with them.

**Resume.** At the journey level, resume means the same thing it means on Academy Home: return to the exact in-progress lesson, not the start of the current module. A learner deep into their fourth Objection Handling lesson should never be dropped back at Objection Handling's first lesson because the journey view only tracks module-level position.

## 3. Navigation

**Previous lesson / next lesson.** Always resolves within the current module's own lesson sequence, in that module's actual defined order. This is the most important correction Phase 1 must make relative to the current product: `07_LEARNER_JOURNEY.md` found that lesson-level Previous/Next currently resolves against the eight macro journey steps instead, silently skipping lessons within a module. Previous/Next must never cross a module boundary except at the true first or last lesson of that module, at which point it hands off explicitly to Previous Module or Next Module rather than pretending the adjacent module's first lesson is simply "the next lesson."

**Previous module / next module.** A separate, explicit action from lesson-level Previous/Next, surfaced only at a module's true first or last lesson, or from the module and journey views themselves. It always resolves to the adjacent module's designated first lesson, and it is always visually distinct from in-module Previous/Next so a learner always knows whether their next click keeps them in the same module or moves them to a new one.

**Breadcrumbs.** Present on every lesson page, showing the full path from the Academy down to the current lesson — Academy, module, lesson — with each segment a working link back to that level. Breadcrumbs are the learner's constant, passive answer to "where am I," available even when they arrived at a lesson through Search or a bookmark rather than by walking the journey in order.

**Sidebar behavior.** The sidebar reflects the current module's full lesson list with the learner's real completion state marked against each one, and it keeps the current lesson visibly highlighted at all times. It is a map of the current module specifically, not the whole eight-step journey — that broader view belongs to the Learning Journey component on Academy Home and the module page, not duplicated in the sidebar on every scroll.

**Mobile navigation.** Breadcrumbs collapse to the current module and lesson only (dropping the full path) to preserve vertical space, the sidebar becomes an on-demand drawer rather than a persistent column, and Previous/Next remain full-width, thumb-reachable controls at the bottom of the content rather than small inline links. On mobile specifically, the single most important navigation element is still the same one as desktop: a learner should never need more than one tap to find out what's next.

## 4. Information Architecture

The learner-facing chain is exact, and every implementation decision must preserve this order without collapsing or reordering any step:

Dashboard is the learner's entry point and returning home base — the same screen, per Section 1 above. It leads into Academy Home's Learning Journey view, which is the visual representation of the full eight-step sequence. Each step in that sequence is a Phase, a presentational grouping over one or more Modules. Each Module is a real content unit containing an ordered sequence of Lessons. Each Lesson contains, in order, its worked conversation content, its Practice exercises, and its Roleplay ladder — Practice and Roleplay are sub-stages within a single lesson's lifecycle, never separate top-level steps a learner navigates to independently. Completing a lesson's content, Practice, and Roleplay brings the learner to that lesson's Complete state, which surfaces the explicit choice of Next Lesson (within the current module) or, at a module's final lesson, Next Module (the adjacent module in the journey). Reaching and completing the journey's eighth step — the Complete Sales Call Walkthrough — brings the learner to Graduation: the explicit, visible acknowledgment that the full guided journey is done, distinct from simply completing one more module, and the natural point at which a future Certification would be offered.

At no point in this chain should a learner be unable to answer, immediately, which of these ten states they're currently in. A Lesson page must never be visually indistinguishable from a Module page; a Practice exercise must never be presented in a way that could be mistaken for a Roleplay; reaching Graduation must feel visibly different from completing an ordinary module, or the entire chain collapses into an undifferentiated scroll and the specification has failed at its one job.

## 5. UX Principles

Every screen in the Academy, without exception, must make four things answerable at a glance, without requiring the learner to hunt or infer:

**Where am I?** Breadcrumbs plus visual context (module name, lesson title, journey position) answer this on every screen, always, not only on lesson pages.

**What do I do next?** Exactly one primary action, visually dominant over any secondary action on the same screen. A screen with two equally-weighted primary-looking buttons has failed this principle even if both are technically valid next steps.

**How far have I come?** A progress signal appropriate to that screen's scope — lesson-level on a lesson, module-level on a module page, full-journey-level on Academy Home — always genuine, never approximated or optimistic.

**What happens after this?** Every screen previews its consequence before the learner commits to the primary action — a lesson page names the next lesson before the learner finishes reading, a module's final lesson names the next module, and the Complete Sales Call Walkthrough names Graduation. A learner should never complete an action and only then discover what it led to; the destination should already have been visible.

## 6. Premium Product Review

Measured honestly against HubSpot Academy, Coursera, Linear Learn, and Duolingo, several real gaps remain even after this specification is fully implemented.

Against **Duolingo** specifically, the Academy has no equivalent of a streak or any other lightweight, low-stakes return-trigger — nothing currently gives a learner a reason to open the product tomorrow rather than whenever they next happen to think of it. Duolingo's core loop also rewards very short sessions extremely well; this Academy's lessons, by design, are deeper and longer, which is right for the material but means there is currently no equivalent "two-minute" entry point for a learner who only has a short gap between calls — a real, unaddressed gap this specification does not solve on its own.

Against **Coursera**, the Academy currently has no peer or cohort dimension at all — no sense that other advisors are moving through the same material, no visible social proof of completion, and no cohort-level pacing. Coursera also typically frames a course with a syllabus a learner can preview before committing; the Academy's Learning Journey shows the current step well but does not yet give a new learner an easy, complete preview of the entire eight-step arc before they start, which a more skeptical or time-pressured new advisor might reasonably want.

Against **Linear Learn** specifically — a product whose defining quality is how little friction exists between reading and doing — this specification's Practice and Roleplay stages are still one layer more separated from the surrounding lesson prose than Linear's own content is from its product; there remains real room to make Practice feel even less like a discrete "exercise mode" and even more like a continuous part of reading.

Against **HubSpot Academy**, the clearest gap is credibility signaling: HubSpot's certifications carry external, portable weight partly through visible badges, shareable credentials, and a track record of many completions. This Academy's Certification, once built, will need a genuine equivalent — some visible, credible signal of what completion actually means — or it risks feeling like an internal formality rather than the meaningful credential `01_SALES_ACADEMY_VISION.md`'s Certification philosophy intends it to be.

Beyond these named comparisons, three cross-cutting weaknesses remain, independent of any single competitor: there is currently no lightweight way to preview a lesson's difficulty or content before committing to open it, no meaningful sense of a learner's own trajectory over time (are they getting faster, more confident, tackling harder roleplays more readily), and no moment of genuine delight anywhere in the journey — every interaction specified above is competent and honest, which matters enormously for trust, but competence alone does not yet produce the specific feeling of momentum that makes a learner want to return. Closing the concrete navigation gaps identified in `07_LEARNER_JOURNEY.md` is the necessary foundation; none of it yet reaches for the delight the strongest of these four competitors clearly deliver.

## Related Documents

- `05_ACADEMY_INFORMATION_ARCHITECTURE.md` — the structural map this specification makes exact and implementation-ready
- `06_SINGLE_ACADEMY_EXPERIENCE.md` — the felt-experience thesis this specification's UX Principles enforce screen by screen
- `07_LEARNER_JOURNEY.md` — the verified current-state gaps this specification's Academy Home and Navigation sections are written to close
- `01_ACADEMY_UX_BIBLE.md`, `02_LEARNING_EXPERIENCE_GUIDELINES.md` — the visual and pedagogical specification this document's screens are built against
