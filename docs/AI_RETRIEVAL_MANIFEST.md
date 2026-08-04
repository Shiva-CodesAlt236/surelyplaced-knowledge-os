# AI Retrieval Manifest

**Status:** Implementation asset — first Implementation Sprint deliverable
**Applies to:** The implementation-ready retrieval pipeline behind `docs/AI_ASSISTANT_BLUEPRINT.md`
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document specifies how the AI Assistant's Grounding, Retrieval, and Unknown-Answer Behaviour — all already designed in `docs/AI_ASSISTANT_BLUEPRINT.md` — would actually be implemented as a pipeline. It does not change any of that document's proposed behavior; it adds the chunking, metadata, and threshold detail needed to build it. Every constraint here exists in service of the same non-negotiable rule `docs/AI_ASSISTANT_BLUEPRINT.md` states: the Assistant answers only from `content/docs/`, never from the underlying model's general knowledge.

## Chunk Strategy

Proposed to chunk at the `##` section boundary — Purpose, Scope, Core Content, and so on for the standard seven-section shape, or a module's own bespoke sections (for example, `## Common Mistakes` in `content/docs/objections/`) — rather than a fixed token-count window. Section-boundary chunking is proposed because `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §6 already guarantees every article uses a consistent, semantically meaningful heading structure, making the heading itself a natural, already-authored chunk boundary rather than one this pipeline would need to invent. A section that is unusually long (uncommon, but possible) is proposed to sub-chunk at paragraph boundaries within that section, always preserving the parent heading as chunk metadata so a retrieved sub-chunk still carries its full context.

## Metadata

Every chunk carries the following metadata, all sourced from existing article data or the `docs/CONTENT_MANIFEST.md` manifest record — no metadata field here requires new content authoring:

| Field | Source |
|---|---|
| `articleId` | The article's route path, per `docs/ROUTE_REGISTRY.md` |
| `moduleId` | Per `docs/CONTENT_MANIFEST.md` |
| `sectionHeading` | The `##` heading this chunk belongs to |
| `articleTitle` | Frontmatter `title` |
| `tags` | Frontmatter `tags` |
| `roleCategory` | Per `docs/SEARCH_TAXONOMY.md`, where applicable |
| `aiRetrievalCategory` | Per `docs/SEARCH_TAXONOMY.md`'s AI Retrieval Categories (Factual, Situational, Definitional, Red-Flag Identification, Cross-Module), once a future enrichment sprint populates it — unpopulated today |
| `disclaimerLabel` | Where the chunk contains a Composite Case Study, Anonymized Real Conversation, Training Simulation, or Illustrative Only marker per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §9 | 

The `disclaimerLabel` field exists specifically so the Assistant's synthesis step (see Grounding below) can carry a hypothetical example's disclaimer forward into its own response rather than presenting a composite case study's detail as if it were a real, specific fact.

## Context Windows

Proposed retrieval returns a bounded number of top-ranked chunks per query — this document does not propose a specific count, since that's a tuning decision dependent on the model actually used and its context limit, an implementation detail outside this sprint's product-architecture scope. What this document does specify: retrieved chunks are proposed to always include their full metadata (particularly `sectionHeading` and `articleId`) alongside the chunk text itself, so the generation step has what it needs to produce the Citation Rules below without a separate lookup step.

## Grounding

Implementation of `docs/AI_ASSISTANT_BLUEPRINT.md`'s Grounding constraint: the generation step is proposed to receive only the retrieved chunks and the learner's question as input — never a general system prompt inviting the model to supplement with outside knowledge. The generation prompt is proposed to explicitly instruct the model to answer using only the provided chunks and to trigger Unknown-Answer Behaviour (see below) where the provided chunks don't contain a sufficient answer, rather than allowing the model's own judgment to decide when outside knowledge is acceptable.

## Citation Rules

Every substantive response is proposed to cite the specific `articleId` (resolved to the standard `/docs/<folder>/<slug>` link format per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §7) of every chunk the response actually drew from — not every chunk retrieved, only those the generated answer actually used. A response citing zero articles is treated as a signal the response is not grounded (see Refusal Behaviour below), consistent with `docs/AI_ASSISTANT_BLUEPRINT.md`'s Citation section. Where a cited chunk carries a `disclaimerLabel`, the response is proposed to carry that same disclaimer forward in its own text, never presenting composite or illustrative material as an actual, specific fact.

## Refusal Behaviour

Implementation of `docs/AI_ASSISTANT_BLUEPRINT.md`'s Unknown-Answer Behaviour: where retrieval returns no chunk above the Similarity Threshold (see below), or where the generation step cannot produce a citation-backed answer from the chunks it did retrieve, the Assistant is proposed to return a fixed-pattern deferral rather than a generated best-effort answer — pointing to the same **Operational Policy Pending** and "the latest approved internal process" language `content/docs/` already uses. This deferral is proposed to be a template response, not a model-generated one, specifically so it can never itself drift into inventing a plausible-sounding non-answer.

## Hallucination Prevention

Beyond Grounding and Refusal Behaviour above, this document proposes one additional implementation-level safeguard: a post-generation check comparing every factual claim's cited `articleId` against the chunks actually provided to the generation step, rejecting (and falling back to Refusal Behaviour for) any response that cites an article never retrieved for that query. This catches a model fabricating a plausible-sounding citation rather than only trusting the model's citation behavior at face value. This document does not propose a technique beyond this citation-consistency check — more advanced hallucination-detection methods are an implementation decision for whichever team builds this pipeline, evaluated against `docs/DEPLOYMENT_READINESS_CHECKLIST.md`'s Search and AI Assistant Readiness gate before shipping.

## Similarity Thresholds

Proposed as a minimum relevance score a retrieved chunk must meet to be considered for generation — below this threshold, a chunk is treated as not relevant enough to answer the question, which is what triggers Refusal Behaviour when no chunk clears it. This document does not propose a specific numeric threshold value, since a meaningful value depends on the specific embedding or ranking model chosen at implementation time, which this sprint does not select. What this document does specify: the threshold is proposed to be tuned conservatively — favoring an unnecessary deferral over a low-confidence answer — consistent with `docs/AI_ASSISTANT_BLUEPRINT.md`'s framing that Unknown-Answer Behaviour is the Assistant's most important proposed behavior, not a fallback to minimize.

## Retrieval Pipeline

The end-to-end proposed sequence, tying every section above together:

1. **Query received** — from the Ask AI Panel, optionally with a `moduleId` context per `docs/ROUTE_REGISTRY.md`'s `/ai?context=[moduleId]` route.
2. **Context-weighted retrieval** — chunks are ranked for relevance to the query, with chunks whose `moduleId` matches the current context (if any) weighted more heavily, per `docs/AI_ASSISTANT_BLUEPRINT.md`'s Context Selection — never excluding a genuinely relevant chunk from outside that module.
3. **Threshold filtering** — chunks below the Similarity Threshold are discarded.
4. **Refusal check** — if zero chunks remain, return the Refusal Behaviour template response and stop.
5. **Generation** — the remaining chunks and the query are passed to the generation step under the Grounding constraint above.
6. **Citation-consistency check** — per Hallucination Prevention above; a response citing an unretrieved article is discarded in favor of the Refusal Behaviour response.
7. **Response returned** — with inline citations resolved to real `/docs/<folder>/<slug>` links, any carried-forward disclaimer labels intact, and (where enabled) added to Conversation Memory per `docs/AI_ASSISTANT_BLUEPRINT.md`.

## Related Documents

- `docs/AI_ASSISTANT_BLUEPRINT.md` — the design this pipeline implements without altering
- `docs/SEARCH_TAXONOMY.md` — the AI Retrieval Categories chunk metadata draws from
- `docs/KNOWLEDGE_GRAPH.md` — the AI Retrieval Graph this pipeline's context-weighting step traverses
- `docs/DEPLOYMENT_READINESS_CHECKLIST.md` — the Search and AI Assistant Readiness gate this pipeline must clear before deployment
