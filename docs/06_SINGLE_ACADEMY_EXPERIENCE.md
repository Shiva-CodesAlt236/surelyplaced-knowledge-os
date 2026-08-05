# Single Academy Experience

**Status:** Canonical reference — permanent blueprint
**Applies to:** The Sales Academy as one unified product experience, across every surface named in `02_SALES_ACADEMY_PRODUCT_BLUEPRINT.md` and `05_ACADEMY_INFORMATION_ARCHITECTURE.md`
**Owner:** Chief Product Officer / Chief Learning Officer function
**Last updated:** 2026-08-05

This document exists to answer one question: does the Sales Academy feel like one product, or like seven modules of documentation someone happened to bundle together. The test is simple and behavioral, not aesthetic. A learner finishing a lesson should feel the same thing a Duolingo learner feels finishing a lesson — a small, real sense of "I'm progressing" — not the feeling of having closed one more browser tab of reference material. A learner should never be able to tell, from the experience alone, that Discovery and Sales Constitution were written months apart, or that one module has more polish than another. Every surface below is designed against that single test.

## Why This Framing Matters

Documentation is consulted. A course is progressed through. The Sales Academy's content is genuinely excellent as documentation — accurate, honest, well-organized — but excellent documentation alone produces the wrong learner feeling if the product around it doesn't also commit to the course feeling. HubSpot Academy, Duolingo, and Coursera all solve the same underlying problem in different domains: they take material that could have been a static reference and wrap it in a structure that makes progress visible, momentum felt, and mastery something a learner can point to. That wrapping is not decoration on top of the content — it is the difference between a learner reading a lesson once and a learner actually returning tomorrow.

## Academy Home

The learner's first impression, and it must commit fully to the course framing from the very first screen — a welcome that names the journey ahead, not a folder listing of seven links. Where a learner has no history, Academy Home's job is to make starting feel like enrolling in something with a beginning, middle, and end, not opening a random first page of a reference manual.

## Dashboard

The same page, once a learner has real activity — this is deliberate, not a limitation. A returning learner should land somewhere that immediately answers "where was I and what's next" without requiring a second click to get their bearings, the same way opening Duolingo immediately shows a learner their streak and their next lesson rather than a menu they have to interpret first.

## Journey

The visual spine that makes the whole seven-module-plus-capstone structure legible at a glance — eight steps, each with a clear state (done, current, ahead), each estimated honestly, each one tap away. The Journey is what turns "I have completed some articles" into "I am on step four of eight" — a categorically different, more motivating feeling, and the single highest-leverage piece of course framing in the entire product.

## Lesson

Where the actual teaching happens, and where the course feeling is most at risk of collapsing back into "reading docs" if the lesson page doesn't carry its own sense of position and momentum. Every lesson should open by orienting the learner (what step of the journey this is, roughly how long it takes) and close by making the next action obvious and inviting, never leaving a learner to figure out on their own whether they're done or what comes next.

## Practice

The moment a lesson stops being something a learner watches and becomes something they do. Practice should feel low-stakes and immediate — a short prompt, a real attempt, a model answer to compare against right away — never gated behind a separate "start practice mode" ceremony that breaks the flow of the lesson a learner was just reading.

## Roleplay

The Academy's version of Duolingo's exercise loop: a scenario, an attempt, immediate comparison against a strong answer, and the option to try again. Roleplay's difficulty ladder — easy, medium, difficult versions of the same underlying skill — is what gives a learner the feeling of leveling up within a single lesson, not just finishing it. The retry action matters more than it might seem: a learner who can immediately try a hard roleplay again after seeing the recommended answer is being taught that mastery is iterative, not pass/fail on the first attempt.

## Mastery

The felt sense, by the end of a module, that a learner didn't just read about a skill but can actually do it — reinforced by the module's closing checklist lesson, its four-dimension completion tracker (read, practiced, roleplayed, and eventually assessed), and the visual completion state the Journey reflects back once every lesson in a step is done. Mastery should always be earned through the lesson's own roleplay and practice content, never asserted by the product without the learner having actually done the work that justifies it.

## Certification

Kept deliberately outside lesson content itself, per `02_SALES_ACADEMY_PRODUCT_BLUEPRINT.md`, but very much part of the single-product feeling once it exists — the moment a learner's demonstrated understanding is formally recognized, the way a Coursera course culminates in a certificate that means something because the course leading up to it was genuinely rigorous. Certification's credibility depends entirely on the seven modules and the capstone actually having taught the material it certifies; it should never be introduced as a shortcut that lets the product feel more complete without the underlying teaching actually supporting it.

## Future AI Coach

The evolution of Roleplay from a fixed comparison into a dynamic, in-character practice partner — the single feature most likely to make the Academy feel alive rather than authored once and left static, since it responds to a learner in the moment rather than replaying the same fixed script every time. Its role in the single-product feeling is significant: a learner who can practice against something that reacts is far more likely to feel like they're training than reading, which is the entire thesis of this document realized as fully as this product can take it.

## Navigation

The quiet infrastructure that either sustains the course feeling or breaks it constantly. Every page should communicate three things at a glance: where the learner is, what they just did, and what's next — breadcrumbs for the first, a completion or progress signal for the second, and a single clear primary action for the third. Navigation that requires a learner to leave a lesson and manually reorient themselves at a module page, more than rarely, is navigation that's quietly reintroducing the "documentation" feeling this whole document exists to prevent.

## Lesson Lifecycle

A lesson moves through a consistent arc regardless of which module it's in: not started, in progress (opened but not yet marked complete), and complete — with completion reflecting genuine engagement (reaching the end, or an explicit mark-complete action) rather than merely having been visited once. A lesson's state should be visible from everywhere it's referenced — the module's own sequence, the Journey step it belongs to, and Continue Learning — and those three reflections must always agree; a lesson that shows complete in one place and incomplete in another breaks the trust the whole progress system depends on.

## Module Lifecycle

A module moves from not started, to in progress (at least one lesson complete, not all), to complete (every lesson in its sequence complete) — and completing a module is the event that should visibly advance the learner's position on the Journey, not a quiet internal state change nothing on screen reflects. A module's completion should feel like a real milestone, not an incidental byproduct of having clicked through its lessons — this is the moment closest to Duolingo's unit-complete celebration, and the product should treat it with the same weight.

## Progress Lifecycle

The learner's own real activity — lessons completed, current module, last active lesson — captured once and reflected consistently everywhere the product references progress, never recomputed differently in different places. Progress must persist reliably across sessions, since a learner who returns tomorrow and finds their progress reset has lost the single thing that made the product feel like a course rather than a stateless folder of articles. Where progress genuinely cannot be determined (a brand-new learner, a signed-out session), the honest empty state is always preferred over a fabricated starting point — consistent with the non-invention discipline the whole Knowledge OS already holds itself to, extended here to product state rather than only written content.

## Related Documents

- `05_ACADEMY_INFORMATION_ARCHITECTURE.md` — the structural map this experience is built on top of
- `02_SALES_ACADEMY_PRODUCT_BLUEPRINT.md` — the individual surfaces this document asks to feel like one product
- `07_LEARNER_JOURNEY.md` — this single-product feeling tested against one learner's real month-long experience
- `02_LEARNING_EXPERIENCE_GUIDELINES.md` — the underlying lesson-level learning loop this experience wraps
