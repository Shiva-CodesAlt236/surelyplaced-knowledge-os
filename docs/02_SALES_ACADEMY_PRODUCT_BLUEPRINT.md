# Sales Academy Product Blueprint

**Status:** Canonical reference — permanent blueprint
**Applies to:** Every screen, surface, and future feature of the Sales Academy product
**Owner:** Chief Product Officer / Documentation Architect function
**Last updated:** 2026-08-05

This document defines the complete Sales Academy product — every surface a learner, manager, or future engineer will encounter. It states what each surface is, why it exists, and what it must never become, in service of the mission and philosophy stated in `01_SALES_ACADEMY_VISION.md`. Where a surface is already built, this document describes it as it exists today. Where a surface is proposed but not yet built, this document is explicit about that, in the same honest, non-inventing spirit the underlying content already holds itself to — a status label is not a commitment to a delivery date, only an honest statement of what is real today.

## Academy Structure

The Academy is organized as seven sequential modules, each a real folder under `content/docs/`: Discovery, Discussion, Closing, Objection Handling, Pricing & Investment Psychology, Sales Coaching, and Sales Constitution. This sequence is not arbitrary — it mirrors the actual shape of a real SurelyPlaced sales call, from first outbound contact through to a candidate's honest decision, and it is designed to be walked start to finish, not sampled out of order. Every module's first lesson orients the learner (why this module, when to use it, when to move on) and every module's last lesson bridges explicitly into the next, so that moving through all seven feels like one continuous journey rather than seven independent references someone happened to bundle together. A learner who has been through all seven should be able to sit through the Complete Sales Call Walkthrough — the academy's capstone lesson — and recognize every phase of it as something they were personally taught, in order.

## Academy Home

The Academy's entry point, and the first impression of the whole product. Its job is to answer one question immediately: where do I start, or where was I. For a brand-new learner, that means a clear, obvious path into Discovery's opening lesson — not a flat list of seven equally-weighted modules with no implied order. For a returning learner, that means surfacing exactly where they left off. The Academy Home should never make a learner hunt for the starting point; the seven-module sequence is a designed curriculum, and the entry point should communicate that immediately, visually, before a learner reads a single word of copy.

## Dashboard

The learner's personal home base once they have real activity to show. Its only job is to reflect the learner's own real progress and real next action back to them — which module and lesson they're in, what's next, and a fast way back into the AI Coach or search once those exist. A Dashboard must never display an invented statistic, a fabricated benchmark, or a comparison to other learners dressed up as real data; where no real usage data exists yet for a given widget, the honest answer is an empty state explaining what will appear once the learner has activity, never a placeholder that could be mistaken for something real. A future Manager-facing dashboard view is a distinct surface, built for oversight and coaching rather than self-progress, and must never be built as a reskin of the learner Dashboard — the two serve fundamentally different intents and should be designed as such from the start.

## Learning Journey

The structural spine connecting every lesson inside a module into a single guided sequence rather than a flat article list — implemented today as the Learning Journey Stepper, which shows a learner where they are within a module's lesson sequence and what comes next. This is the mechanism that makes "one continuous journey," the vision's central design goal, tangible on screen rather than only true in the writing. The Learning Journey must always reflect the module's actual `meta.json` lesson order — it is a rendering of the real curriculum sequence, never a separate, hand-maintained path that could drift out of sync with the actual content.

## Module Page

A module's front door. Its job is to set expectations before a learner commits time: what this module covers, why it matters, and how it connects to the module before and after it — the same "Start Here" framing (when do I use this, what will it help me achieve, when do I move on) that now opens every module's first lesson. A Module Page should never simply be a bare list of lesson titles; a learner deciding whether to start a module needs the same orientation a good manager would give them in thirty seconds before pointing them at the material.

## Lesson Page

The unit of actual learning, and where the majority of a learner's time is spent. A Lesson Page renders one lesson's full content — objective, full worked conversation, coaching notes, common mistakes, roleplay ladder, practice exercises, and quick reference — using the Academy's interactive widget set, with Previous/Next navigation always available so a learner can move through a module without returning to the module page between every lesson. The Lesson Page's job is to make one specific, real skill land clearly through a worked example before asking the learner to try it themselves; it should never front-load abstract principle ahead of the conversation that demonstrates it.

## Conversation Viewer

The Academy's single most important widget, and the one every other widget exists to support. It renders a realistic, turn-by-turn conversation between a Sales Executive and a candidate, with support for different channels (phone, WhatsApp, cold call framing), realistic pacing through held pauses, mood and hesitation cues, and inline annotations that name what a specific line is doing and why. The Conversation Viewer exists because reading about a skill and watching that skill happen inside a real, messy conversation are fundamentally different learning experiences — the Academy is built conversation-first specifically because this widget makes that possible. Every other widget (Decision Point, Coaching Notes, Manager Tip) exists to add a layer of reflection around a Conversation Viewer, never to replace one.

## Roleplay

The mechanism by which a learner moves from watching a skill to attempting it themselves, delivered today as an interactive two-step simulation: a scenario and a role to play, followed by a comparison against a recommended answer and the reasoning behind it. Every lesson's roleplay ladder deliberately spans three difficulties — an easy version, a medium version, a hard version of essentially the same underlying skill — so that difficulty is a visible, deliberate design choice a learner can feel progressing through, not an accident of which persona happened to be used. Roleplay is practice with a safety net, never a graded test; a learner should be able to attempt the hardest roleplay in a lesson and get it wrong without that being recorded anywhere as a failure.

## Practice

The reflective complement to Roleplay — a shorter, written-response exercise (a line to write, a question to answer) paired with a model answer, designed for a learner who wants to actually produce something in their own words rather than only compare their instinct against a scripted roleplay. Practice exercises exist because writing a response, even briefly, engages a different kind of recall than reading one — a learner who has typed out their own version of a difficult line remembers it under real pressure better than one who only read someone else's.

## AI Coach

Proposed, not yet built. The AI Coach is the natural next evolution of Roleplay: instead of comparing a learner's attempt against one fixed recommended answer, a grounded AI Coach could respond dynamically as the candidate persona would, in character, and give feedback afterward on specifically what worked and what to try differently — genuinely adaptive practice rather than a fixed script. Its non-negotiable constraint, inherited directly from `01_SALES_ACADEMY_VISION.md`'s AI Philosophy, is that it stays grounded in the Academy's own actual conversation patterns, personas, and standards; it must never invent a generic sales-training persona or technique this Academy hasn't actually taught. Until this exists, Roleplay's fixed-comparison model remains the product's real, honest practice mechanism — the AI Coach should be understood as an enhancement to that mechanism, not a prerequisite for it to be valuable.

## Progress

The system of record for what a learner has actually completed, referenced by the Dashboard, the Learning Journey, and any future Manager view. Progress must always be genuinely earned — either explicit completion or reliable, honest automatic detection — and a failed write to Progress must be retried or surfaced, never silently dropped, since a lost completion record would desynchronize everything downstream that depends on it (the Learning Journey's sense of "where am I," the Dashboard's Continue card, a future Manager's view of team status). Progress tracks a learner's own real activity only; it is never the basis for an invented comparison to other learners' progress in a self-facing surface.

## Certification

Proposed, not yet built, and deliberately kept separate from lesson content itself. Where the Academy eventually offers certification, it must reflect demonstrated understanding at a point in time — never effort, never time spent, and never phrased in a way that implies a guarantee of future sales performance, consistent with the no-guarantee discipline the underlying content already enforces everywhere else. Critically, certification and any graded assessment mechanism live entirely outside individual lesson pages — a lesson never contains a scored quiz or a manager scorecard embedded inside it. This separation is deliberate product architecture, not an oversight: a learner reading and practicing a lesson should never feel like they are simultaneously being graded on it, and a future certification exam is free to draw on lesson content for its questions without lesson content ever needing to anticipate being tested.

## Search

The mechanism for finding something specific outside a learner's current guided path — for the moment right before a real call when an advisor needs one specific answer fast, not a full lesson replayed from the start. Search returns real, existing lesson and reference content directly; it never generates or paraphrases an answer of its own, which is what distinguishes it from a future AI Coach or Assistant. Search and any future grounded AI capability are complementary, not competing: Search finds the article, an AI capability would synthesize a cited answer from articles Search could equally well have returned — the two should always draw from exactly the same underlying content, never diverging sources of truth.

## Navigation

The connective tissue holding the whole Academy together as one product rather than a folder of independent pages: a persistent way to see the full module sequence, breadcrumbs showing a learner exactly where they are, and Previous/Next controls that respect each module's real lesson order. Navigation's guiding rule is that a learner should never have to guess what comes next or backtrack to a module page just to move forward — the product should always make the next right action obvious.

## Learning Paths

A Learning Path sequences existing modules into a journey suited to a specific role or tenure — a New Career Advisor path, a Senior Career Advisor path, a Sales Manager path, and further specialist paths, each already designed at the content level. A Learning Path never introduces new content of its own; it is purely a proposed ordering and milestone structure layered on top of the same seven Sales Academy modules (and, for more advanced paths, the wider Knowledge OS content beyond the Academy itself). Paths exist because not every learner needs the same journey through the same material at the same depth — a brand-new advisor and a tenured advisor stepping into a management track have genuinely different starting points and genuinely different destinations.

## Future Expansion

### Recruitment Academy

A parallel academy teaching the judgment behind sourcing, screening, and qualifying candidates before they ever reach a Sales Executive — the recruitment-side counterpart to everything the Sales Academy teaches about the conversation itself. It would reuse this same product blueprint's shape (its own module sequence, its own Complete Call Walkthrough-equivalent capstone, its own persona continuity) rather than being designed from scratch.

### Operations Academy

A parallel academy teaching the internal-process judgment that keeps a candidate's journey moving correctly once they're engaged — handoffs, documentation discipline, escalation judgment, the operational half of the Knowledge OS's existing `sales-operations` content, elevated into the same guided, conversation-and-scenario-driven learning shape as the Sales Academy rather than left as flat reference material.

### Management Academy

A parallel academy teaching the specifically different judgment a Sales Manager needs — coaching a struggling advisor, reviewing a real call honestly, having the harder conversations management itself requires. This is distinct from a Sales Manager simply completing the existing Sales Academy at a deeper level (already covered by the Sales Manager Learning Path); a Management Academy would teach the act of managing itself, not sales technique from a manager's vantage point.

Each future academy is understood to be additive to this product blueprint, not a reason to redesign it — a new academy is new content and a new module sequence riding on the same Lesson Page, Conversation Viewer, Roleplay, and Progress mechanisms already defined above, the same way `docs/FUTURE_EXPANSION_GUIDE.md` already describes how the wider Knowledge OS scales without its architecture needing to be redesigned at every stage of growth.

## Related Documents

- `01_SALES_ACADEMY_VISION.md` — the mission and philosophy every surface in this document exists to serve
- `03_SALES_ACADEMY_CONTENT_FRAMEWORK.md` — the writing standard behind everything a Lesson Page and Conversation Viewer render
- `04_SALES_ACADEMY_FUTURE_ROADMAP.md` — the sequencing of which of these surfaces gets built when
- `docs/LEARNING_COMPONENT_SPEC.md`, `docs/DASHBOARD_EXPERIENCE.md`, `docs/AI_ASSISTANT_BLUEPRINT.md`, `docs/LEARNING_PATHS.md` — deeper implementation-level detail behind several of the surfaces named above
