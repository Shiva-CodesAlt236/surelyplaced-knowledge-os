# AI Assistant Blueprint

**Status:** Design proposal — not yet built
**Applies to:** The proposed future AI Assistant embedded in the Career Advisor Academy
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document designs a proposed AI Assistant under one non-negotiable constraint: it answers only using this repository's own content, never from the underlying model's general training knowledge. Every design decision below exists to enforce that constraint, not merely to describe a helpful chat feature. Nothing in this document has been implemented.

## Grounding

The Assistant is proposed to be grounded exclusively in `content/docs/` — every Sales Academy module, every Candidate Intelligence Role Collection, and every `*-intelligence` expansion module. It is explicitly proposed to never draw on the underlying language model's general knowledge to answer a substantive question about Surely Placed process, pricing, candidates, or hiring practice, even where the model might "know" a plausible-sounding general answer. This mirrors the exact discipline `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §1 already requires of every human-authored article: where the repository doesn't contain an authoritative answer, the Assistant says so rather than inventing one.

## Retrieval

Proposed retrieval pulls only from published `content/docs/` articles, using the same structural metadata the rest of this platform layer relies on — `tags`, module and folder membership, and the `related` field — rather than a generic unstructured retrieval pass. Where a learner is inside a specific module (per the AI Assistant field proposed in `docs/MODULE_INDEX_STANDARD.md`), retrieval is proposed to weight that module's own content more heavily, without excluding a genuinely relevant answer that lives elsewhere in the repository.

## Citation

Every substantive Assistant response is proposed to cite the specific article (or articles) it drew from, using the same `/docs/<folder>/<slug>` link format already standard throughout the repository per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §7. A response with no citation is proposed to be treated as a signal the Assistant is not actually grounded for that answer — see Unknown-Answer Behaviour below — rather than presented as if it were.

## Context Selection

Proposed context selection draws on three signals, where available: the module or article the learner is currently viewing, the learner's active Learning Path (per `docs/LEARNING_PATHS.md`), and the learner's own conversation history within the current session. None of these signals is proposed to let the Assistant answer from outside `content/docs/` — they narrow *which* repository content is most relevant, never *whether* the Assistant can go beyond the repository.

## Conversation Memory

Proposed to persist within a single session (so a learner can ask a follow-up question without repeating context) and optionally across sessions if a learner is signed in, surfaced similarly to Recent Searches in `docs/SEARCH_EXPERIENCE.md`. Conversation memory is proposed to store only the conversation itself, never to become a second, informal source of "learned" facts the Assistant treats as authoritative — every answer is proposed to be re-grounded in actual repository content each time, not accumulated from prior conversation as if it were a fact base.

## Suggested Prompts

Proposed to be context-aware — for example, on a Role Collection's overview page, suggesting "What are common objections for this role type?" rather than a generic prompt. This document does not propose a fixed universal prompt list, for the same reason `docs/SEARCH_EXPERIENCE.md` doesn't propose one for Suggested Searches: a useful list should be derived from what learners actually ask once the Assistant exists, not guessed at now.

## Unknown-Answer Behaviour

This is the Assistant's most important proposed behavior. Where the repository doesn't contain a clear answer to a question, the Assistant is proposed to say so explicitly and point to the same **Operational Policy Pending** pattern and "the latest approved internal process" language `content/docs/` already uses throughout, rather than generating a plausible-sounding answer from general knowledge. This applies with particular force to exactly the categories `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §11–14 already protects: pricing, guarantees, statistics, and policy specifics the repository doesn't define. The Assistant is proposed to never fill those gaps on its own initiative, regardless of how confidently the underlying model could otherwise answer.

## Future MCP Compatibility

Proposed, conceptual only: this Assistant could eventually be exposed as an MCP-compatible tool, allowing another agent or interface to query the same grounded retrieval layer described above. This document does not specify a protocol, schema, or implementation — it notes the possibility so a future implementation phase isn't designed in a way that forecloses it, consistent with how `docs/FUTURE_EXPANSION_GUIDE.md` treats future extensibility generally: additive, not a reason to redesign what's already specified here.

## Relationship to Search

As stated in `docs/SEARCH_EXPERIENCE.md`, the Assistant and search are complementary. Search returns articles for a learner to read; the Assistant synthesizes a grounded, cited answer from those same articles. A learner should be able to move freely between the two, and every Assistant citation should be a valid Search result in its own right — the two experiences are proposed to draw from exactly the same underlying content, never diverging sources of truth.

## Related Documents

- `docs/CAREER_ADVISOR_ACADEMY.md` — the Future AI Integration vision this blueprint implements
- `docs/SEARCH_EXPERIENCE.md` — the complementary, non-synthesizing search experience
- `docs/MODULE_INDEX_STANDARD.md` — the per-module AI Assistant entry point
- `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` — the non-invention rules this Assistant's Unknown-Answer Behaviour directly inherits
