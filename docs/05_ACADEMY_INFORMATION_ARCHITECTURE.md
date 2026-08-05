# Academy Information Architecture

**Status:** Canonical reference — permanent blueprint
**Applies to:** Every route, page, and connective mechanism a learner encounters in the Sales Academy
**Owner:** Chief Product Officer / Information Architect function
**Last updated:** 2026-08-05

This document is the permanent map of how a learner physically moves through the Sales Academy — what pages exist, which are required versus optional, and how every page connects to the one before and after it. It is written against the product vision in `01_SALES_ACADEMY_VISION.md`, the product surfaces defined in `02_SALES_ACADEMY_PRODUCT_BLUEPRINT.md`, the writing standard in `03_SALES_ACADEMY_CONTENT_FRAMEWORK.md`, the roadmap in `04_SALES_ACADEMY_FUTURE_ROADMAP.md`, and the UX specification in `01_ACADEMY_UX_BIBLE.md`, `02_LEARNING_EXPERIENCE_GUIDELINES.md`, and `03_WIDGET_USAGE_GUIDE.md`. It also reflects what has actually been verified by direct inspection of the live product — a Dashboard, a Learning Journey Stepper, Continue Learning, Bookmarks, Notes, Mark Complete, Search, an AI Assistant panel, and a Knowledge Check surface already exist and are wired into real state, not only proposed. Where this document's description of "how it should work" differs from what was found actually wired up, that difference is called out explicitly rather than smoothed over, in the same honest spirit the rest of this documentation set already holds itself to.

## How a Learner Moves

A learner's default path through the Academy is linear at the module level and self-paced at the lesson level. They move forward through one continuous eight-step journey — the seven Sales Academy modules in sequence, followed by the Complete Sales Call Walkthrough as an eighth, capstone step — and within each step, they move lesson by lesson in the order that module's own lesson sequence defines. A learner is never required to consult a separate map to know what's next; the next action is always presented directly on the page they're already on, both at the macro level (which module step is current) and the micro level (which lesson within that module comes next).

## Where They Start

The Academy's front door and the learner's ongoing home base are the same page: the Dashboard at the site root. For a learner with no history yet, the Dashboard's primary card has no resume point to offer, so it presents an honest empty state directing them into the guided journey rather than a fabricated "welcome" placeholder. For every learner after their first visit, the same page becomes the fastest way back to exactly where they left off — this dual identity (empty-state entry point and returning home base) is intentional; the Academy should never need a visually distinct "onboarding page" separate from the page a learner will use every day after.

## Where They Go Next

At the module level, "next" is answered by the Learning Journey Stepper: eight steps, each showing its own completion state (completed, current, or not yet started) and a single action leading into that step's first lesson. At the lesson level, "next" is answered inside the lesson page itself, which shows the learner's position in the overall eight-step journey and a direct control to move to the adjacent step. A learner should never have to return to the Dashboard just to continue forward — every lesson page carries enough of its own navigation to keep moving without detouring back to the home base.

## Required Pages

Every learner's path depends on these pages existing and working: the Dashboard (entry point and home base), a Lesson Page for every lesson in all seven modules plus the capstone, and the underlying Progress mechanism that makes "where was I" and "what's next" meaningful rather than static. These are required in the strict sense that removing any one of them breaks the core promise of a guided, continuous journey rather than a folder of independent articles.

## Optional Pages

Search and the AI Assistant panel are optional in the sense that a learner can complete the entire guided journey without ever opening either — they exist for the moment a learner needs something specific outside their current step, not as a required stop along the path. Bookmarks and Notes are similarly optional, personal-utility surfaces: valuable for a learner who wants to mark something for later or capture their own thinking, but never a gate blocking progress through the journey. A future dedicated Learning Paths landing page (distinct from the single default eight-step journey) is optional in a different sense — it doesn't exist yet, and the single guided journey remains the default, required path until role-specific paths are actually built per `04_SALES_ACADEMY_FUTURE_ROADMAP.md`'s Version 2.

## How Modules Connect

Modules connect at two levels simultaneously, and both must stay true for the journey to feel continuous. At the content level, every module's first lesson opens with orientation (when to use this module, what it achieves, when to move on) and every module's last lesson closes with an explicit bridge naming the next module and why it follows — this is real, written content, not a navigational affordance. At the product level, the Learning Journey Stepper renders these same seven modules plus the capstone as one visual sequence with a persistent sense of progress across all eight steps. These two layers must agree with each other: a content bridge that says "next: Closing" must lead to a product experience that actually treats Closing as the next step, not a different one.

## How Lessons Connect

Within a module, lessons connect through that module's own `meta.json` order and through explicit "Next" language at the end of each lesson naming the specific next lesson and why it follows from what was just taught. A lesson page's own navigation should always resolve to the true next lesson in that specific module's sequence — a learner on lesson three of a five-lesson module should land on lesson four, not be redirected to a different module's entry point. Where a lesson page's navigation instead jumps between the eight macro journey steps rather than between adjacent lessons within the current module, that is a real product gap against this intended architecture, not an alternate valid design — see Current Gaps in `07_LEARNER_JOURNEY.md`.

## How Search Should Work

Search exists for the moment a learner needs one specific answer fast and doesn't want to walk their guided journey to find it — an advisor thirty seconds before a real call, not a learner working through the curriculum in order. It should return real, existing lesson and reference content directly, resolving to the actual page, never a generated or paraphrased answer of its own — that distinction is what separates Search from the AI Assistant. Search should be reachable from anywhere in the product (the Dashboard's quick actions and a persistent global entry point are both appropriate), since the moment a learner needs it rarely coincides with being on a page that happens to have a search box built in specifically.

## How Continue Learning Should Work

Continue Learning is the single most important piece of returning-learner navigation in the whole product: it should always resolve to the exact lesson a learner was last active on, with a clear sense of progress within that lesson's module, and a single action that takes them straight back in — never a generic link back to a module's front page that makes the learner re-find their place manually. Where no active lesson exists yet, Continue Learning's honest empty state should point a new learner into the guided journey's actual starting point, never leave them without a next action.

## How Bookmarks Should Work

A bookmark is a learner's own deliberate "come back to this" signal, distinct from their automatic progress through the guided journey — bookmarking a lesson should never mark it complete, and completing a lesson should never require it to have been bookmarked first. Bookmarks should be visible both from the lesson page itself (so a learner can bookmark in the moment) and from a compact view on the Dashboard (so a learner can act on their saved items without hunting back through the journey to find them again).

## How the Complete Sales Call Walkthrough Should Connect

The Complete Sales Call Walkthrough is the Academy's eighth and final journey step — the capstone a learner reaches only after all seven modules, and the one lesson explicitly designed to reference every earlier module by name as it happens. Its position in the information architecture must reflect that: it should be the literal last step in the Learning Journey Stepper, its entry point should be its own dedicated lesson (not a different lesson standing in for it), and reaching it should feel like arrival, not like one more item in a list. Any journey configuration that points the eighth step at a different lesson, or that fails to give the Walkthrough the visual weight of a genuine capstone, works against the exact purpose this lesson was built for.

## How Future Academies Should Connect

A future Recruitment Academy, Operations Academy, or Management Academy should not be bolted onto the Sales Academy's own eight-step journey as additional steps — each is a separate, parallel journey with its own Dashboard entry, its own Learning Journey Stepper instance, and its own capstone, reusing the same information architecture pattern rather than extending this specific one. The connective tissue between academies belongs at the Dashboard level (a learner with access to more than one academy should be able to see and move between them from their single home base) and at the Search level (a global search should be able to surface relevant content across every academy a learner has access to), never by merging a second academy's modules into this Academy's own eight-step sequence.

## Related Documents

- `02_SALES_ACADEMY_PRODUCT_BLUEPRINT.md` — the product surfaces this architecture connects
- `06_SINGLE_ACADEMY_EXPERIENCE.md` — how this architecture should feel to move through, not just how it's structured
- `07_LEARNER_JOURNEY.md` — this architecture walked through as one learner's real experience, including the concrete gaps found against it
- `01_ACADEMY_UX_BIBLE.md` — the visual and structural specification this architecture is grounded in
