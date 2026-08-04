# AI Experience

**Status:** Design proposal — not yet built
**Applies to:** The product-level user experience of the AI Assistant, extending `docs/AI_ASSISTANT_BLUEPRINT.md`'s grounding design with the actual interaction flow
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

`docs/AI_ASSISTANT_BLUEPRINT.md` already defines the Assistant's non-negotiable constraint — grounded exclusively in `content/docs/`, with defined behavior for Grounding, Retrieval, Citation, Context Selection, Conversation Memory, Suggested Prompts, and Unknown-Answer Behaviour. This document does not restate any of that design; it specifies how a learner actually experiences it, screen by screen.

## Ask AI

The primary interaction point, available from the Ask AI Panel (`docs/SCREEN_INVENTORY.md`) and from a scoped entry point on every Lesson Page (`docs/MODULE_EXPERIENCE.md`). A learner types a free-text question; the panel shows a loading state, then either a grounded answer with citations or an explicit deferral — never a blank or ambiguous result.

## Suggested Questions

Rendered above the input field before a learner types anything, sourced from `docs/AI_ASSISTANT_BLUEPRINT.md`'s Suggested Prompts design. Product detail: suggestions are proposed to update based on where the learner opened Ask AI from — three or four questions relevant to the current article if opened from a Lesson Page, or broader onboarding-relevant questions if opened from the Dashboard during a learner's first sessions.

## Context

Visually, the panel is proposed to show a small, dismissible indicator of what context is currently informing retrieval — for example, "Answering with focus on: Resume Intelligence" when opened from that module — so a learner understands why an answer leans toward certain content, per `docs/AI_ASSISTANT_BLUEPRINT.md`'s Context Selection. A learner can clear this context to ask a broader, repository-wide question instead.

## Sources

Every grounded answer is proposed to display its source articles as a distinct, visually separated list beneath the answer text — not just inline links within the answer, but a dedicated "Sources" section, making it immediately clear the answer isn't the Assistant's own unsupported claim but a synthesis of specific, named articles.

## Citations

Each source in the Sources list is a real link to the actual article at its `/docs/<folder>/<slug>` path, per `docs/AI_ASSISTANT_BLUEPRINT.md`'s Citation design. Product detail: a citation is proposed to show enough context (the article title and the specific section it drew from, where determinable) that a learner can judge relevance before clicking through, not just a bare link.

## Related Articles

Distinct from Sources: beneath a grounded answer, a proposed "You might also find these useful" list surfaces articles adjacent to the cited sources — drawn from those sources' own existing `related` frontmatter and `## Related Articles` sections, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §8 — rather than the Assistant independently deciding what's related.

## Conversation Memory

Within a session, a learner can ask a follow-up question without repeating context, per `docs/AI_ASSISTANT_BLUEPRINT.md`'s Conversation Memory design. Product detail: the panel is proposed to visually thread a conversation (question, answer, follow-up question, follow-up answer) the way any modern chat interface does, and a learner can start a fresh conversation explicitly rather than the panel silently carrying forward context indefinitely.

## Escalation

Where the Assistant defers under Unknown-Answer Behaviour (below), the panel is proposed to offer a next step rather than a dead end: for a Career Advisor, a prompt to ask their Sales Manager; for any learner, a prompt to flag the question for review, feeding into the same kind of gap-identification process that already surfaces findings in this repository's own QA process (`docs/MASTER_QA_PLAYBOOK.md`). Escalation never means the Assistant itself attempts a best-guess answer — it means routing the human to the right next step, the same "route rather than resolve" discipline already used throughout `content/docs/`'s red-flags articles.

## Unknown Answers

The most important experience to get right. Where `docs/AI_ASSISTANT_BLUEPRINT.md`'s Unknown-Answer Behaviour triggers, the panel is proposed to state plainly that the repository doesn't contain a clear answer to this specific question, using the same tone `content/docs/` articles already use for an **Operational Policy Pending** gap — direct and honest, not apologetic filler — and to immediately offer the Escalation path above rather than leaving the learner stuck. This is proposed to be visually distinct from a normal grounded answer (a different visual treatment, not just different text) so a learner can never mistake a deferral for a real, sourced answer.

## Related Documents

- `docs/AI_ASSISTANT_BLUEPRINT.md` — the underlying grounding, retrieval, and non-invention design this experience implements
- `docs/MODULE_EXPERIENCE.md` — where the scoped, per-article Ask AI entry point is used
- `docs/SEARCH_PRODUCT.md` — the complementary AI Search mode, distinct from this conversational experience
- `docs/MASTER_QA_PLAYBOOK.md` — the QA discipline Escalation connects gap-identification back to
