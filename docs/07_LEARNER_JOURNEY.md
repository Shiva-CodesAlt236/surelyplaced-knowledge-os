# Learner Journey

**Status:** Canonical reference — permanent blueprint
**Applies to:** One representative Admissions Advisor's real experience of the Sales Academy, Day 1 through Month 1 and beyond
**Owner:** Chief Product Officer / Chief Learning Officer function
**Last updated:** 2026-08-05

This document walks one learner's experience end to end, against the architecture defined in `05_ACADEMY_INFORMATION_ARCHITECTURE.md` and the single-product experience defined in `06_SINGLE_ACADEMY_EXPERIENCE.md`. Its second half breaks from narrative and states, plainly, where the product as it exists today falls short of that intended experience — found by direct inspection of the live product rather than assumed. Naming a gap here is not a criticism of the work already done; it's the same honest-about-what's-real discipline this entire documentation set has held itself to from the beginning.

## Day 1

A new Admissions Advisor is pointed to the Academy on their first day. They land on the Dashboard, which — because they have no history yet — should present an honest empty state and a single, obvious action into the guided journey's actual starting point. They open Discovery's first lesson, meet Rahul on a cold call, and immediately see what the Academy actually is: not a manual to search, but a real, worked conversation with a real outcome. They finish the lesson, the product reflects that it's done, and a clear next action carries them into the second lesson without needing to think about where to go. By the end of Day 1, a good outcome is one Discovery lesson genuinely absorbed, not five skimmed.

## Week 1

The advisor finishes Discovery and moves into Discussion, feeling — if the bridge language and the Journey Stepper are both doing their job — like they're continuing one story rather than starting a new resource. They begin using Roleplay for real, attempting the easy and medium difficulty scenarios and comparing their own attempts against the recommended answers. They bookmark a couple of lessons they expect to want to revisit before their first real difficult call. By the end of Week 1, a good outcome is Discovery and Discussion both complete, with the advisor able to describe, in their own words, why a recommendation has to wait until a recap has been confirmed.

## Week 2

Closing and Objection Handling. This is where the Academy's harder emotional material shows up — Akash's honest "not now," Neha's prior distrust — and where Roleplay's difficult-tier scenarios start to matter more than the easy ones. The advisor should feel the Journey Stepper's visible progress (now roughly half filled) as real momentum, and should be handling their first real, unscripted calls at work with growing confidence that traces directly back to specific lessons, not a vague sense of having "done some training."

## Month 1

Pricing, Sales Coaching, and Sales Constitution, closing with the Complete Sales Call Walkthrough as the capstone — the moment every earlier module should visibly pay off in one continuous, realistic call. A learner reaching this point should feel arrival, not just completion of one more item in a list; this is the single most important moment in the entire product to get right, because it's the only point where the whole Academy's promise (one continuous journey, not seven modules) is either proven or exposed as aspirational.

## Certification

Not yet built. Once it exists, per `04_SALES_ACADEMY_FUTURE_ROADMAP.md`'s Version 2 and 3, this is the point where the advisor's demonstrated understanding — built across everything above — gets formally recognized. It should feel like the natural conclusion of a genuinely completed journey, never like a separate hurdle bolted onto the end of it.

## Manager Review (Future)

Not yet built. A Sales Manager, at some point in this same Month 1, should be able to see this advisor's real progress and, eventually, review a real or roleplayed call the way `content/docs/sales-coaching/coach-review-framework.mdx` already teaches an advisor to self-review. This is explicitly a separate, coaching-oriented surface from the advisor's own Dashboard, not a reskin of it, per `02_SALES_ACADEMY_PRODUCT_BLUEPRINT.md`.

## AI Coach (Future)

Not yet built. Somewhere in this journey — most plausibly around Week 2, once the advisor has enough foundation to benefit from dynamic practice rather than only fixed comparisons — a grounded AI Coach would let them roleplay against a responsive, in-character candidate instead of a scripted scenario. Its value compounds specifically because it can be used repeatedly, unlike a fixed roleplay script the advisor eventually memorizes.

## Voice Practice (Future)

Not yet built, and the furthest out of the future capabilities named in this journey. Voice practice would close the last real gap between rehearsing a response in writing and actually saying it out loud under time pressure — the exact skill a real call demands and a typed roleplay can only approximate.

## Current Gaps

Four concrete gaps were found by directly inspecting the live product against the architecture this document and `05_ACADEMY_INFORMATION_ARCHITECTURE.md` describe. Each is stated precisely so it can be fixed precisely.

**A new learner's empty-state action does not point into the Sales Academy.** The Dashboard's Continue Learning card, when a learner has no activity yet, currently directs them to the Candidate Intelligence reference documentation rather than into the Sales Academy's actual starting lesson. This directly contradicts this document's own Day 1 narrative and `05_ACADEMY_INFORMATION_ARCHITECTURE.md`'s "Where They Start" section — a brand-new advisor's very first click currently leads away from the guided journey, not into it.

**Lesson-level Previous/Next navigation jumps between modules, not between lessons.** The control at the bottom of every lesson page resolves "next" against the eight macro journey steps (module-level), not against that module's own lesson sequence. In practice, this means a learner reading the third of Discovery's five lessons and clicking "Next" is taken directly into Discussion's first lesson, skipping the remaining two Discovery lessons entirely unless they separately notice and use the sidebar. This is the most significant gap against `05_ACADEMY_INFORMATION_ARCHITECTURE.md`'s "How Lessons Connect" section, since it silently breaks the one-lesson-at-a-time progression the whole Content Framework is written to support.

**The Journey's eighth step does not point to the Complete Sales Call Walkthrough.** The Learning Journey Stepper's final step, "Complete Sales Call Mastery," currently resolves to an older case-study lesson rather than the dedicated Complete Sales Call Walkthrough lesson built specifically to be the Academy's capstone. This directly contradicts `05_ACADEMY_INFORMATION_ARCHITECTURE.md`'s explicit requirement that the eighth step's entry point be the Walkthrough itself, and it means the single most important lesson in the Academy, per `01_SALES_ACADEMY_VISION.md`, is currently one click harder to reach than it should be.

**The Dashboard's featured practice content isn't grounded in the Academy's own material.** The static Knowledge Check surfaced on the Dashboard uses generic sales-training language ("prospect," a budget-objection scenario unconnected to any of the Academy's five recurring personas) rather than material that would feel like a continuation of what the learner has actually been taught. This is a smaller gap than the three above, but it's exactly the kind of seam `06_SINGLE_ACADEMY_EXPERIENCE.md` warns against — a moment where the product quietly stops feeling like one continuous academy.

## Future Opportunities

Beyond fixing the gaps above, the clearest near-term opportunity is closing the loop between Progress data that already exists (completed lessons, current module) and the Journey Stepper's totals, which should be read live from each module's actual current lesson count rather than a number set once and left to drift as modules grow — the sales-coaching module's addition of the Complete Sales Call Walkthrough as an eleventh lesson already makes the Stepper's stated lesson count for that step stale. Beyond that, the roadmap's own Version 1.5 through 3 — a stronger Search experience, real Learning Paths, the AI Coach, Certification, a Manager Dashboard — remain the right next investments, in that order, per `04_SALES_ACADEMY_FUTURE_ROADMAP.md`'s own sequencing logic.

## Recommendations

Fix the three navigation and routing gaps above before investing further in new capability — an AI Coach or Certification layered on top of a journey that currently misroutes a new learner's very first click, or silently skips lessons mid-module, would be building a more impressive product on top of a broken foundation rather than a stronger one. Treat the Complete Sales Call Walkthrough's correct placement as the highest-priority single fix, given how directly it undermines the specific promise `01_SALES_ACADEMY_VISION.md` makes about that lesson. Once the foundation is solid, revisit the Dashboard's featured practice content to draw from the Academy's own five-persona continuity rather than generic material, since that's a small fix with an outsized effect on whether the product feels like one coherent academy end to end.

## Related Documents

- `05_ACADEMY_INFORMATION_ARCHITECTURE.md` — the intended structure this journey and its gaps are measured against
- `06_SINGLE_ACADEMY_EXPERIENCE.md` — the felt experience this journey narrates
- `04_SALES_ACADEMY_FUTURE_ROADMAP.md` — where Certification, AI Coach, Manager Review, and Voice Practice sit in the broader sequencing
- `01_SALES_ACADEMY_VISION.md` — the mission this entire journey, gaps included, is measured against
