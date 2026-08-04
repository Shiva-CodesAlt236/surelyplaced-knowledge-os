# Module Index Standard

**Status:** Design proposal — not yet built
**Applies to:** How every module under `content/docs/` should eventually be surfaced by the Career Advisor Academy
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document proposes a universal set of fields every module should eventually expose to the Academy platform. It is a target standard, not something applied to any existing file by this document — no frontmatter has been changed, and no field described below has actually been added to any article. A future, explicitly scoped enrichment sprint would be required to add the fields this document proposes that don't already exist.

## What Already Exists vs. What's Proposed

Some of the twelve fields below already exist in some form in every module, because `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` already requires it. Others are genuinely new and would need to be added. This distinction matters — it's the difference between "surface what's already there" and "build something new."

| Field | Status | Existing Source |
|---|---|---|
| Overview | Already exists | Every module's `overview.mdx` (or equivalent entry article) |
| Learning Objectives | Proposed, new | Would require a new frontmatter field; no article currently states objectives explicitly |
| Reading Time | Proposed, new | Would be computed, not authored — see below |
| Difficulty | Proposed, new | Would require a new frontmatter field |
| Prerequisites | Partially exists | `related` frontmatter and `## Related Articles` capture adjacency, not formal prerequisite ordering |
| Related Modules | Already exists | `related` frontmatter and `## Related Articles` / `## Cross-Module Alignment` |
| Call Scripts | Proposed, new | See `docs/LIVE_CHAT_SCRIPT_FRAMEWORK.md` for the adjacent, not-yet-built script layer |
| Practice | Proposed, new | See `docs/ASSESSMENT_FRAMEWORK.md`'s Role Plays and Scenario Tests |
| Quiz | Proposed, new | See `docs/ASSESSMENT_FRAMEWORK.md`'s Knowledge Checks and Quizzes |
| Checklist | Already exists | Nearly every module already ends in a `*-checklist.mdx` article (e.g. `role-checklist.mdx`, `interview-intelligence-checklist.mdx`) |
| Bookmarks | Proposed, new | Platform/session feature — see `docs/UI_NAVIGATION_BLUEPRINT.md` |
| AI Assistant | Proposed, new | See `docs/AI_ASSISTANT_BLUEPRINT.md` |
| Completion Status | Proposed, new | Platform/session feature — see `docs/UI_NAVIGATION_BLUEPRINT.md` |

## Field Definitions

**Overview.** The module's entry-point article, already present as `overview.mdx` in every Role Collection and `*-intelligence` module, or as the first article listed in a Sales Academy module's `meta.json`. No new content required — the Academy surfaces the existing file.

**Learning Objectives.** A proposed short, bulleted statement of what a learner should be able to do after completing the module — phrased as capability, not just topic coverage. Proposed as a new frontmatter field (`learning_objectives: []`) rather than a rewrite of the `## Purpose` section, since Purpose already serves a different function per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §6.

**Reading Time.** Proposed to be computed from actual word count at build time (a formula, not an authored field), consistent with the planning-estimate discipline in `docs/LEARNING_PATHS.md` — this repository does not invent a reading-time figure by hand for any individual article.

**Difficulty.** A proposed three-tier taxonomy — Foundational, Intermediate, Advanced — assigned per module, not per article, to keep the taxonomy small and stable. Assignment would be a deliberate editorial judgment made during a future enrichment sprint, not something this document assigns preemptively for any specific module.

**Prerequisites.** A proposed structured field distinct from `related`: where `related` (per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §8) means "relevant to read alongside," Prerequisites would mean "should be completed before this module, per a Learning Path." This is a Learning Path–level concept — see `docs/LEARNING_PATHS.md`'s completion-order sequencing — more than a per-article one, and would likely be modeled at the module level rather than added to every article's frontmatter individually.

**Related Modules.** Already substantially present via the `related` frontmatter field and the `## Related Articles` / `## Cross-Module Alignment` sections every article already carries. The Academy would surface this existing data rather than collect anything new.

**Call Scripts.** A proposed link from a module to the live-chat scripts relevant to it, once `docs/LIVE_CHAT_SCRIPT_FRAMEWORK.md`'s framework is actually populated with scripts — which it explicitly is not, as of this document. Until scripts exist, this field would simply be empty for every module.

**Practice.** A proposed link to any Scenario Test or Role Play defined in `docs/ASSESSMENT_FRAMEWORK.md` that draws on this module's content.

**Quiz.** A proposed link to the module's Knowledge Check or Quiz, per `docs/ASSESSMENT_FRAMEWORK.md`.

**Checklist.** Already present in nearly every module as a dedicated closing checklist article — `role-checklist.mdx` in every Role Collection, `*-intelligence-checklist.mdx` in every `*-intelligence` module, and an equivalent closing checklist in most Sales Academy modules. The Academy surfaces this existing file directly; it does not require a new one.

**Bookmarks.** A proposed per-user, per-article saved-state feature, described in `docs/UI_NAVIGATION_BLUEPRINT.md` and `docs/SEARCH_EXPERIENCE.md`. This is session/account state, not content, and requires no change to any article.

**AI Assistant.** A proposed per-module entry point into the grounded assistant defined in `docs/AI_ASSISTANT_BLUEPRINT.md`, scoped so a learner can ask questions about the module they're currently in with that module's content weighted in retrieval.

**Completion Status.** A proposed per-user, per-module state (not started / in progress / complete) tracked by the platform, not stored in the content itself. Described further in `docs/UI_NAVIGATION_BLUEPRINT.md`.

## Applying This Standard

This standard would apply uniformly to every module type already present in the repository — Sales Academy modules, Role Collections under `candidate-intelligence/`, and the `*-intelligence` expansion modules — without requiring any of them to change shape. A future module (per `docs/FUTURE_EXPANSION_GUIDE.md`'s scaling guidance) would be expected to satisfy this standard from its first sprint rather than requiring retrofitting later, once this standard is formally adopted.

## Related Documents

- `docs/CAREER_ADVISOR_ACADEMY.md` — the platform vision this standard supports
- `docs/LEARNING_PATHS.md` — where Prerequisites and completion ordering actually get used
- `docs/ASSESSMENT_FRAMEWORK.md` — the Practice and Quiz fields' underlying mechanics
- `docs/AI_ASSISTANT_BLUEPRINT.md` — the AI Assistant field's underlying mechanics
- `docs/UI_NAVIGATION_BLUEPRINT.md` — where Bookmarks and Completion Status are rendered
