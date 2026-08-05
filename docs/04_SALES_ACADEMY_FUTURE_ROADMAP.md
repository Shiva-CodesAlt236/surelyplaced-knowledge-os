# Sales Academy Future Roadmap

**Status:** Canonical reference — permanent blueprint
**Applies to:** The sequencing of every future Sales Academy capability described in `01_SALES_ACADEMY_VISION.md` and `02_SALES_ACADEMY_PRODUCT_BLUEPRINT.md`
**Owner:** Chief Product Officer / Documentation Architect function
**Last updated:** 2026-08-05

This document sequences the Sales Academy's future into buildable phases. It does not commit to delivery dates — no phase below carries a timeline, because none has been approved by Sales Leadership, and inventing one would violate the same non-invention discipline the rest of this repository holds itself to. What it commits to is order: which capability depends on which other one existing first, and why building them in a different order would be a mistake. Each version is additive on top of the one before it; nothing in a later version requires undoing an earlier one.

## Version 1 — The Content-First Academy (Current)

What exists today: seven sequential Sales Academy modules, each built around realistic worked conversations rendered through the Conversation Viewer widget and its eleven companion widgets, a roleplay simulation mode letting a learner actively attempt a scenario rather than only read a recommended answer, a Learning Journey Stepper giving a module its own guided lesson sequence, and Previous/Next lesson navigation connecting the whole thing into one path. Every module opens with orientation (when to use it, what it achieves, when to move on) and bridges explicitly into the next. This version proves the Academy's central bet: that a conversation-first, widget-based teaching method produces genuinely better-prepared advisors than flat reference documentation. Everything in every later version is built on the assumption that bet was correct.

## Version 1.5 — The Home Base

The first product layer on top of Version 1's content: an Academy Home that gives a new learner an obvious starting point and a returning learner an obvious way back to where they left off, a Dashboard reflecting a learner's own real progress (never an invented or comparative statistic), and a refined Search experience surfacing existing lesson content directly for the moment a learner needs one specific answer fast rather than a full lesson replayed from the start. Version 1.5 deliberately does not introduce Learning Paths, certification, or AI capability — it exists purely to make the seven modules already built easy to enter, resume, and search, since a strong home base is a prerequisite for every capability layered on afterward.

## Version 2 — The Guided Journey

Formal Learning Paths — the New Career Advisor, Senior Career Advisor, Sales Manager, and specialist journeys already designed at the content level — become real, enrollable sequences with visible milestones, built entirely from the Version 1 content plus the wider Knowledge OS beyond the Academy itself. Progress tracking matures from lesson-level completion into path-level milestone tracking. Certification groundwork begins here at the design level only — defining what demonstrated understanding should mean for a given path — without yet exposing a graded exam to a learner; certification's actual mechanics are deliberately deferred to Version 3, since getting the guided-journey experience right matters more than rushing assessment ahead of it.

## Version 3 — Coached Practice

The AI Coach becomes real: a grounded, in-character conversation partner a learner can roleplay against dynamically, replacing Version 1's fixed-comparison roleplay model with adaptive practice that responds the way a real candidate persona would, while staying strictly grounded in the Academy's own content and never drifting into generic sales-training tropes this Academy hasn't actually taught. Certification exams go live here, built on Version 2's groundwork, kept architecturally separate from lesson content the same way it's specified in `02_SALES_ACADEMY_PRODUCT_BLUEPRINT.md`. A Manager Dashboard also ships in this version — a genuinely distinct surface from the learner Dashboard, giving a Sales Manager visibility into their team's real progress and a coaching view built from the same content advisors use, never a parallel curriculum.

## Version 5 — The Fully Coached Advisor

The most forward-looking, least certain phase, reserved for capabilities that depend on real usage data and real organizational appetite existing first. Voice AI extends the AI Coach from typed roleplay into actual spoken practice, closing the gap between practicing a conversation and actually having one out loud. Live Call Coaching — real-time or immediately post-call AI-assisted review of an advisor's actual live calls, grounded the same way the AI Coach is — is the point at which the Academy stops being purely a training environment and starts directly touching real advisor performance, which raises real questions about consent, privacy, and how feedback is delivered that must be resolved deliberately before this ships, not discovered afterward. An AI Candidate — a fully open-ended simulated candidate a learner can practice an entire call against rather than a scripted scenario — is the natural endpoint of the AI Coach's evolution, and the direct product realization of the Complete Sales Call Walkthrough's teaching pattern made interactive. Alongside these, the Recruitment Academy, Operations Academy, and Management Academy described in `02_SALES_ACADEMY_PRODUCT_BLUEPRINT.md` extend this entire platform — content framework, widget set, AI Coach, certification — to the other functions at SurelyPlaced that depend on judgment under real conditions, reusing everything built in Versions 1 through 3 rather than starting over.

## Architecture Decisions

The decision to build the Academy conversation-first, on a fixed set of purpose-built widgets rather than generic rich-text content, is the single most consequential architectural choice this roadmap depends on — it's what makes Version 3's AI Coach and Version 5's AI Candidate possible at all, since a structured conversation format is far more tractable for a grounded AI to reason about and respond within than freeform prose would be. The decision to keep certification and manager review structurally separate from lesson content, made explicit in `02_SALES_ACADEMY_PRODUCT_BLUEPRINT.md` and enforced in `03_SALES_ACADEMY_CONTENT_FRAMEWORK.md`, is the second load-bearing choice — it keeps every lesson psychologically safe to fail inside, which is a precondition for the kind of honest practice this Academy is trying to produce.

## Tradeoffs

Building Version 1 as pure content before any product layer existed means real usage data — how long a lesson actually takes, which roleplays learners actually struggle with, whether the seven-module order is genuinely optimal — doesn't exist yet to validate several of this roadmap's assumptions. That tradeoff was deliberate: shipping a genuinely good learning experience first, even without instrumentation, was judged more valuable than instrumenting a mediocre one. The corresponding cost is that Version 1.5 and Version 2's design decisions are still working from planning estimates rather than measured behavior, and should be revisited once real data exists rather than treated as permanently settled.

## Risks

An AI Coach or AI Candidate that drifts, even slightly, from the Academy's own grounded content is the single largest risk in this roadmap — it would directly undermine the trust the entire product is built to teach, not just produce a wrong answer. Live Call Coaching carries a distinct and serious risk around advisor trust and consent; introducing it without a clear, advisor-communicated policy on how feedback is used risks the Academy being experienced as surveillance rather than coaching, which would be corrosive to exactly the culture `01_SALES_ACADEMY_VISION.md` is trying to build. Certification, if its criteria are ever set loosely or inconsistently, risks becoming a credential that doesn't actually reflect real capability — undermining its own purpose the moment advisors or managers stop trusting what it signifies.

## Recommendations

Treat Version 1's seven modules as a living baseline to keep strengthening — the realism and repetition-reduction work already underway should continue as an ongoing discipline, not a one-time pass, as new lessons and future academies are added. Do not begin Version 3's AI Coach work until Version 1.5's Dashboard and Search are live and have produced real learner behavior data to design the AI Coach's grounding and retrieval against — building an AI capability on top of a product layer that itself hasn't been observed in real use is the likeliest way this roadmap's later versions would need to be redone. Resolve Live Call Coaching's consent and privacy model as its own deliberate, explicitly scoped decision well before Version 5 begins, not as an implementation detail discovered mid-build. When the Recruitment, Operations, and Management Academies are eventually scoped, staff them to genuinely reuse this platform's architecture rather than treating each as a reason to redesign the underlying product — the whole value of this roadmap's sequencing is that Versions 1 through 3 are meant to be built once and reused, not once per academy.

## Related Documents

- `01_SALES_ACADEMY_VISION.md` — the mission and non-negotiables every version above is accountable to
- `02_SALES_ACADEMY_PRODUCT_BLUEPRINT.md` — the concrete product surfaces this roadmap sequences into phases
- `03_SALES_ACADEMY_CONTENT_FRAMEWORK.md` — the content standard every future module and academy must continue to follow regardless of which version is shipping
- `docs/PROJECT_ROADMAP.md` — the repository-wide execution roadmap this document's Version 1 reflects the current state of
