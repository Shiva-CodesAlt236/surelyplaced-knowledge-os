# Sales Copilot — Status & Progress Log

**Deployment Target:** SurelyPlaced Knowledge OS  
**Local Path:** `E:\SurelyPlacedOS\surelyplaced-knowledge-os`  
**GitHub Repository:** `Shiva-CodesAlt236/surelyplaced-knowledge-os`  
**Hosting / Deployment:** Vercel (`spartans-53e3/surelyplaced-knowledge-os`)  
**Current Phase:** Phase 6B Remediation Complete (Pending Independent Verification) — Correction Capture & Classifier-Version Audit Trail Implemented
**Branch:** `feature/sales-copilot-mvp`
**Authoritative Implementation Freeze SHA:** `758187b6456ba2ff7e891e763b71fb369a1b512a`
**Architecture Stance:** Grounded decision-support tool embedded inside `AskAIPanel.tsx`, consuming existing `lib/scripts-registry.ts` via an adapter layer. No duplicate script databases or copied content exist.

---

## Active Architecture & Canonical Dependency Set

Sales Copilot uses the single source of truth `lib/scripts-registry.ts` (396 scripts extracted from `content/docs/` MDX files) for all response content.

### Active Components & Modules:
- `lib/scripts-registry.ts`: Primary scripts registry (396 entries across 8 modules).
- `lib/copilot/objection-categories.ts`: Objection taxonomy metadata (10 active categories with expanded example phrases).
- `lib/copilot/scripts-library-adapter.ts`: Read-only query layer bridging Sales Copilot to `SCRIPTS_REGISTRY`.
- `lib/copilot/confidence.ts`: Multi-signal confidence reconciliation engine.
- `lib/copilot/content-scanner.ts`: Direct final-output content safety scanner (`scanContentSafety`).
- `lib/copilot/pipeline.ts`: Server-side grounded reasoning pipeline with Phase 5E compound classification & hardening rules.
- `lib/copilot/limits.ts`: Canonical application limits (`MAX_OBJECTION_TEXT_LENGTH = 4000`).
- `lib/copilot/advisor.ts`: Advisor attribution normalization & validation utilities (`surelyplaced_advisor_identifier`).
- `lib/copilot/session.ts`: Session storage continuity & stale session recovery helpers (`surelyplaced_copilot_session_id`).
- `lib/copilot/persistence.ts`: Server-side database persistence service (`createCopilotSession`, `recordCopilotExchange`, `recordCopilotFeedback`, `updateCopilotOutcome`, `getActiveCopilotSession`, `getCopilotExchangeOwnership`).
- `app/api/copilot/route.ts`: Server API endpoint (wires session creation, exchange persistence, explicit `persistenceStatus`, 4000-char input limit, Phase 6A advisor identity gate, Phase 6A.1 object-ownership check).
- `app/api/copilot/feedback/route.ts`: Server API endpoint for exchange feedback ratings (Phase 6A advisor identity gate, Phase 6A.1 object-ownership check).
- `app/api/copilot/outcome/route.ts`: Server API endpoint for student outcome recording (sanitized generic 500 error messages, explicitly returns HTTP 400 on completed session reopening attempts; Phase 6A advisor identity gate, Phase 6A.1 object-ownership check).
- `lib/copilot/providers/mock.ts`: Active offline/mock AI provider (implements `ICopilotAIProvider` for AI reasoning only).
- `app/api/auth/[...nextauth]/route.ts`: Auth.js (NextAuth v5) route handler — Google OAuth sign-in/callback/session endpoints (Phase 6A).
- `lib/auth/config.ts`: Auth.js configuration — Google provider, `@auth/drizzle-adapter` database session strategy, fail-closed `ALLOWED_GOOGLE_WORKSPACE_DOMAIN` restriction (Phase 6A).
- `lib/auth/level-c-flags.ts`: `isLevelCEnabled()` / `isLegacyIdentityModeEnabled()` — two mutually-exclusive-by-construction environment gates controlling authenticated vs. legacy client-supplied identity behavior (Phase 6A).
- `lib/auth/access.ts`: `resolveAuthorizedAdvisor()` — server-derived advisor identity/role resolution from the authenticated Auth.js session; `accessDenialMessage()` (Phase 6A).
- `lib/auth/ownership.ts`: `isOwnerOrAdmin()` — single shared object-ownership authorization decision function used by all three Copilot routes (Phase 6A.1).

### Phase 4B.3 HTTP Contract Architecture:
- Self-entered advisor attribution: Required self-entered advisor name stored in browser `localStorage` (`surelyplaced_advisor_identifier`). Preserves human casing locally, normalized on client/server (`validateAdvisorIdentifier`). Includes UI header (`Advisor: [Name] [Change]`). NOT authenticated login or RBAC.
- Mandatory server advisor validation: `/api/copilot` and `createCopilotSession` enforce required valid advisor identifier for all requests creating/using persistence. Missing/blank/invalid advisor returns HTTP 400. All legacy server fallback buckets (`anonymous-advisor`, `provisional-advisor`, `anon-adv-`) removed (0 runtime occurrences).
- Advisor change session boundary: Changing saved advisor to a different normalized identifier executes `clearCopilotSessionBoundary()`, resetting `sessionId` state, `sessionStorage`, Copilot response, and analysis errors to start a clean DB session boundary under the new advisor. Unchanged normalized names do not destroy active session.
- Session continuity across refresh: Active DB `sessionId` saved in tab `sessionStorage` (`surelyplaced_copilot_session_id`). Restored on component mount so page refreshes maintain ongoing candidate session.
- Explicit "Start New Conversation": Top input header action clears Copilot response, analysis errors, React `sessionId`, and `sessionStorage`, allowing explicit transition between candidate conversations without deleting historical DB rows.
- Stale session recovery flow: If stored `sessionId` is rejected by server (400 completed/not-found/inactive/invalid-format), `isStaleSessionError` classifies it, client automatically clears stale storage and retries objection analysis ONCE without `sessionId` to create a fresh active session.
- Outcome lifecycle & reopening protections:
  - `enrolled` and `lost` set session `status = 'completed'` and clear `sessionId` in React & `sessionStorage`.
  - `follow-up` updates record while keeping session `status = 'active'`, preserving `sessionId` in React & `sessionStorage`.
  - Outcome corrections on completed sessions allow updating outcome attributes/reasons (`enrolled` <-> `lost`) while keeping `status = 'completed'`.
  - Completed session correction to `follow-up` is strictly **REJECTED WITH HTTP 400**, preventing completed sessions from reopening to active.
- API route validation & 404/400 error contracts: Returns HTTP 404 for non-existent feedback exchange UUIDs or outcome session UUIDs. Returns HTTP 400 for domain validation errors (completed -> follow-up). Returns HTTP 500 only for genuine infrastructure/database failures.
- Controlled test row cleanup: Test cleanup in `scripts/test-copilot-phase4b.mjs` targets strictly test-owned prefixes (`WHERE advisor_identifier LIKE 'phase4b-test-%' OR advisor_identifier LIKE 'phase4b-normalization-%'`) in `finally` block (49/49 tests passing).
- Zero schema modifications: Schema and DDL remain 100% untouched.

### Phase 4C AI Provider / Persistence Separation Architecture:
- Provider Boundary: `ICopilotAIProvider` interface now represents pure AI reasoning only (`analyzeObjection(input: string)`).
- Method Removal: Obsolete `recordOutcome` method & `OutcomePayload` import removed from interface, `MockCopilotProvider`, and `ProductionCopilotProvider`.
- Mock Provider Integrity: `MockCopilotProvider` no longer pretends persistence success; delegates reasoning to `runCopilotPipeline(input)`.
- Production Provider Honesty: `ProductionCopilotProvider` remains explicitly unconfigured and throws a fail-loud error if selected.
- Server-Style Configuration: Removed unused `NEXT_PUBLIC_COPILOT_AI_PROVIDER` check from provider factory (`process.env.COPILOT_AI_PROVIDER || 'mock'`).
- Persistence Layer Decoupling: Real outcome and feedback persistence remain cleanly situated in API routes (`/api/copilot/outcome`, `/api/copilot/feedback`) and `lib/copilot/persistence.ts`.
- Zero Code Side Effects: Zero schema, migration, or dependency changes (`71366ea`).

### Phase 5A Pilot Correctness & Data-Trust Hardening Architecture:
- Feedback False-Success Elimination: `onFeedback` callback in `AskAIPanel.tsx` explicitly throws an error when no valid persisted exchange exists (`!exchangeId` or `persistenceStatus === 'not-persisted'`), preventing `OutcomeRecorder` from pretending feedback was persisted.
- Visual Persistence Warning: `CopilotResponseCard` displays a prominent amber warning banner (`"Response generated, but this conversation was not saved. Feedback and outcome tracking are unavailable for this response."`) when `persistenceStatus === 'not-persisted'`.
- Tracking Controls Disabling: Outcome buttons and feedback controls in `OutcomeRecorder` are disabled (`disabled={!isPersisted}`) for non-persisted responses, displaying helper message `"Unavailable because this response was not saved."`.
- Degraded Server Persistence Semantics: Standard degraded persistence behavior remains: reasoning may succeed while database persistence fails or is unconfigured, but the advisor is now explicitly notified that tracking is unavailable.
- Canonical Objection Text Limit: `MAX_OBJECTION_TEXT_LENGTH = 4000` defined in `lib/copilot/limits.ts`.
- Server Input Length Enforcement: `/api/copilot` rejects objection text exceeding 4000 characters with HTTP 400 and `{ error: 'Objection text must be 4000 characters or fewer.' }`.
- Client Input Length Enforcement: `CopilotInput.tsx` textarea enforces `maxLength={MAX_OBJECTION_TEXT_LENGTH}`.
- Candidate Privacy Guidance: `CopilotInput.tsx` displays candidate privacy guidance (`"Do not include candidate names, email addresses, phone numbers, or other personal information."`). *Note on Privacy Truth:* No dedicated candidate PII database fields exist, but `objectionText` remains free-form text input. Phase 5A introduced UI guidance and operational briefing policy, not automated technical redaction.
- Browser Reasoning Fallback Removal: Removed `getCopilotAIProvider` import and browser fallback from `AskAIPanel.tsx`. Network analysis errors display `"Unable to reach Sales Copilot. Please try again."` rather than attempting browser execution. The Sales Copilot / `AskAIPanel` client exposure path into `SCRIPTS_REGISTRY` was completely removed.
- Broader Scripts Registry Client Exposure: *Note on IP / Client Graph:* While the Sales Copilot path was removed, `components/scripts/ScriptsLibraryView.tsx` continues to directly import `SCRIPTS_REGISTRY` in a Client Component. This stance is accepted for Level B pilot because the Preview deployment is protected by Vercel Authentication, but must be revisited for server-rendered streaming prior to Level C public release.
- Sanitized Outcome HTTP 500 Response: Catch block in `/api/copilot/outcome/route.ts` returns a safe generic error payload `{ error: 'Database persistence error while saving outcome.' }` for genuine 500 failures without exposing raw database exception strings. Domain 400/404 contracts remain unchanged.
- Feedback Content-Type Correctness: Corrected feedback request header in `AskAIPanel.tsx` to `"Content-Type": "application/json"`.
- Test Suite Truthfulness & Reclassification: `scripts/test-copilot-phase5a.mjs` executes 13 total assertions: 1 unit/constant assertion (`MAX_OBJECTION_TEXT_LENGTH === 4000`), 3 real server route tests (4000 chars accepted, 4001 chars rejected, empty input rejected), and 9 static source assertions (sanitized outcome 500, no client provider import, no browser fallback, feedback throw guard, PII warning, client maxLength, visible not-persisted banner, OutcomeRecorder disabled behavior, valid feedback Content-Type header).
- Zero Database Schema / Dependency Changes: Zero changes made to `lib/db/`, `drizzle/`, `package.json`, `pnpm-lock.yaml`, or database persistence functions.

### Phase 5B Deployment & Protection Architecture:
- Path A Vercel Authentication Architecture: Standard Vercel Deployment Protection ("Vercel Authentication") enabled on target Preview deployment (`https://surelyplaced-knowledge-h6vflq3io-spartans-53e3.vercel.app` / `dpl_GR7zUFyFac3PxuQwXDzK6pwwx9xh`). Anonymous requests to `/`, `/docs/scripts`, `/api/copilot`, `/api/copilot/feedback`, `/api/copilot/outcome` receive HTTP `302 Found` redirects to Vercel SSO challenge before application execution.
- Non-Production Database Isolation: Target Preview verified against a non-production Neon database (`COPILOT_DB_ENV=preview`). Zero live CRM or production database connections.
- Automation Bypass Security & Credential Rotation: Protection Bypass for Automation enabled in project settings. During initial operational testing, one exposed bypass secret was immediately revoked/invalidated and replaced. All 3/3 Preview Playwright tests executed successfully using the regenerated credential. Zero secret values committed to repository.
- Operational Verification Suite: Local Playwright 8/8 PASSED; Preview Playwright 3/3 PASSED (0 failed, 0 flaky, 0 skipped); content audit 376 scripts / 1698 fields / 14 findings / 320 hints triaged by product owner as 14/14 acceptable context (0 content remediation required); two-advisor manual smoke PASSED (`phase5b-manual-advisor-a` `active` session `ef26b969...` vs `phase5b-manual-advisor-b` `completed` session `2e3326aa...`) with 100% session, exchange, and feedback isolation; operational privacy briefing delivered and acknowledged.

### Phase 5C Live Objection Coverage & Classification Quality Hotfix Architecture:
- Taxonomy Expansion: Added 4 new objection categories (`upfront-payment-resistance`, `information-request-deferral`, `not-interested`, `explicit-refusal`) and activated 1 existing content-backed category (`already-working-with-consultancy`). `call-me-later` and `pay-after-placement-only` remain variants under existing taxonomy and were NOT made separate categories.
- Primary Live Issue Fixes: (1) "I don't want to pay any upfront" — formerly Classification Deferred, now `upfront-payment-resistance`. (2) "Can you please email me the details so that I can review them and get back to you?" — formerly Classification Deferred, now `information-request-deferral`. (3) "I want to try on my own for some time" — formerly `need-time-to-think` primary, now correctly `already-applying-myself` primary. (4) Soft vs hard "not interested" behavior implemented. (5) Deterministic response differentiation improved across all categories.
- Soft vs Hard Refusal Model: Soft first-time brush-off (`not-interested`) permits ONE respectful diagnostic question. Hard/explicit refusal (`explicit-refusal`) short-circuits all persuasion — no secondary objection chain, no persuasive next question. Repeated soft refusal with `previousObjectionId` escalates to `explicit-refusal`. Conversation-local only; no DB memory, no schema change, no cross-session refusal memory.
- Explicit-Refusal Truthfulness Remediation (Phase 5C.1): Earlier defect allowed explicit-refusal responses to inject fictional roleplay candidate names and falsely imply CRM/contact-preference records were already updated. Remediation made responses name-neutral, removed fictitious candidate names, removed false CRM completion claims, removed persuasive next questions and secondary objections. Advisor guidance may note to follow applicable internal DNC/contact preference process after call, without claiming that process was already completed (`f8142f8edad45e5784e6baab157e62d48f80da34`).
- `previousObjectionId` Architecture: Optional `previousObjectionId` threaded through `AskAIPanel` → API route → pipeline options for conversation-local repeated soft-refusal escalation only. No schema field, no persistence layer change, no session lifecycle redesign, no advisor identity change.
- Deterministic Response Differentiation: Improved grounded differentiation across `upfront-payment-resistance`, `information-request-deferral`, `already-applying-myself`, `need-time-to-think`, `trust-and-credibility`, `not-interested`, `explicit-refusal`. Selection remains deterministic, grounded, registry-backed, and testable. Same input produces stable output. No uncontrolled randomness.
- Content Safety: No new Phase 5C content introduced unauthorized discounts, zero-upfront promises, pay-after-placement promises, ISA promises, job guarantees, visa/sponsorship guarantees, fake employer relationships, proxy interviews, or fabricated experience. Upfront enrollment remains required; installment options may be discussed; no unauthorized pay-after-placement or zero-upfront promise.
- Source of Truth Preservation: `content/docs/objections/*.mdx` = authoring source; `lib/scripts-registry.ts` = generated runtime registry. Phase 5C added four MDX objection lessons and regenerated the registry. `already-working-with-consultancy` reused existing content rather than duplicating it. Registry was not manually edited.
- Frozen Areas: Zero schema changes, zero migration changes, zero persistence-layer changes, zero dependency changes, zero auth/Vercel architecture changes, zero Level-B protection changes, zero release-document changes during implementation.
- Phase 5C Commit History: `713ada31f0cc0e8565109cbd7007452e51e1c058` feat(copilot): expand live objection classification coverage; `0dfbf8cf15901d79c045d51dc08341b99befbab3` test(copilot): add phase5c live objection regressions; `be72636aee4b8e8021500f47eceb6922d7d391bc` fix(copilot): refine near-miss keyword precision in pipeline classification; `f8142f8edad45e5784e6baab157e62d48f80da34` fix(copilot): make explicit-refusal responses name-neutral and truthful.
- Operational Verification Suite: Phase 5C 73/73 PASS; Phase 3 35/35 PASS; Phase 4A 37/37 PASS; Phase 5A 13/13 PASS; Lint PASS (0 errors, 0 warnings); Typecheck PASS (0 errors); Local Playwright 8/8 was executed and reported PASS by Antigravity (Claude could not independently rerun Chromium due to sandbox browser download restrictions); Preview Playwright was NOT RERUN for Phase 5C because current replacement automation bypass secret was not available in the Antigravity verification runtime (historical Phase 5B Preview result remains 3/3 PASS); content audit 396 scripts / 1806 text fields / 14 findings / 348 hint items; 14 scanner/audit findings remain, all pre-existing and already triaged as acceptable context; Phase 5C introduced 0 new findings.

### Phase 5D Live Classification Precision Architecture:
- Purpose: Phase 5D was a narrow live-quality precision sprint based on advisor feedback. It focused on hard explicit-refusal coverage, contextual false-positive reduction, false-negative phrase coverage across all 10 categories, compound objection quality, and deterministic classifier precision. It was NOT a taxonomy expansion, content authoring sprint, schema change, persistence change, UI change, Level C launch, or Production launch.
- Taxonomy Stance: No taxonomy categories were added or removed in Phase 5D. The existing 10-category taxonomy model remained 100% unchanged.
- Key Classification Precision Improvements:
  - *Explicit Refusal:* Natural hard-refusal phrases ("Don't contact me.", "Do not message me again.", "I already told you not to call.") short-circuit directly to `explicit-refusal` with empty `nextQuestion` and no secondary objections. Near-misses do not trigger hard refusal on generic stop/call/message/contact wording without explicit refusal intent.
  - *Contextual Not-Interested:* "not interested in X" is no longer blindly interpreted as sales disengagement. Non-sales targets ("not interested in Java roles", "not interested in relocating", "not interested in changing my resume format") are excluded from `not-interested`. Program/service disengagement targets ("not interested in this program", "not interested in signing up", "not interested in moving forward") remain correctly classified.
  - *Price Coverage:* Added natural affordability language ("can't afford", "don't have the money", "outside my budget", "can't spend that much", "price issue").
  - *Upfront Payment:* Added natural advance/pay-after language ("no advance payment", "pay after I get a job", "pay once I start earning", "pay before getting placed").
  - *Information Request Deferral:* Added natural requests for written materials ("send me the pricing first", "send me the agreement", "send me the information", "I want everything written first") while preserving logistical near-misses (calendar invites, meeting links, resumes, Zoom links, interview schedules).
  - *Need Time To Think:* Added natural delay expressions ("call me next week", "call me next month", "busy right now", "I'll get back to you", "need a few days") while preserving unrelated task/cooking/interview time statements.
  - *Already Applying Myself:* Added natural DIY expressions ("already applying myself", "applying on my own", "already have interviews", "handling job search myself", "doing applications myself") while preserving unrelated "myself"/"own" near-misses.
  - *Already Working With Consultancy:* Added natural alternatives ("working with a consultancy", "another recruiter helping", "already paid another company", "enrolled somewhere else", "another company doing this for me").
  - *Trust & Credibility:* Removed bare "company" keyword as a trust signal to prevent false positives for neutral company disclosures ("I work at a consulting company").
  - *Parents / Spouse Approval:* Family words alone ("parents", "spouse", "husband", "wife") no longer trigger family approval without decision/approval verbs.
- Phase 5D Implementation Regressions & Remediation:
  - *Journey E E2E Regression (Resolved in `6ebcf0f`):* Playwright E2E input `"I am already applying myself."` initially regressed to `unclassified` because only the contracted variant `"I'm already applying myself"` was covered. Remediation commit `6ebcf0f04105dbeb521a1eb802ba76b913c36c0f` (`fix(copilot): resolve phase5d journey-e regression`) restored classification to `already-applying-myself` without re-introducing unsafe bare "myself" scoring, bringing Antigravity local Playwright back to 8/8 PASS.
  - *Spouse Secondary Objection Regression (Resolved in `cf3e9a4`):* Independent verification found Phase 3 Test 6 regressed to 34/35 for input `"I have both a price issue and need to discuss it with my spouse."` (secondary `parents-spouse-approval` missing). Remediation commit `cf3e9a4a5f88951244d1fa3c2d8b7bcd06b2543c` (`fix(copilot): restore spouse approval secondary detection`) added explicit spouse decision phrases to `keywordsMap`, removed loose bare `'need'` from `decisionVerbs`, and added `"price issue"` to `price-objection` example phrases, restoring full 35/35 PASS on Phase 3 and bringing Phase 5D suite to 170/170 PASS.
- Verification Matrix & Test Truth:
  - Phase 3 Reasoning & Safety Suite: **35/35 PASS**
  - Phase 4A Schema & Client Suite: **37/37 PASS**
  - Phase 5A Pilot Correctness Suite: **13/13 PASS**
  - Phase 5C Live Objection Hotfix Suite: **73/73 PASS**
  - Phase 5D Precision & Regression Suite: **170/170 PASS**
  - Code Quality: `pnpm lint` **PASS** (0 errors, 0 warnings); `npx tsc --noEmit` **PASS** (0 errors).
- Playwright E2E Provenance:
  - *Antigravity Local Playwright:* **8/8 PASS** (Journeys A through H verified against local dev server and non-production Neon database).
  - *Claude Playwright Verification Stance:* Not independently reproducible by Claude in verification environment due to network allowlist 403 blocks during Chromium download (`403 Connection blocked by network allowlist`).
  - *Preview Playwright Stance for Phase 5D:* NOT RERUN — current replacement automation bypass secret was not available in runtime environment. Historical Phase 5B Preview result remains 3/3 PASS.
- Content Audit & Source of Truth:
  - Scripts Registry Audit: 396 scripts / 1806 text fields / 14 findings / 348 registry hint items.
  - 14 pre-existing scanner/audit findings remain triaged as acceptable context. Phase 5D introduced **0 new content findings** because zero MDX files or registry entries were modified.
  - Source of Truth preserved: `content/docs/objections/*.mdx` = authoring source; `lib/scripts-registry.ts` = generated runtime source.

### Phase 5E Compound Objection Precision & Classifier Hardening Architecture:
- Purpose: Phase 5E was a focused deterministic classifier-hardening sprint addressing compound objection precision, secondary-objection recall, natural-language phrase robustness, explicit-refusal/DNC coverage, family-approval phrase symmetry, price informational false positives, trust informational false positives, consultancy recall, contextual not-interested coverage, and intentional substantive-over-soft-not-interested ranking.
- Explicit Non-Goals: Phase 5E was NOT a taxonomy expansion, confidence-engine redesign, severity-weight change, secondary-margin change, schema change, persistence change, UI change, content-authoring sprint, Level C launch, or Production launch.
- Locked Product Owner Decisions:
  - Decision A: `"What is the price?"` → unclassified informational (NOT `price-objection`, NOT automatically `information-request-deferral`).
  - Decision B: `"What does the fee include?"` → unclassified informational.
  - Decision C: `"I'm not interested because it's expensive."` → substantive objection (`price-objection`) intentionally outranks soft `not-interested`. General policy: substantive objection outranks soft `not-interested` when both are genuinely present.
  - Decision D: `"I'm not interested in paying upfront."` → `upfront-payment-resistance` remains primary. Explicit-refusal remains absolute override.
- Taxonomy & Scoring Engine Freeze:
  - Taxonomy: Unchanged at 10 categories (no categories added or removed).
  - Confidence Engine: Unchanged (`lib/copilot/confidence.ts` frozen; formula, thresholds HIGH/MEDIUM, reconciliation architecture untouched).
  - Severity Weights: Unchanged (`SEVERITY_WEIGHTS` frozen; ranking rules implemented via explicit routing logic, not weight manipulation).
  - Secondary Signals: Validity floor (>0.35) and secondary margin (<=0.35) unchanged.
- Hard Refusal Expansion & Contextual Safety:
  - DNC Wording Expansion: Natural refusal wording expanded (`"Please don't reach out again"`, `"Do not reach out to me again"`, `"Stop reaching out"`, `"Take me off the calling list"`, `"Delete my contact"`, `"Remove me from your database"`, `"Don't text me anymore"`, `"Stop texting me"`, `"No more calls"`, `"I've told you before, stop calling"`).
  - Hard-Refusal Behavior: No persuasion, no secondary objections, empty `nextQuestion`.
  - Tech-Context Local Guard (Correction #2): Refusal wording targeting technical objects (`"Stop calling the API"`, `"Don't call this function again"`, `"Stop the screen share"`, `"Stop the application"`) is suppressed ONLY when no independent person-directed DNC statement exists. Mixed statements with candidate-directed refusal (`"Stop calling the API and don't contact me again"`) remain `explicit-refusal`.
- Typed Family Decision Phrase Family:
  - Implemented typed deterministic template generator `generateFamilyDecisionKeywords()` (Correction #1) with interaction templates (`"talk to my {family}"`, `"discuss with my {family}"`), subject templates (`"my {family} has to approve"`, `"my {family} needs to agree"`), and context templates (`"{family} approval"`). Avoided blind Cartesian generation.
  - Symmetric Family Precision: Positives now reliably classify (`"My wife has to approve this"`, `"My husband needs to agree before I enroll"`, `"My parents want to decide together"`, `"I have to check with my family"`, `"My spouse wants to review the plan"`, `"My father handles these decisions"`, `"I need to discuss it with my spouse"`). Near-miss negatives remain protected (`"My wife applied yesterday"`, `"My husband works in IT"`, `"My parents need a flight ticket"`, `"My spouse works at Google"`, `"My spouse needs a vacation"`, `"My parents live in India"`).
- DIY + Time Compound Gap Resolution:
  - Compound input *"I want to try myself for another month, then I'll think about your program."* now classifies as `already-applying-myself` primary + `need-time-to-think` secondary.
  - Expanded delay phrase coverage (`"give me a few days"`, `"give me some days"`, `"then decide"`, `"think about your program"`, `"call me after that"`, `"circle back"`, `"reach out next month"`).
  - Preserved task-timing near-miss protection (`"interview is next month"` -> NOT timing) unless an independent genuine sales delay signal co-exists (`"My interview is next month, so call me after that"` -> `need-time-to-think`, Correction #3).
- Price & Trust Informational Precision:
  - Price Informational Guard: Bare pricing/cost/fee terms in factual questions (`"What is the price?"`, `"What does the fee include?"`, `"Send me the price"`, `"My project has a cost field"`, `"The API returns a price"`, `"My employer gives me a training budget"`, `"The database has a price field"`, `"The product has a pricing issue in the database"`) score 0 for `price-objection` and stay unclassified. Genuine price objections (`"This is too expensive"`, `"I can't afford this"`, `"My budget is too low"`) score high for `price-objection`.
  - Trust Contextual Guard: Bare terms `real`, `proof`, `guarantee`, `reviews` no longer trigger trust alone (`"I have real work experience"`, `"This is a real interview"`, `"I work on real-time projects"`, `"I need proof of address"`, `"Can you guarantee delivery by Friday?"`, `"I read reviews for this course"` -> unclassified/neutral). Genuine credibility questions (`"How do I know this is genuine?"`, `"Is this legitimate?"`, `"I was scammed before"`, `"I don't trust placement companies"`, `"Can you prove this actually works?"`) score high for `trust-and-credibility`.
  - Placement-Guarantee Follow-Up Fix: Follow-up commit `4c991092dd6360dff0d2bc006129b45fc34e7219` (`fix(copilot): include placement guarantee keywords in trust precision guard`) added targeted placement/job-guarantee keywords to trust context without reopening neutral guarantee false positives (`"Can you guarantee delivery by Friday?"` stays neutral). Local Journey E input `"Can you explain the placement guarantee?"` classifies as `trust-and-credibility`.
- Upfront, Info-Request & Consultancy Precision:
  - Upfront: Expanded advance payment & pay-after coverage (`advance payment`, `pay before results`, `pay before placement`, `pay after placement`, `pay after getting a job`, `pay after joining`, `pay once earning`, `paying anything upfront`). Preserved neutral payment near-misses (`"I paid my apartment upfront"`).
  - Info-Request: Expanded written material requests (`Send me the agreement`, `Email me the agreement`, `Send me the pricing`, `Send me the pricing breakdown`, `Send me the brochure`, `Send me the proposal`, `Send me the plan details`, `Send me everything in writing`). Pure pricing questions remain unclassified.
  - Consultancy: Expanded competitor terms (`already hired a recruiter`, `placement agency`, `another agency marketing profile`, `another career service`, `another recruiter helping`, `already paid another company`, `already enrolled elsewhere`, `another placement company`). Preserved neutral employment exclusions (`"I work at a consultancy"`, `"My recruiter works for another company"`).
- Substantive-Over-Soft-Not-Interested Primary Ranking:
  - Explicit ranking rule in `pipeline.ts` (Step 4.5) promotes a substantive valid signal (>0.35) over soft `not-interested` (Correction #4).
  - Examples: `"I'm not interested because it's too expensive"` -> `price-objection` primary; `"I'm not interested because I already have another consultancy"` -> `already-working-with-consultancy` primary; `"I'm not interested because I don't trust consultancies"` -> `trust-and-credibility` primary; `"I'm not interested because I need to talk to my wife"` -> `parents-spouse-approval` primary; `"I'm not interested, I want to try myself"` -> `already-applying-myself` primary. Bare `"I'm not interested"` -> `not-interested` primary. Explicit refusal overrides everything.
- Verification Matrix & Test Truth:
  - Phase 3 Reasoning & Safety Suite: **35/35 PASS**
  - Phase 4A Schema & Client Suite: **37/37 PASS**
  - Phase 5A Pilot Correctness Suite: **13/13 PASS**
  - Phase 5C Live Objection Hotfix Suite: **73/73 PASS**
  - Phase 5D Precision & Regression Suite: **170/170 PASS**
  - Phase 5E Classifier Hardening Suite: **214/214 PASS**
  - *Test-Quality Nuance:* 214/214 is truthful assertion count. Approx 13 compound assertions use `A OR B primary` pattern without explicitly confirming secondary presence. Carried as SHOULD-FIX future test-hardening work.
  - Code Quality: `pnpm lint` **PASS** (0 errors, 0 warnings); `npx tsc --noEmit` **PASS** (0 errors).
- Playwright E2E & Content Audit Provenance:
  - *Antigravity Local Playwright:* **8/8 PASS** (Journeys A through H verified against local dev server and non-production Neon database).
  - *Claude Playwright Verification Stance:* Not independently reproducible by Claude in verification environment due to network allowlist 403 blocks during Chromium download (`403 Connection blocked by network allowlist`).
  - *Preview Playwright Stance for Phase 5E:* NOT RERUN — current replacement automation bypass secret was not available in runtime environment. Historical Phase 5B Preview result remains 3/3 PASS.
  - *Content Audit & Source of Truth:* 396 scripts / 1806 text fields / 14 findings / 348 registry hint items. 14 pre-existing scanner findings remain triaged as acceptable context. Phase 5E introduced **0 new content findings** because zero MDX files or registry entries were modified. `content/docs/objections/*.mdx` = authoring source; `lib/scripts-registry.ts` = generated runtime source. Grounded response architecture unchanged.
- Implementation Scope:
  - Changed paths: `lib/copilot/objection-categories.ts`, `lib/copilot/pipeline.ts`, `scripts/test-copilot-phase5e.mjs`.
  - Zero changes to schema, migrations, persistence, UI, API contract files, MDX, scripts registry, dependencies, Vercel/auth, deployment.
- Policy Safety & Response Grounding:
  - All outputs remain registry-backed. No free-form AI response generation. Zero unauthorized discounts, zero-upfront promises, pay-after-placement promises, ISAs, refund guarantees, job guarantees, visa guarantees, proxy interviews, or fake experience.
- Phase 5E Non-Blocking / Should-Fix Items:
  - *Trust Substring Collision (Should-Fix):* `"approve this"` contains `"prove this"`. In `"My wife has to approve this"`, primary is correctly `parents-spouse-approval`, but may produce a spurious `trust-and-credibility` secondary. Anchor/refine trust phrase in future hardening.
  - *Secondary-Selection After Primary Promotion (Should-Fix):* Step 4.5 promotes a substantive category over `not-interested`. Later secondary logic assumes `sortedSignals[0]` is primary, so `not-interested` may be skipped as secondary.
  - *Compound Test Quality Refinement (Should-Fix):* Approx 13 compound Phase 5E assertions use `A OR B primary` without confirming secondary presence.
  - *Reversed Guarantee Wording (Non-Blocking):* `"Do you guarantee placement?"` remains unclassified due to reversed wording.
  - *Info+Time Secondary Surface (Non-Blocking):* `"Email the pricing and I'll decide next week."` identifies `information-request-deferral` primary but may not surface `need-time-to-think` secondary.
  - *Family Generator Readability (Non-Blocking):* Family typed-template generator includes singular/plural suffix variations (some grammatically odd match strings, zero false-positive impact).
- Phase 5E Commit History:
  - Commit 1: `ee8f3f88bb9108f11f38344e84766de0e9493308` `fix(copilot): improve phase5e compound classification precision`
  - Commit 2: `4d07453758afea9aa103310c87ec7200dc8f5d17` `test(copilot): add phase5e classifier hardening regressions`
  - Commit 3: `4c991092dd6360dff0d2bc006129b45fc34e7219` `fix(copilot): include placement guarantee keywords in trust precision guard`
  - Authoritative Phase 5E implementation freeze SHA: `4c991092dd6360dff0d2bc006129b45fc34e7219`.

### Phase 5F Secondary Coherence, Word-Boundary Safety & Test Integrity Architecture:
- Purpose: Phase 5F was a focused deterministic-classifier hardening sprint that resolved three Phase 5E carried-forward Should-Fix items: a trust substring collision, a secondary-objection selection defect introduced by Step 4.5 promotion, and compound test assertion weakness. It was NOT a taxonomy expansion, confidence-engine redesign, schema change, persistence change, UI change, Level C launch, or Production launch.
- Word-Boundary Safety: Added a `hasBoundaryMatch(text, phrase)` helper (regex-based, word-boundary-aware) applied to the four collision-prone trust phrases (`prove this`, `prove that`, `proof this`, `proof that`) so they no longer match inside larger words such as `approve this` or `improve this`. `"My wife has to approve this."` correctly stops producing a spurious `trust-and-credibility` secondary.
- Secondary-Objection Selection Fix: Corrected the Step 6 secondary-selection loop, which previously assumed `sortedSignals[0]` was always the primary category. Since Step 4.5 can promote a non-top-scoring signal to primary, the loop now iterates all sorted signals and excludes the primary by `categoryId === primaryCategory.id` rather than by array index, so a promoted-away signal (e.g. `not-interested`) is no longer silently dropped from `secondaryObjections`.
- SUB1–SUB5 Promoted-Primary Secondary Coherence: Verified that Step 4.5 promotion consistently preserves the demoted `not-interested` signal as a secondary across all five substantive-objection families (price, consultancy, trust, family, DIY).
- Compound Test Quality Strengthening: Replaced weak `A OR B primary` compound assertions with explicit primary-and-secondary assertions across 14 previously under-specified test cases.
- Taxonomy & Scoring Engine Freeze: Unchanged at 10 categories; confidence engine, severity weights, validity floor (>0.35), and secondary margin (<=0.35) all unchanged.
- Verification Matrix & Test Truth: Phase 3 **35/35**; Phase 4A **37/37**; Phase 5A **13/13**; Phase 5C **73/73**; Phase 5D **170/170**; Phase 5E **214/214**; Phase 5F **74/74** (pre-Phase-5F.1 baseline). Code Quality: `pnpm lint` PASS (0 errors, 0 warnings); `npx tsc --noEmit` PASS (0 errors).
- Phase 5F Commit History: `c099d9c29ecf4415ad7c8b9bbbc3b046cde42ef3` `fix(copilot): harden phase5f secondary coherence and phrase boundaries`; `c690ac61bcc49686b1e16ea2087b448c4e280d08` `test(copilot): add phase5f secondary integrity regressions`.
- Independent Adversarial Verification Outcome: Independent adversarial verification of the Phase 5F implementation (targeted false-positive/false-negative probing beyond the committed test matrix) found 4 BLOCKING regressions introduced alongside the legitimate Phase 5F fixes above, all originating from new contextual keyword additions that lacked narrow guards: (1) a `nonProgramTerms` guard unconditionally hard-suppressed `trust-and-credibility` whenever `delivery`/`shipping`/`uptime`/`flight`/`address` appeared, even alongside genuine trust language; (2) `"budget is limited"` reopened factual/organizational-budget false positives for `price-objection`; (3) `"don't want another fee"` caused false positives on technical/data-schema statements; (4) `"send the pricing"` caused false positives on technical/data-transfer statements. Two additional Should-Fix items were also identified: `"decide next week"/"decide next month"` matched third-party/organizational statements, and the Step 4.6 competitor-payment override fired on any `"already paid another company/[X]"` mention regardless of whether a fee concern was actually present. These 6 items were remediated in Phase 5F.1 below; the word-boundary fix, Step 6 fix, and SUB1-5 behavior described above were independently confirmed correct and were not regressed.

### Phase 5F.1 Context-Guard Remediation Architecture:
- Purpose: Phase 5F.1 was a narrow remediation pass that fixed the 4 blocking regressions and 2 Should-Fix items identified during independent adversarial verification of Phase 5F, using targeted deterministic context guards rather than removing the underlying Phase 5F recall improvements.
- Blocker 1 Fix (Trust Non-Program-Term Guard): The `nonProgramTerms` suppression (`delivery`, `shipping`, `uptime`, `flight`, `address`) no longer hard-zeroes `trust-and-credibility` outright. It now only suppresses when no independent genuine trust signal (`scam`, `cheat`, `fraud`, `fake`, `genuine`, etc.) is also present in the same statement. Guarantee-only phrasing (`"can you guarantee delivery"`) is deliberately excluded from the genuine-signal set, since that is exactly the neutral pattern this guard exists to suppress.
- Blocker 2 Fix (Budget Context Guard): `"budget is limited"` / `"my budget is limited"` now require a co-occurring candidate-affordability term (`my budget`, `afford`, `service`, `program`, `enroll`, `pay`, `spend`, `investment`, `price`, `fee`, `cost`) before classifying as `price-objection`, preventing false positives on bare third-party/organizational budget mentions (`"The API budget is limited."`, `"Our marketing budget is limited."`).
- Blocker 3 & 4 Fix (Shared Technical-Context Guard): Added a shared `DATA_SCHEMA_CONTEXT_TERMS` constant (`field`, `column`, `database`, `spreadsheet`, `api`, `payload`, `schema`, `json`, `response`, `property`, `table`, `object`). `"don't want another fee"` (and its variants) and `"send the pricing"` are suppressed from `price-objection` and `information-request-deferral` respectively when a technical/data-schema term is present in the same statement.
- Should-Fix 5 (Timing Candidate-Subject Guard): `"decide next week"` / `"decide next month"` restricted to first-person candidate framing (`"I'll decide..."`, `"I will decide..."`, `"let me decide..."`) in both `keywordsMap` and `examplePhrases`, so third-party/organizational statements (`"The committee will decide next week."`) no longer classify as `need-time-to-think`.
- Should-Fix 6 (Step 4.6 Narrowing): The competitor-payment-plus-fee override now requires an explicit fee-concern phrase to co-occur with `"already paid another company/[X]"` before forcing `already-working-with-consultancy` as primary, rather than firing on that phrase alone.
- Taxonomy & Scoring Engine Freeze: Unchanged at 10 categories; confidence engine, severity weights, validity floor, and secondary margin all unchanged. `lib/copilot/scripts-library-adapter.ts` unchanged (`findMatchingObjectionCategory` remains 0 call sites, non-blocking technical debt).
- Verification Matrix & Test Truth: Phase 3 **35/35**; Phase 4A **37/37**; Phase 5A **13/13**; Phase 5C **73/73**; Phase 5D **170/170**; Phase 5E **214/214**; Phase 5F **144/144** (original 74 assertions plus Phase 5F.1 adversarial regression coverage). **TOTAL: 686 verified assertions PASS**, independently re-executed and confirmed in a fresh clone. Code Quality: `pnpm lint` PASS (0 errors, 0 warnings, project-wide); `npx tsc --noEmit` PASS (0 errors) after running the project's normal `npx fumadocs-mdx` codegen step — a fresh clone otherwise reports `lib/source.ts(1,22): Cannot find module '@/.source/server'` because generated fumadocs `.source` artifacts do not yet exist; this is a pre-existing environment/codegen requirement, not a Phase 5F.1 regression, and this file was unchanged by Phase 5F.1.
- Playwright & Content Audit Provenance: Local Playwright environment-blocked during independent verification (`[WebServer] /bin/sh: 1: pnpm: not found`, sandbox could not invoke the configured webServer command); Preview Playwright NOT RERUN (current automation bypass secret unavailable). Content audit: 396 scripts / 1806 text fields / 14 findings; 0 new Phase 5F.1 content findings (zero MDX or registry changes).
- Implementation Scope: Changed paths: `lib/copilot/objection-categories.ts`, `lib/copilot/pipeline.ts`, `scripts/test-copilot-phase5f.mjs`. Zero changes to `lib/copilot/confidence.ts`, `lib/copilot/types.ts`, `lib/copilot/scripts-library-adapter.ts`, schema, migrations, persistence, UI, API contract files, MDX, scripts registry, dependencies, Vercel/auth, deployment.
- Policy Safety & Response Grounding: All outputs remain registry-backed; no free-form AI response generation introduced. Zero unauthorized discounts, zero-upfront promises, pay-after-placement promises, refund guarantees, job/visa/sponsorship guarantees, proxy interviews, or fabricated experience introduced. Guarantee-phrase recognition remains classification-only and does not imply SurelyPlaced makes any guarantee.
- Phase 5F.1 Commit History: `7310673db6f4065b20a974737cf11285fd52fde1` `fix(copilot): guard phase5f contextual phrase matching`; `b09c9287f2cc9996fae209a6c01cf7cb41e14877` `test(copilot): add phase5f adversarial regression coverage`.
- Independent Verification Outcome: Independently re-verified in a fresh disposable clone against the exact required adversarial matrix (nonProgramTerms A1-A13, budget B1-B12, fee C1-C10, pricing D1-D12, timing E1-E14, Step 4.6 F1-F5, normal-consultancy regression, SUB1-SUB5) plus the full historical suite battery. All 4 blockers and both Should-Fix items confirmed resolved for their required scope. No new regressions found. Authoritative Phase 5F.1 implementation freeze SHA: `b09c9287f2cc9996fae209a6c01cf7cb41e14877`.
- Phase 5F.1 Residual Should-Fix Items (Non-Blocking, Recorded for Future Hardening):
  - *Candidate-Budget Residual Breadth:* The budget guard's `candidateBudgetContext` list includes the literal term `"my budget"`, which is trivially satisfied whenever the trigger phrase itself is `"my budget is limited"`. This means a first-person budget statement outside a genuine service-affordability context (e.g. `"My budget is limited for AWS infrastructure."`) may still classify as `price-objection`. Third-party phrasing without "my" (`"The project budget is limited."`) remains correctly excluded. Future hardening should require an additional service/program-affordability signal beyond the bare "my budget" self-reference.
  - *`DATA_SCHEMA_CONTEXT_TERMS` Residual Breadth:* The technical-context term list does not cover every technical term a statement might use. Verification found `"I don't want another fee parameter."` and `"Send the pricing variable to the function." / "Send the pricing parameter to the backend."` still classify (terms `parameter`, `variable`, `backend`, `function` are not in the current list, which covers `field`, `column`, `database`, `spreadsheet`, `api`, `payload`, `schema`, `json`, `response`, `property`, `table`, `object`). Future hardening should extend the term list or move to a more general technical-context heuristic.
  - *Pre-Existing Consultancy Breadth (Not a Phase 5F.1 Defect):* Statements such as `"I already paid another company because they designed my website."` may still classify as `already-working-with-consultancy`. This is caused by a pre-existing exact-phrase match (`"I already paid another company"` in `objection-categories.ts` `examplePhrases`), independent of the Step 4.6 override — the Phase 5F.1 Step 4.6 narrowing (Should-Fix 6 above) is confirmed working correctly and is not the cause. Recorded as residual generic-classifier breadth for future precision hardening, not attributable to this phase's remediation.
  - *Timing Design Note (Not a Defect):* `"We'll decide next week."` remains unclassified because the candidate-subject restriction only recognizes singular first-person framing (`"I'll"`, `"I will"`, `"let me"`), not plural `"we'll"`, since "we" may still refer to a third party. This is a defensible design choice, documented here for clarity rather than as a bug.

### Phase 6A Application Authentication, Advisor Identity & Object Ownership Architecture:
- Purpose: Phase 6A replaced the self-entered, client-supplied `localStorage` advisor identifier (Phase 4B.3, never authenticated, trivially spoofable) with real server-side authentication, and closed a subsequent object-level authorization gap discovered during independent verification. This phase touched authentication and per-request authorization only — it did not change the classifier, taxonomy, confidence engine, scripts registry, or MDX content.
- Authentication Architecture (initial Phase 6A implementation): Added Auth.js (`next-auth@5.0.0-beta.32`) with `@auth/drizzle-adapter@1.11.3`, Google OAuth provider, and a database session strategy. Sign-in is fail-closed restricted to a single configured Google Workspace domain via the `ALLOWED_GOOGLE_WORKSPACE_DOMAIN` environment variable (never a hardcoded domain). `lib/auth/access.ts` exposes `resolveAuthorizedAdvisor()`, which derives advisor identity and role (`advisor` / `admin`) solely from the authenticated Auth.js session — never from any client-supplied request field.
- Dual-Gate Rollout Control: Two mutually-exclusive-by-construction environment flags in `lib/auth/level-c-flags.ts` control behavior: `LEVEL_C_ENABLED` (new authenticated flow, default OFF) and `COPILOT_LEGACY_IDENTITY_MODE` (temporary technical-debt compatibility mode preserving the exact pre-Phase-6A self-entered identity behavior, default OFF). `isLegacyIdentityModeEnabled()` returns `false` immediately whenever Level C is enabled, so the two modes can never both apply to the same request. If neither flag is set, all three Copilot API routes fail closed with HTTP 503 rather than silently falling back to spoofable client-supplied identity.
- Verification-Blocker History (preserved for accuracy — this was a real finding, not a hypothetical): Independent read-only verification of the initial Phase 6A implementation, performed twice from fresh clones, found that while advisor **authentication** was implemented correctly (real identity, fail-closed domain/flag gating), Phase 6A as originally implemented never checked object-level **ownership** on `/api/copilot` (session append), `/api/copilot/feedback`, or `/api/copilot/outcome`. Concretely: any authenticated advisor who knew or guessed another advisor's session/exchange UUID could append exchanges to, submit feedback against, or record outcomes on that other advisor's records, because none of the three routes compared the authenticated actor's identity against the persisted owning advisor before performing the write. Both independent verification passes reproduced this identical finding from a fresh clone and fresh source read (`grep -n "advisorIdentifier ===" ...` returned zero matches across the route files). This was correctly assessed as a BLOCKING defect and Phase 6A was held at "requires remediation" rather than being frozen in this state. This history is recorded here deliberately and must not be read as resolved prior to the Phase 6A.1 remediation described below.
- Phase 6A Commit History (authentication implementation, pre-remediation): `2cb8cc0` and `40e9217`.

### Phase 6A.1 Object-Ownership Authorization Remediation Architecture:
- Purpose: Phase 6A.1 is a narrow, schema-free remediation that closes the object-ownership gap identified above, without altering the Phase 6A authentication mechanism, the classifier, or any persisted data shape.
- Authorization Model: Distinguishes AUTHENTICATION (who the caller is, established by Phase 6A) from AUTHORIZATION (what that caller may touch, added by Phase 6A.1). Locked policy: an actor with role `advisor` may access/mutate only Copilot records owned by that same advisor; an actor with role `admin` may access/mutate records owned by any advisor. Ownership is always resolved from the persisted, server-side `advisorIdentifier` recorded on the owning session at creation time — never from any client-supplied field, and this is structural rather than merely policy: the shared decision function does not accept a client-supplied identity parameter at all.
- Shared Decision Function: `lib/auth/ownership.ts` exports a single pure function, `isOwnerOrAdmin(actor, ownerAdvisorIdentifier)`, reused by all three routes rather than duplicated. `lib/copilot/persistence.ts` adds `getCopilotExchangeOwnership(exchangeId)`, which resolves an exchange's owning advisor via a join from the exchange to its owning session (exchanges carry no advisor identity of their own); `getActiveCopilotSession` was reused unchanged, since it already returns the session's `advisorIdentifier`.
- Per-Route Enforcement: `app/api/copilot/route.ts` checks ownership when a client-supplied `sessionId` refers to an existing, active session before allowing an exchange append. `app/api/copilot/feedback/route.ts` checks ownership of the exchange being rated, while deliberately keeping the feedback row's own `advisorIdentifier` (the ACTOR who submitted the feedback, e.g. an admin correcting another advisor's session) distinct from the OWNER identity used for the authorization decision — an admin's correction is recorded as the admin, not silently reattributed. `app/api/copilot/outcome/route.ts` resolves ownership via whichever identifier (`sessionId` preferred, `exchangeId` fallback) the caller supplied, mirroring `updateCopilotOutcome`'s own existing resolution precedence. In all three routes, the ownership check only applies in Level C mode (`levelCActor` is `null` by construction in legacy mode) and only intercepts records that exist and are otherwise valid — pre-existing not-found/inactive responses are unchanged.
- Fail-Closed Behavior: Ownership checks are not wrapped in a route-local try/catch; a thrown DB error during an ownership lookup propagates to each route's existing outer error handling and returns a generic sanitized 500, never allowing the write to proceed on lookup failure ("authorization uncertainty = deny"). Denied requests return `{ "error": "Forbidden" }` with HTTP 403 and zero interpolation of any owner-identity value into the response body (confirmed by source read and grep).
- Test/Verification Truth (exact, not combined with classifier test counts): The Phase 6A/6A.1 authentication-and-ownership test suite (`scripts/test-copilot-phase6a.mjs`) contains **34 assertions**, covering route access-gate behavior, legacy-mode compatibility, and 7 pure unit assertions plus 1 static source assertion directly exercising `isOwnerOrAdmin` and its call sites. This 34-assertion count is reported separately from, and must never be added to, the 686 Phase 3/4A/5A/5C/5D/5E/5F/5F.1 classifier-suite assertions reported above — they test different subsystems (authentication/authorization vs. objection classification) and are not a combined "720 classifier tests" figure.
- DB-Backed Ownership Integration Test Provenance: `scripts/test-copilot-phase6a.mjs` includes real, complete, executable DB-backed integration test code (covering ownership scenarios OWN1, OWN2, OWN3, OWN4, OWN5, OWN6, OWN8, OWN9, OWN11, OWN12, OWN20 against actual persisted session/exchange rows), gated behind explicit non-production DB opt-in environment variables. In every verification pass to date, this sandbox environment has no reachable non-production database (confirmed negatively: no `DATABASE_URL`, no `.env` file, no `psql`, no `docker`), so this code path has never executed. **ENVIRONMENT BLOCKED — DB-BACKED OWNERSHIP INTEGRATION NOT EXECUTED.** This must not be read as a passing result, an E2E-Neon-verified result, or evidence the DB-backed scenarios have ever run; it is disclosed as blocked, not passing. OWN13 (DB-failure fail-closed) and OWN18 (`levelCEnabled=false` inert-check) are additionally not covered even when the DB guard passes.
- Playwright Provenance: Local Playwright execution was environment-blocked during Phase 6A/6A.1 verification passes (sandbox could not invoke the configured webServer command). **ENVIRONMENT BLOCKED.** No claim is made that Claude reproduced the historical local Playwright 8/8 result during these passes, and Preview Playwright was not rerun (current automation bypass secret unavailable).
- Security/Privacy Truth: Ownership denial responses are sanitized (`{"error":"Forbidden"}`, HTTP 403) with no owner-identity interpolation. No secret values (database connection strings, OAuth client secrets, `AUTH_SECRET`, Vercel bypass secrets, session tokens) are referenced anywhere in code or in this document — only environment variable *names* (`DATABASE_URL`, `ALLOWED_GOOGLE_WORKSPACE_DOMAIN`, `LEVEL_C_ENABLED`, `COPILOT_LEGACY_IDENTITY_MODE`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`). Legacy compatibility mode is untouched by Phase 6A.1 and continues to exhibit its pre-existing, disclosed, temporary-technical-debt spoofable-identity behavior by design.
- Implementation Scope: Changed/added paths: `lib/auth/ownership.ts` (new), `lib/copilot/persistence.ts` (added `getCopilotExchangeOwnership`; `getActiveCopilotSession` unchanged), `app/api/copilot/route.ts`, `app/api/copilot/feedback/route.ts`, `app/api/copilot/outcome/route.ts`, `scripts/test-copilot-phase6a.mjs`. Zero schema or migration changes — ownership authorization is derived entirely from already-persisted `advisorIdentifier` data.
- Independent Verification Outcome: The Phase 6A.1 remediation was independently re-verified from a fresh clone (fetched via GitHub origin plus a local-remote fast-forward merge to include unpushed commits), with a full source re-read, live HTTP re-probing of all three routes, fresh historical-suite and Phase-6A-suite reruns, code-quality checks, and a security review. The fix was confirmed correct, complete, and honestly tested/disclosed (including the DB-backed and Playwright environment-blocked provenance above). Verdict: **APPROVED — PHASE 6A.1 OBJECT-OWNERSHIP REMEDIATION VERIFIED; PHASE 6A FROZEN.**
- Phase 6A.1 Commit History: `bd27d1d` (implementation) and `758187b` (tests). Authoritative Phase 6A implementation freeze SHA: `758187b6456ba2ff7e891e763b71fb369a1b512a`.

---

## Progress Checklist

- [x] **Phase 0 — Repository Preparation & Navigation Audit**
  - Completed navigation audit & fixed route resolution (`c2506bd`).

- [x] **Phase 1 — UI Shell & Mock Provider**
  - Created `lib/copilot/types.ts` & `lib/copilot/providers/`.
  - Created `CopilotInput.tsx`, `CopilotResponseCard.tsx`, `OutcomeRecorder.tsx`.
  - Integrated mode switcher in `AskAIPanel.tsx`.

- [x] **Phase 2 — Knowledge OS Content Connection**
  - Implemented `lib/copilot/objection-categories.ts` & `lib/copilot/scripts-library-adapter.ts` (`f4a15c7`).

- [x] **Phase 2.5 — Architecture Reconciliation & Feature Completion**
  - Integrated Level 1 vs Level 2 response selection toggle (`85b2c16`).

- [x] **Phase 2.6 / 2.7 — Repository Integrity & Release Readiness Pass**
  - Committed missing canonical files (`lib/scripts-registry.ts`, `/docs/scripts`, etc.).
  - Fixed async `recordOutcome` bug (`a43c4aa`).

- [x] **Phase 3 — Grounded AI Reasoning Pipeline**
  - Implemented confidence engine, compound objection handling, server API route, and test matrix suite (`4b586a3`).

- [x] **Phase 3.1 — Architecture Honesty & Safety Alignment**
  - `ProductionCopilotProvider` throws explicit unconfigured error (`51c842d`).

- [x] **Phase 3.2 — Protected Span Correctness Fix**
  - Removed inert same-string `verifyProtectedSpans` call from `pipeline.ts` (`e7631d7`).

- [x] **Phase 4A — Database Foundation & Schema**
  - Created Drizzle Postgres schema for `copilot_sessions`, `copilot_exchanges`, `copilot_feedback` (`5f6600d`).

- [x] **Phase 4A.1 — Database Schema Correctness Fix**
  - Enforced real PostgreSQL `pgEnum` types for all status/reason/band/rating columns (`292f1a6`).

- [x] **Phase 4A.2 — Non-Production Neon Setup & Live DB Verification**
  - Linked Vercel development environment (`DATABASE_URL`).
  - Applied initial SQL migration (`drizzle/0000_new_shriek.sql`) to non-production Neon Postgres database (`f2bdade`).

- [x] **Phase 4B — Runtime Persistence API & Endpoints**
  - Implemented server-side persistence service `lib/copilot/persistence.ts` (`6f8c624`).

- [x] **Phase 4B Remediation — Persistence Semantics & Lifecycle Hardening**
  - Fixed false success fallback bug in `AskAIPanel.tsx` & `OutcomeRecorder.tsx` (`9f36d9d`).

- [x] **Phase 4B.1 — Product Alignment & Session Continuity Pass**
  - Implemented self-entered advisor identity with `localStorage` persistence (`b52f701`).

- [x] **Phase 4B.2 — Final Advisor / Session Boundary Remediation Pass**
  - Enforced mandatory advisor identifier on server (/api/copilot & createCopilotSession reject missing advisor with HTTP 400) (`c345dc7`).

- [x] **Phase 4B.3 — Final HTTP Contract Cleanup Pass**
  - Classified completed -> follow-up domain error as HTTP 400 in `app/api/copilot/outcome/route.ts`.
  - Updated `scripts/test-copilot-phase4b.mjs` with strict HTTP 400 and error message assertions (49/49 tests passing).
  - ZERO candidate PII, ZERO auth/users tables, ZERO script text duplication, ZERO schema changes (`c6f33b1`).

- [x] **Phase 4C — AI Provider / Persistence Separation**
  - Removed obsolete `recordOutcome` method & `OutcomePayload` import from interface & provider implementations.
  - Removed unused `NEXT_PUBLIC_COPILOT_AI_PROVIDER` from provider factory.
  - Decoupled AI provider from persistence; real outcome & feedback persistence remain in API/persistence layers (`71366ea`).

- [x] **Phase 4D — Feedback Endpoint & UI Wiring**
  - Delivered early via Phase 4B (`6f8c624`).
  - Feedback API route (`/api/copilot/feedback`) + DB persistence (`recordCopilotFeedback`) + UI thumbs-up/neutral/thumbs-down rating control active.

- [x] **Phase 4E — Advisor Identifier & LocalStorage Session Lifecycle**
  - Delivered early via Phase 4B.1–4B.3 (`b52f701`, `c345dc7`, `c6f33b1`).
  - Self-entered advisor `localStorage` attribution, tab `sessionStorage` continuity, advisor-change session boundary reset, top "Start New Conversation" control, stale-session recovery, and outcome completion lifecycle active.

- [x] **Phase 4F — Persistence Testing, Safety Scans & Data Integrity**
  - Delivered across Phase 4B–4B.3.
  - Comprehensive test matrix covering 49 Phase 4B assertions, 34 Live DB assertions, 37 Phase 4A static assertions, controlled test-owned cleanup, privacy checks, script duplication audits, and HTTP error contracts.

- [x] **Phase 5A — Pilot Correctness & Data-Trust Hardening**
  - Delivered across commits `fa4b903`, `e0fa9dc`, and `00cf894`.
  - Eliminated feedback false-success bug; `AskAIPanel` throws when response is unpersisted.
  - Added visible warning banner for non-persisted responses and disabled outcome/feedback controls.
  - Enforced canonical 4000-character objection limit on server (`/api/copilot`) and client (`CopilotInput.tsx`).
  - Added candidate PII privacy warning notice near objection input.
  - Removed browser-side Sales Copilot reasoning fallback and `getCopilotAIProvider` import from `AskAIPanel.tsx`.
  - Sanitized generic HTTP 500 database persistence error payloads in `/api/copilot/outcome/route.ts`.
  - Corrected feedback fetch `Content-Type` header to `application/json`.
  - Test suite `scripts/test-copilot-phase5a.mjs` passing 13/13 assertions (1 unit assertion, 3 real route tests, 9 static source assertions).

- [x] **Phase 5B — Pilot Access, E2E & Deployment Gate — COMPLETE**
  - Path A Vercel Authentication selected & verified on target Preview deployment (`dpl_GR7zUFyFac3PxuQwXDzK6pwwx9xh`).
  - Authoritative implementation commit: `1dc48ae48ce086ca0e5793fee96cfa4071d210f9`.
  - Preview build PASS; exact `githubCommitSha=1dc48ae` metadata matched.
  - Anonymous access protection PASS (302 redirects for `/`, `/docs/scripts`, `/api/copilot*`).
  - Non-production Preview DB separation PASS.
  - Local Playwright 8/8 PASS; Preview Playwright 3/3 PASS (0 failed, 0 flaky, 0 skipped).
  - Content audit PASS (376 scripts, 1698 text fields, 14 findings, 320 hints; 14/14 product-owner triage as acceptable context; 0 content remediation required).
  - Two-advisor manual smoke PASS (`phase5b-manual-advisor-a` `active` session `ef26b969...` vs `phase5b-manual-advisor-b` `completed` session `2e3326aa...`).
  - Session, exchange, and feedback isolation verified (100% distinct records, zero crossover).
  - Candidate privacy briefing delivered and acknowledged by both pilot advisors.
  - Rollback target verified (Phase 5A freeze `162d5ef` / `dpl_GsScHE89QGJ48QpNEBJ9LncWkGPm`, status Ready, protected by Vercel Auth).
  - Exposed bypass secret revoked/regenerated; zero secret values committed to repository.
  - LEVEL B AUTHORIZED for Controlled Internal Advisor Pilot under protected Vercel Preview.
  - LEVEL C DEFERRED; Production NOT deployed.

- [x] **Phase 5C — Live Objection Coverage & Classification Quality Hotfix — COMPLETE**
  - 4 new objection categories (`upfront-payment-resistance`, `information-request-deferral`, `not-interested`, `explicit-refusal`); existing `already-working-with-consultancy` category activated.
  - Upfront-payment live failure fixed; email-details live failure fixed; DIY primary ranking fixed.
  - Soft/hard refusal model implemented; repeated soft refusal escalation implemented.
  - Deterministic response differentiation added; near-miss keyword precision refinement added.
  - Explicit-refusal name/CRM truthfulness remediation completed (`f8142f8`).
  - Phase 5C 73/73 PASS; Phase 3/4A/5A regressions PASS.
  - Local Playwright 8/8 PASS (executed by Antigravity); Preview Playwright not rerun for Phase 5C (bypass secret unavailable).
  - Content audit: 396 scripts / 1806 fields / 14 findings / 348 hints; 0 new Phase 5C content findings.
  - Implementation frozen after Claude approval.
  - Authoritative final Phase 5C SHA: `f8142f8edad45e5784e6baab157e62d48f80da34`.

- [x] **Phase 5D — Live Sales Copilot Precision, Coverage & Advisor Quality — COMPLETE**
  - Commit 1: `d64019152eb5273aef831d65b45f9d924ba2d2fb` `fix(copilot): improve phase5d live classification precision`
  - Commit 2: `17ec7c1e77273b3951022a8dd13a57b46860b4ac` `test(copilot): add phase5d precision regression suite`
  - Commit 3: `6ebcf0f04105dbeb521a1eb802ba76b913c36c0f` `fix(copilot): resolve phase5d journey-e regression`
  - Commit 4: `cf3e9a4a5f88951244d1fa3c2d8b7bcd06b2543c` `fix(copilot): restore spouse approval secondary detection`
  - Implementation verified and frozen at SHA: `cf3e9a4a5f88951244d1fa3c2d8b7bcd06b2543c`.

- [x] **Phase 5E — Compound Objection Precision & Classifier Hardening — COMPLETE**
  - Commit 1: `ee8f3f88bb9108f11f38344e84766de0e9493308` `fix(copilot): improve phase5e compound classification precision`
  - Commit 2: `4d07453758afea9aa103310c87ec7200dc8f5d17` `test(copilot): add phase5e classifier hardening regressions`
  - Commit 3: `4c991092dd6360dff0d2bc006129b45fc34e7219` `fix(copilot): include placement guarantee keywords in trust precision guard`
  - Phase 5E regression & hardening suite: 214/214 PASS; Phase 3/4A/5A/5C/5D suites: 328/328 PASS (542/542 total assertions PASS).
  - Code Quality: `pnpm lint` 0 errors, 0 warnings; `npx tsc --noEmit` 0 errors.
  - Local Playwright 8/8 PASS; Preview Playwright not rerun for Phase 5E (bypass secret unavailable).
  - Content audit: 396 scripts / 1806 fields / 14 findings / 348 hints; 0 new Phase 5E content findings.
  - Implementation verified and frozen at SHA: `4c991092dd6360dff0d2bc006129b45fc34e7219`.

- [x] **Phase 5F — Secondary Coherence, Word-Boundary Safety & Test Integrity — COMPLETE**
  - Commit 1: `c099d9c29ecf4415ad7c8b9bbbc3b046cde42ef3` `fix(copilot): harden phase5f secondary coherence and phrase boundaries`
  - Commit 2: `c690ac61bcc49686b1e16ea2087b448c4e280d08` `test(copilot): add phase5f secondary integrity regressions`
  - Word-boundary-safe `prove`/`proof` matching; Step 6 secondary-selection fix for Step 4.5-promoted primaries; compound test assertion strengthening.
  - Independent adversarial verification found 4 blocking regressions and 2 Should-Fix items introduced alongside these fixes (see Phase 5F.1 below); the word-boundary and secondary-selection fixes themselves were confirmed correct and not regressed.
  - Superseded by Phase 5F.1 remediation; implementation frozen only as of the Phase 5F.1 SHA below.

- [x] **Phase 5F.1 — Context-Guard Remediation — COMPLETE**
  - Commit 1: `7310673db6f4065b20a974737cf11285fd52fde1` `fix(copilot): guard phase5f contextual phrase matching`
  - Commit 2: `b09c9287f2cc9996fae209a6c01cf7cb41e14877` `test(copilot): add phase5f adversarial regression coverage`
  - Fixed all 4 Phase 5F blocking regressions (trust non-program-term suppression, budget context, fee technical-context, pricing technical-context) and 2 Should-Fix items (timing candidate-subject framing, Step 4.6 narrowing) with narrow deterministic guards.
  - Phase 3/4A/5A/5C/5D/5E/5F suites: 686/686 total assertions PASS, independently re-verified in a fresh clone.
  - Code Quality: `pnpm lint` 0 errors, 0 warnings; `npx tsc --noEmit` 0 errors after normal project codegen.
  - Local Playwright environment-blocked during independent verification; Preview Playwright not rerun (bypass secret unavailable).
  - Content audit: 396 scripts / 1806 fields / 14 findings; 0 new Phase 5F.1 content findings.
  - Independent verification found no blocking defects; 3 non-blocking residual Should-Fix hardening items recorded above.
  - Implementation verified and frozen at SHA: `b09c9287f2cc9996fae209a6c01cf7cb41e14877`.

- [x] **Phase 6A — Application Authentication, Advisor Identity & Object Ownership — COMPLETE**
  - Authentication commits: `2cb8cc0` `feat(copilot): add authjs authentication and advisor identity`, `40e9217` (Phase 6A test/QA completion).
  - Remediation commits: `bd27d1d` `fix(copilot): enforce object-ownership authorization on session/exchange/feedback/outcome routes`, `758187b` `test(copilot): add phase6a1 object-ownership regression coverage`.
  - Auth.js (`next-auth@5.0.0-beta.32` + `@auth/drizzle-adapter@1.11.3`) Google OAuth, database session strategy, fail-closed `ALLOWED_GOOGLE_WORKSPACE_DOMAIN` restriction. Dual mutually-exclusive gates `LEVEL_C_ENABLED` / `COPILOT_LEGACY_IDENTITY_MODE`, fail-closed 503 default when neither is set.
  - Independent verification (2 passes) found initial Phase 6A implemented authentication correctly but omitted object-level ownership checks — a BLOCKING defect, reproduced identically both times. See narrative section above for full history; this finding is preserved, not erased.
  - Phase 6A.1 remediation added a single shared `isOwnerOrAdmin()` decision function (`lib/auth/ownership.ts`) and per-route ownership checks on `/api/copilot`, `/api/copilot/feedback`, `/api/copilot/outcome`, resolved from persisted `advisorIdentifier` data only (zero schema/migration changes).
  - Test/Verification Truth: `scripts/test-copilot-phase6a.mjs` — **34/34 assertions PASS** (authentication, legacy-mode compatibility, ownership unit + static assertions), reported separately from the 686 Phase 3–5F.1 classifier assertions (not combined). Historical classifier suites reconfirmed passing alongside these runs.
  - DB-Backed Ownership Integration: **ENVIRONMENT BLOCKED — DB-BACKED OWNERSHIP INTEGRATION NOT EXECUTED** (no reachable non-production database in this sandbox; not claimed as passing or E2E-Neon-verified).
  - Playwright: **ENVIRONMENT BLOCKED** (local webServer command not invokable in sandbox); Preview Playwright not rerun (bypass secret unavailable). No claim of historical 8/8 reproduction during these passes.
  - Code Quality: `pnpm lint` 0 errors, 0 warnings; `tsc --noEmit` 0 errors after normal project codegen.
  - Independent re-verification (fresh clone, live HTTP re-probing, security review) confirmed the fix correct, complete, and honestly disclosed. Verdict: APPROVED — PHASE 6A.1 OBJECT-OWNERSHIP REMEDIATION VERIFIED; PHASE 6A FROZEN.
  - Implementation verified and frozen at SHA: `758187b6456ba2ff7e891e763b71fb369a1b512a`.

- [ ] **Phase 6B — Correction Capture & Classifier-Version Audit Trail — REMEDIATION COMPLETE (Pending Independent Verification)**
  - Schema & Migration: `copilot_corrections` table added via additive migration `0002_strong_paper_doll.sql`; `classifier_version` column added to `copilot_exchanges` with historical 4-step honesty sequence (`legacy-unversioned` backfill -> redundant UPDATE -> SET NOT NULL -> DROP DEFAULT).
  - Validation: Pure unit-level taxonomy validation `validateCorrectionInput` (`lib/copilot/correction-validation.ts`) enforcing valid primary, max 5 secondaries, mutual exclusivity, and reason length (max 500 chars).
  - Authorization & Routing: Level-C-only POST `/api/copilot/correction` endpoint with strict server-derived actor identity and Phase 6A.1 object-ownership verification (`isOwnerOrAdmin`).
  - UI & Remediation (B1): `CopilotResponseCard.tsx` shared `renderCorrectionSection` rendered in both normal and `isRefusal`/`unclassified` branches with bounded UX (max 5 secondaries); `AskAIPanel.tsx` wired with `onCorrect`.
  - Non-Production DB Gate: Executed and passing live against isolated non-production Neon database (10/10 DB assertions, `CORR-D1` through `CORR-D9`).
  - Test Truth: `scripts/test-copilot-phase6b.mjs` — **52/52 assertions PASS** (Part A Unit 17/17, Part B Static 19/19, Part C HTTP 6/6, Part D DB-backed 10/10).
  - Closure Stance: Remediation implemented and tested; formal closure pending fresh independent verification.

---

## Current Release Stance

**PHASE 6A IMPLEMENTATION (APPLICATION AUTHENTICATION, ADVISOR IDENTITY & OBJECT OWNERSHIP) VERIFIED AND FROZEN AT `758187b6456ba2ff7e891e763b71fb369a1b512a`.**

**LEVEL B CONTROLLED INTERNAL ADVISOR PILOT CONTINUES — AUTHORIZED.**

**LEVEL C READINESS WORK (AUTHENTICATION, OBJECT-OWNERSHIP & CORRECTION AUDIT FOUNDATIONS) IS AUTHORIZED TO CONTINUE.**

**LEVEL C ACTIVATION (public/general availability) REMAINS NOT AUTHORIZED.** Do not prematurely close Level C readiness — the authentication, ownership, and correction audit foundations above are necessary but not, by themselves, sufficient for Level C activation; the remaining pre-activation requirements below must still be satisfied and separately authorized.

**PRODUCTION NOT AUTHORIZED / NOT DEPLOYED.**

### Explicit Level-B Operating Boundaries:
- Internal authorized sales advisors only (5–10 participating advisors).
- Vercel Authentication remains mandatory for Preview deployment access.
- Preview non-production Neon database only (verified non-production Preview database).
- No candidate PII permitted in objection input text.
- Production deployment is NOT authorized and NOT deployed.
- Level C / public release is NOT authorized.

### Remaining Pre-Level-C-Activation Requirements (not exhaustive, none yet authorized as complete):
- DB-backed object-ownership integration scenarios (OWN1–OWN20, see Phase 6A.1 above) must actually execute and pass against a reachable non-production database — this has not yet occurred in any verification pass to date (environment-blocked every time).
- Local and/or Preview Playwright E2E suites must be rerun end-to-end against the Level C authenticated flow, including the ownership-denial paths — not yet rerun since Phase 6A.1 (environment-blocked locally; Preview bypass secret unavailable).
- Application-level rate limiting on the three Copilot routes (see Future/Deferred Work below) remains unimplemented.
- Production LLM provider integration remains unimplemented (mock provider still active).
- Broader advisor/admin provisioning, offboarding, and role-management operational process has not been formally defined beyond the current Auth.js + domain-restriction mechanism.
- Explicit Product Owner sign-off to move from "Level C readiness" to "Level C activation" has not been given.

---

## Future / Deferred Work (Level C & Post-Pilot Roadmap)

The following items are deferred to future Level C / post-pilot phases and do NOT block Level B pilot authorization:
1. **Scripts Library Server-Rendering & Registry Streaming:** Revisit `components/scripts/ScriptsLibraryView.tsx` direct `SCRIPTS_REGISTRY` import before public Level C release to migrate client-side registry exposure to server-rendered components.
2. **Application-Level Auth & RBAC:** Implement fine-grained application-level authentication/RBAC if required for full production deployment.
3. **Application-Level Rate Limiting:** Implement route-level rate limiting and abuse-prevention middleware prior to public release.
4. **CI/CD Integration:** Wire Playwright E2E suites into automated CI/CD build pipelines.
5. **Production LLM Provider Integration:** Implement and configure real LLM provider (`ICopilotAIProvider`) for production reasoning.
6. **Automated Data Retention & Session Cleanup:** Build automated retention policies for historical copilot sessions, exchanges, and feedback.
7. **Observability & Telemetry:** Implement production telemetry, error monitoring, and reasoning performance metrics.
8. **Transactional & Idempotency Hardening:** Add transactional database operations for multi-step exchange/feedback flows.
9. **Production Launch Planning:** Establish full production infrastructure, domain routing, and go-live deployment procedures.
10. **Resume-Format Disinterest Contextual Guard (RESOLVED IN PHASE 5D):** Contextual not-interested exclusions now prevent resume-format disinterest ("I'm not interested in changing my resume format") from being treated as sales disengagement.
11. **Compound DIY + Timing Secondary Recognition (RESOLVED IN PHASE 5E):** Compound input *"I want to try myself for another month, then I'll think about your program"* now classifies as `already-applying-myself` primary + `need-time-to-think` secondary.
12. **Dead Classifier Function Cleanup (Non-Blocking):** `findMatchingObjectionCategory` in `lib/copilot/scripts-library-adapter.ts` remains uncalled technical debt with 0 call sites. Kept as non-blocking cleanup. Reconfirmed unchanged as of Phase 5F.1.
13. **Trust Substring Collision Refinement (RESOLVED IN PHASE 5F):** Word-boundary-safe matching (`hasBoundaryMatch`) applied to `prove`/`proof` phrases prevents matching inside `approve`/`improve`. `"My wife has to approve this"` no longer produces a spurious `trust-and-credibility` secondary.
14. **Secondary-Selection After Primary Promotion (RESOLVED IN PHASE 5F):** Step 6 secondary-selection logic now iterates all sorted signals and excludes the primary by category ID rather than array index, so a Step 4.5-promoted-away signal (e.g. `not-interested`) is correctly retained as secondary.
15. **Compound Test Quality Refinement (RESOLVED IN PHASE 5F):** The approx. 13 weak `A OR B primary` compound assertions were replaced with explicit primary-and-secondary assertions.
16. **Candidate-Budget Residual Breadth (Should-Fix, Non-Blocking, identified in Phase 5F.1 independent verification):** `candidateBudgetContext` includes the literal term `"my budget"`, which is trivially satisfied whenever the trigger phrase itself is `"my budget is limited"`, allowing first-person budget statements outside a genuine service-affordability context (e.g. `"My budget is limited for AWS infrastructure."`) to still classify as `price-objection`. Future hardening should require an additional service/program-affordability signal.
17. **`DATA_SCHEMA_CONTEXT_TERMS` Residual Breadth (Should-Fix, Non-Blocking, identified in Phase 5F.1 independent verification):** The technical-context term list does not cover every technical term (e.g. `parameter`, `variable`, `backend`, `function` are absent), so statements like `"I don't want another fee parameter."` or `"Send the pricing variable to the function."` may still misclassify. Future hardening should extend the term list or use a more general technical-context heuristic.
18. **Pre-Existing Consultancy Breadth (Should-Fix, Non-Blocking, identified in Phase 5F.1 independent verification):** Statements such as `"I already paid another company because they designed my website."` may still classify as `already-working-with-consultancy` due to a pre-existing exact-phrase match in `examplePhrases`, independent of the (correctly narrowed) Step 4.6 override. Recorded as residual generic-classifier breadth for future precision hardening.
19. **Timing Design Note — Plural Candidate Framing (Non-Blocking, Not a Defect):** `"We'll decide next week."` remains unclassified since the Phase 5F.1 candidate-subject restriction only recognizes singular first-person framing (`"I'll"`, `"I will"`, `"let me"`). This is a defensible design choice recorded for clarity, not a bug.
20. **Phase 6B — Correction Capture & Classifier-Version Audit Trail (IMPLEMENTED & REMEDIATED — DB Gate Passing; Pending Fresh Independent Verification):** Append-only classification correction logging (`copilot_corrections` table) and classifier engine version stamping (`classifier_version` on `copilot_exchanges` initialized with 4-step honesty sequence) implemented and protected under Level C authenticated ownership authorization (`/api/copilot/correction`). B1 UI control-flow remediation connects correction interface to both normal and unclassified/refusal outcomes with bounded secondary selection (max 5). Phase 6B DB-backed integration gate verified live on isolated non-production database (10/10 assertions PASS). Formal closure remains pending fresh independent verification.
