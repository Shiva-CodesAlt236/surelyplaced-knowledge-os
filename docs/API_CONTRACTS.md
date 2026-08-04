# API Contracts

**Status:** Implementation asset — first Implementation Sprint deliverable
**Applies to:** The future backend API contracts required to serve the state domains in `docs/STATE_MANAGEMENT.md`
**Owner:** Documentation Architect
**Last updated:** 2026-08-04

This document specifies proposed API contracts at a resource and operation level — endpoints, request/response shape in conceptual terms, and which state domain each contract serves. It does not specify a transport protocol (REST, GraphQL, RPC), a specific request/response serialization format, or authentication token mechanics — those are implementation decisions for whichever backend team builds this platform. Every contract below traces to a state domain already defined in `docs/STATE_MANAGEMENT.md`; this document does not propose a new capability, only the interface for one already specified.

## Contract Notation

Each contract is described as a **resource** (the thing being operated on) and its **operations** (what can be done to it), with the state domain and any dependency noted. No contract below names a specific endpoint path, HTTP verb, or payload field list — that level of specification belongs to an actual API design document produced during implementation, informed by but not fixed by this sprint.

## Authentication

**Resource:** Session / Identity.

**Operations:**
- Authenticate a user and establish a session.
- End a session.
- Retrieve the current session's identity and role.

**Serves:** Authentication state, per `docs/STATE_MANAGEMENT.md`.

**Dependencies:** None — this is the foundational contract every other authenticated contract depends on.

**Notes:** This document does not propose a specific identity provider or SSO integration. Role assignment (Career Advisor, Sales Manager, Trainer, Admin) is proposed to be read from this contract's identity response, written only through the Admin contract below, never self-assigned by a user.

## Search

**Resource:** Search Query.

**Operations:**
- Submit a query with optional facet filters (Module, Topic, Role, Problem) and receive ranked results, per `docs/SEARCH_INDEX_MANIFEST.md`.
- Submit a partial query and receive Autocomplete suggestions.
- Retrieve and clear a user's Recent Searches.

**Serves:** Search state, per `docs/STATE_MANAGEMENT.md`.

**Dependencies:** The search index itself, per `docs/SEARCH_INDEX_MANIFEST.md`'s Search Document Schema — this contract queries that index, it does not define it.

**Notes:** This contract is proposed to work without Authentication for any content that is itself unauthenticated (not applicable today, since every route in `docs/ROUTE_REGISTRY.md` requires auth) — noted here only so the contract's design doesn't assume authentication is always required, should that change.

## AI

**Resource:** AI Conversation.

**Operations:**
- Submit a question, with optional context scope (`moduleId`), and receive a grounded, cited response or an explicit deferral, per `docs/AI_RETRIEVAL_MANIFEST.md`'s Retrieval Pipeline.
- Retrieve a list of past conversations (where Conversation Memory is enabled).
- Retrieve a single past conversation's full message history.
- Delete a past conversation.

**Serves:** AI state, per `docs/STATE_MANAGEMENT.md`.

**Dependencies:** Authentication (for Conversation Memory persistence specifically — a single-turn query is proposed to work without it, consistent with `docs/FEATURE_SPECIFICATIONS.md`'s MVP scoping of a "single-turn grounded Q&A version").

**Notes:** Every response from this contract is proposed to include its citations as part of the response payload, never as a separate follow-up call — per `docs/AI_RETRIEVAL_MANIFEST.md`'s Citation Rules, a citation is inseparable from the answer it supports.

## Progress

**Resource:** Completion Record.

**Operations:**
- Mark an article complete (explicit action).
- Retrieve a learner's Completion Status for a given article, module, or path.
- Retrieve aggregated Completion Status across a full path or a full account (for the Dashboard's Progress display).

**Serves:** Progress state, per `docs/STATE_MANAGEMENT.md`.

**Dependencies:** Authentication.

**Notes:** Module- and path-level completion is proposed to always be computed server-side from article-level records at read time, never separately written — the same derived-state principle `docs/STATE_MANAGEMENT.md` states for this domain, carried into the contract design so no client can write an inconsistent aggregate directly.

## Assessments

**Resource:** Assessment Attempt.

**Operations:**
- Start an attempt for a given Knowledge Check, Quiz, Scenario Test, Role Play, or Certification Exam, per `docs/ASSESSMENT_FRAMEWORK.md`.
- Submit responses for an in-progress attempt.
- Retrieve formative feedback and result for a completed attempt.
- Retrieve a learner's attempt history for a given assessment (to support the retake rules in `docs/ASSESSMENT_FRAMEWORK.md`'s Completion Rules).

**Serves:** Progress state (assessment completion contributes to module/path completion) and, indirectly, Learning Analytics state.

**Dependencies:** Authentication, Progress (an assessment's availability may depend on prior module completion, per `docs/LEARNING_PATHS.md`'s completion order).

**Notes:** This contract does not enforce a specific passing threshold or retake limit value — per `docs/ASSESSMENT_FRAMEWORK.md`'s Completion Rules, those are policy figures pending Sales Leadership approval, meant to be configurable by this contract rather than hard-coded into it.

## Bookmarks

**Resource:** Bookmark, Reading List.

**Operations:**
- Add or remove a bookmark for a given article ID.
- Mark or unmark a bookmark as a Favorite.
- Create, rename, or delete a Reading List; add or remove a bookmark from a Reading List.
- Retrieve a learner's full Bookmark list, optionally filtered (Module, Topic, Role).

**Serves:** Bookmarks state, per `docs/STATE_MANAGEMENT.md`.

**Dependencies:** Authentication.

**Notes:** A Bookmark record stores an article ID only, per `docs/BOOKMARK_SYSTEM.md`'s non-duplication rule — this contract never accepts or returns article content as part of a Bookmark payload.

## Notes

**Resource:** Personal Note, Manager Note.

**Operations:**
- Create, edit, or delete a Personal Note attached to an article ID.
- Toggle a Personal Note's visibility (Private / Shared).
- Retrieve a learner's own Personal Notes, grouped by article or module.
- (Gated, not yet enabled) Create, edit, retrieve, or delete a Manager Note about a specific advisor.

**Serves:** Notes state, per `docs/STATE_MANAGEMENT.md`.

**Dependencies:** Authentication, Progress (for grouping context).

**Notes:** The Manager Note operations are specified here for completeness but are proposed to remain unimplemented — or implemented behind a disabled flag — until `docs/NOTES_SYSTEM.md`'s Sensitivity note (visibility, retention, appropriate use) is resolved, per `docs/RELEASE_STRATEGY.md`'s Manager Beta gate. This contract's design should not assume that policy's outcome.

## Analytics

**Resource:** Analytics Snapshot.

**Operations:**
- Retrieve a learner's own Progress, Completion, and Weak Areas summary, per `docs/LEARNING_ANALYTICS.md`.
- Retrieve a manager's team-level Completion, aggregate Quiz Results, and Knowledge Gap Detection summary, scoped to their own direct reports only.
- Retrieve the Milestone Recognition feed (the non-comparative Leaderboard alternative, per `docs/LEARNING_ANALYTICS.md`'s Leaderboard reconciliation note).

**Serves:** Progress, Manager, and Career Advisor state, per `docs/STATE_MANAGEMENT.md`, read together.

**Dependencies:** Authentication, Progress, Assessments (for Quiz Results and Knowledge Gap Detection).

**Notes:** Every response from this contract is proposed to return an explicit empty state where no real data exists yet, never a fabricated or estimated figure — per `docs/LEARNING_ANALYTICS.md`'s Data Discipline, this is a contract-level requirement, not just a UI-rendering choice; the API itself should distinguish "zero, measured" from "not yet computable" in its response shape.

## Cross-Contract Notes

**Admin operations** (account creation, role assignment, platform configuration) are referenced by several contracts above (Authentication's role source, Manager's team membership) but are not specified as their own contract in this document, since `docs/SCREEN_INVENTORY.md`'s Admin Console is the only consumer and its own data dependencies are self-contained platform-operational concerns outside the content-and-learning contracts this document focuses on. A future implementation sprint scoped to the Admin Console specifically should define that contract in the same conceptual style as this document.

**Content contracts** (retrieving an article's actual content, a module's manifest record) are deliberately not specified here as API operations, since `content/docs/` is proposed to remain a statically built Fumadocs content tree per `docs/AI_CONTEXT_PACK.md` §2 — read directly at build or render time, not served through a runtime content API. Only the platform-layer state domains above require a runtime API.

## Related Documents

- `docs/STATE_MANAGEMENT.md` — the state domains each contract serves
- `docs/AI_RETRIEVAL_MANIFEST.md` — the pipeline behind the AI contract specifically
- `docs/SEARCH_INDEX_MANIFEST.md` — the index behind the Search contract specifically
- `docs/ASSESSMENT_FRAMEWORK.md` — the policy figures the Assessments contract is proposed to keep configurable rather than hard-coded
