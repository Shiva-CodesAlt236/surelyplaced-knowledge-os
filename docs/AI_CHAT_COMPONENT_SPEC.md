# AI Chat Component Spec

**Status:** Implementation specification — Milestone 3D, final documentation sprint before implementation
**Applies to:** Every component behind the Ask AI Panel and AI Conversation History Page
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document gives full component contracts to the AI Assistant's chat surface, already designed in `docs/AI_ASSISTANT_BLUEPRINT.md` and `docs/AI_EXPERIENCE.md` and given a retrieval pipeline in `docs/AI_RETRIEVAL_MANIFEST.md`. It does not redesign grounding, retrieval, or the non-negotiable content-only-from-`content/docs/` constraint — those remain fully owned by `docs/AI_RETRIEVAL_MANIFEST.md`; this document specifies the components that surface that pipeline to a learner.

## Conversation Layout

**Purpose.** The overall structure of the Ask AI Panel, per `docs/PAGE_TEMPLATES.md`'s AI Chat Template.

**Responsibilities.** Compose message history (`AIMessageBubble`, stacked), `SuggestedPromptChip` row, input field, and per-message `CitationList`; manage scroll position (auto-scroll to newest message, allow scroll-back through history).

**Inputs:** Current conversation's message history, active context scope (`moduleId`, if opened from a Lesson Page), Conversation Memory setting (session-only vs. persisted, per `docs/AI_ASSISTANT_BLUEPRINT.md`).

**Outputs:** A submitted question, routed into `docs/AI_RETRIEVAL_MANIFEST.md`'s Retrieval Pipeline.

**Props:** `context` (optional `moduleId`), `conversationId` (optional, when reopening a past conversation).

**State:** The current message list (including in-flight, not-yet-resolved messages), input field value.

**Events:** `onSubmitQuestion(text)`, `onSelectSuggestedPrompt(text)`, `onClearConversation()`.

**Dependencies:** `docs/AI_RETRIEVAL_MANIFEST.md` (the pipeline this layout's submit action invokes), `docs/API_CONTRACTS.md` AI contract, `docs/APP_LAYOUT_SPEC.md` (persistent panel vs. slide-over hosting).

**Responsive behavior:** Persistent side panel on desktop; full-screen takeover on mobile, per `docs/APP_LAYOUT_SPEC.md`'s Mobile Behaviour, consistent with the Search Overlay's own mobile treatment.

**Accessibility:** New messages are announced via a live region as they arrive, so a screen-reader user doesn't need to manually re-poll the conversation; the input field remains focused/reachable after a response arrives, so a learner can immediately ask a follow-up without re-navigating to the input.

**Error states:** See Error Handling below.

**Loading states:** See Loading and Streaming below.

**Future extensibility:** MCP-compatible exposure (per `docs/AI_ASSISTANT_BLUEPRINT.md`'s Future MCP Compatibility, conceptual only) would introduce a second consumer of the same underlying pipeline without changing this component, since this layout is already a thin presentation over a pipeline it doesn't own.

## Suggested Prompts

**Purpose.** Implementation contract for `docs/COMPONENT_LIBRARY.md`'s `SuggestedPromptChip`, per `docs/AI_ASSISTANT_BLUEPRINT.md`'s Suggested Prompts section.

**Responsibilities.** Render a small set of context-aware suggested questions, shown at conversation start or after a topic shift.

**Inputs:** Current context scope (`moduleId`), whether this is a new conversation or a continuing one.

**Outputs:** A selected-prompt event, equivalent to submitting that text as a question.

**Props:** `context` (module ID or none), `visible` (boolean — hidden mid-conversation except after an explicit topic shift signal).

**State:** None locally.

**Events:** `onSelectPrompt(text)`.

**Dependencies:** No fixed universal prompt list is proposed, per `docs/AI_ASSISTANT_BLUEPRINT.md`'s explicit deferral — mirrored here rather than inventing one.

**Responsive behavior:** Wraps to fewer visible chips on mobile.

**Accessibility:** Rendered as a labeled group of buttons, each with the full suggested question as its accessible name.

**Error states:** No suggestions available for the current context: the component renders nothing, falling through to a blank input state.

**Loading states:** Not applicable — expected to be available immediately once context is known.

**Future extensibility:** Once real usage exists, suggestions can be derived from actual learner questions per module rather than left empty, without changing this component's contract.

## Grounded Citations

**Purpose.** Implementation contract for the citation behavior specified in `docs/AI_RETRIEVAL_MANIFEST.md`'s Citation Rules — this entry is the UI-facing half of that pipeline stage.

**Responsibilities.** Render every article the response's answer actually drew from as a real, resolvable `/docs/<folder>/<slug>` link, per `docs/KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` §7; carry forward any `disclaimerLabel` metadata (Composite Case Study, Anonymized Real Conversation, Training Simulation, Illustrative Only) attached to a cited chunk, per `docs/AI_RETRIEVAL_MANIFEST.md`'s Metadata section.

**Inputs:** The response's cited `articleId` list and any associated `disclaimerLabel` values, from the Retrieval Pipeline's output.

**Outputs:** Navigation intent per citation (opens the cited article, typically in a way that doesn't lose the current conversation — see Future Extensibility).

**Props:** `citations` (a list of `{articleId, title, disclaimerLabel?}`).

**State:** None.

**Events:** `onSelectCitation(articleId)`.

**Dependencies:** `docs/AI_RETRIEVAL_MANIFEST.md` Citation Rules, `docs/ROUTE_REGISTRY.md` for resolving `articleId` to a route.

**Responsive behavior:** No structural change across breakpoints.

**Accessibility:** Each citation is a real, keyboard-focusable link with the article's actual title as its accessible name, never a bare "source 1" label.

**Error states:** A response with zero citations is treated as ungrounded per `docs/AI_RETRIEVAL_MANIFEST.md`'s Citation Rules and is not rendered by this component at all — it routes to Refusal Behaviour below instead, since `docs/AI_ASSISTANT_BLUEPRINT.md` explicitly proposes a citation-less response be treated as a signal the Assistant isn't grounded for that answer.

**Loading states:** Citations arrive with the completed response, per Streaming below — not shown incrementally ahead of the answer text they support.

**Future extensibility:** Opening a citation in a way that preserves the conversation (e.g., a side-by-side view) rather than navigating away entirely is a proposed enhancement this document doesn't commit to, since it depends on the App Layout's panel-vs.-takeover implementation choice.

## Source Cards

**Purpose.** A richer, card-form rendering of Grounded Citations, used where more than a bare link is useful — for example, the AI Conversation History Page's summary view.

**Responsibilities.** Render a cited article's title, module breadcrumb, and a short excerpt, reusing `docs/CONTENT_MANIFEST.md` data the same way `docs/SEARCH_COMPONENT_SPEC.md`'s `SearchResultCard` does.

**Inputs:** Same citation data as Grounded Citations, plus the article's Description from `docs/CONTENT_MANIFEST.md`.

**Outputs:** Navigation intent.

**Props:** `citation` (`{articleId, title, moduleId, disclaimerLabel?}`).

**State:** None.

**Events:** `onSelect(articleId)`.

**Dependencies:** `docs/CONTENT_MANIFEST.md`.

**Responsive behavior:** Stacks vertically on mobile, consistent with other card components in this document family.

**Accessibility:** Same link-labeling standard as Grounded Citations.

**Error states:** Not applicable — Source Cards render from already-validated citation data.

**Loading states:** Skeleton card while the underlying manifest description resolves.

**Future extensibility:** None beyond its current scope.

## Refusal Behaviour

**Purpose.** Implementation contract for `docs/AI_RETRIEVAL_MANIFEST.md`'s Refusal Behaviour pipeline stage — the UI-facing template response.

**Responsibilities.** Render the fixed-pattern deferral message when retrieval or the citation-consistency check determines no grounded answer exists, pointing to the same **Operational Policy Pending** and "the latest approved internal process" language `content/docs/` already uses, per `docs/AI_ASSISTANT_BLUEPRINT.md`'s Unknown-Answer Behaviour.

**Inputs:** A refusal signal from the pipeline (no signal beyond "refuse" — per `docs/AI_RETRIEVAL_MANIFEST.md`, the deferral is a template response, not model-generated, specifically so it can never itself drift into inventing a plausible-sounding non-answer).

**Outputs:** None beyond rendering; optionally offers a "try Search instead" or "rephrase your question" action.

**Props:** None — the message text is fixed, not parameterized per query.

**State:** None.

**Events:** `onTrySearchInstead(originalQuery)`.

**Dependencies:** `docs/AI_RETRIEVAL_MANIFEST.md` Refusal Behaviour, `docs/SEARCH_COMPONENT_SPEC.md` for the hand-off action.

**Responsive behavior:** No structural change across breakpoints.

**Accessibility:** Rendered with the same live-region announcement as any other new message, so this state is as discoverable to assistive technology as a normal answer.

**Error states:** This component is itself one of the pipeline's terminal states, not a component with its own further error condition.

**Loading states:** Not applicable.

**Future extensibility:** None proposed — per `docs/AI_ASSISTANT_BLUEPRINT.md`'s framing, this is the Assistant's most important behavior, deliberately kept simple and fixed rather than made more sophisticated in a way that risks drifting from a template into a generated (and therefore potentially invented) response.

## Loading

**Purpose.** The visible state between a submitted question and a rendered response.

**Responsibilities.** Show an in-progress indicator distinct from Streaming's incremental-text state below, used during the retrieval phase of `docs/AI_RETRIEVAL_MANIFEST.md`'s pipeline (before generation begins producing output).

**Inputs:** Pipeline stage signal (retrieving vs. generating, where the implementation distinguishes them).

**Outputs:** None.

**Props:** None.

**State:** None beyond the parent Conversation Layout's message-list state.

**Events:** None.

**Dependencies:** `docs/AI_RETRIEVAL_MANIFEST.md` Retrieval Pipeline.

**Responsive behavior:** No structural change.

**Accessibility:** Announced as "thinking" or equivalent via a live region, distinct from silence (which could be mistaken for the interface being unresponsive).

**Error states:** A retrieval-phase timeout transitions to Error Handling below, not an indefinite loading state.

**Future extensibility:** None beyond its current scope.

## Streaming

**Purpose.** The incremental rendering of a response's text as it's generated, where the implementation supports token-by-token or chunk-by-chunk delivery.

**Responsibilities.** Append generated text to the current `AIMessageBubble` as it arrives; hold citation rendering (Grounded Citations) until the response is fully complete, per that component's stated dependency on the finished, citation-consistency-checked output.

**Inputs:** A stream of response text chunks.

**Outputs:** None.

**Props:** None.

**State:** The partially-received response text.

**Events:** None beyond the stream's own lifecycle (start, chunk, complete, error).

**Dependencies:** `docs/AI_RETRIEVAL_MANIFEST.md` Retrieval Pipeline step 5 (Generation) and step 6 (citation-consistency check) — streaming text is proposed to display as it generates, but the response is not considered final, and citations are not rendered, until the citation-consistency check in step 6 completes; a check failure discards the streamed text in favor of Refusal Behaviour, per that document's Hallucination Prevention section.

**Responsive behavior:** No structural change.

**Accessibility:** Incremental updates are throttled in how frequently they're announced to a live region (not once per token), to avoid overwhelming screen-reader output, while still confirming activity periodically.

**Error states:** A stream that terminates abnormally mid-response (connection drop) transitions to Error Handling below; any partially-streamed text is discarded rather than left displayed as if it were a complete, citation-backed answer.

**Loading states:** Streaming is itself the state that follows Loading above.

**Future extensibility:** None beyond its current scope.

## Error Handling

**Purpose.** The shared error-condition pattern for the AI Chat component family — distinct from Refusal Behaviour, which is a successful pipeline outcome (no grounded answer exists), not a failure.

**Responsibilities.** Distinguish and render three failure conditions: a network/connection failure, a pipeline failure (retrieval or generation service unavailable), and the Hallucination Prevention discard case (a response was generated but failed the citation-consistency check).

**Inputs:** An error signal with a type, from the pipeline or transport layer.

**Outputs:** A retry action, where applicable.

**Props:** `errorType`.

**State:** None locally.

**Events:** `onRetry()`.

**Dependencies:** `docs/AI_RETRIEVAL_MANIFEST.md` Hallucination Prevention (for the discard case specifically).

**Responsive behavior:** No structural change.

**Accessibility:** Announced via a live region, with the retry action keyboard-focusable.

**Error states:** This component is itself the error-state renderer for the family; it has no further nested error condition of its own.

**Loading states:** Not applicable.

**Future extensibility:** A discard case (citation-consistency failure) could be logged for later review of retrieval quality without being shown to the learner as a distinct error type — this document proposes it render as an ordinary Refusal Behaviour response to the learner (least alarming, most honest framing) while the underlying cause is available to implementation-level logging, a distinction left to the build phase.

## Conversation History

**Purpose.** Implementation contract for the AI Conversation History Page, per `docs/SCREEN_INVENTORY.md`.

**Responsibilities.** Render `ConversationHistoryList`; reopen a selected past conversation into the Conversation Layout with its full message history restored.

**Inputs:** The learner's stored conversations, per `docs/STATE_MANAGEMENT.md` AI state (account-persisted, where Conversation Memory is enabled).

**Outputs:** Navigation intent into a reopened conversation, delete-write intent.

**Props:** None.

**State:** None locally.

**Events:** `onReopenConversation(conversationId)`, `onDeleteConversation(conversationId)`.

**Dependencies:** `docs/API_CONTRACTS.md` AI contract, `docs/STATE_MANAGEMENT.md` AI state.

**Responsive behavior:** Standard list-page collapse on mobile.

**Accessibility:** Each conversation entry's accessible label includes a short summary and timestamp, not a bare "conversation 1."

**Error states:** No past conversations: an honest empty state, never a fabricated example conversation.

**Loading states:** Skeleton list rows.

**Future extensibility:** None beyond its current scope.

## Related Documents

- `docs/AI_ASSISTANT_BLUEPRINT.md`, `docs/AI_EXPERIENCE.md` — the design this document gives component contracts to
- `docs/AI_RETRIEVAL_MANIFEST.md` — the retrieval pipeline every component above surfaces without altering
- `docs/SEARCH_COMPONENT_SPEC.md` — the complementary search experience this document's Refusal Behaviour hands off to
- `docs/STATE_MANAGEMENT.md`, `docs/API_CONTRACTS.md` — the AI state domain and contract this component family reads and writes
