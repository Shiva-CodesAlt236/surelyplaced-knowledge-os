# Sales Copilot — Phase 5B Release Checklist & Rollback Procedure

> [!WARNING]
> **IMPORTANT:** PHASE 5B IMPLEMENTATION DOES NOT ITSELF AUTHORIZE PILOT RELEASE.
> **LEVEL B (CONTROLLED INTERNAL ADVISOR PILOT)** IS ALLOWED ONLY WHEN EVERY MANDATORY GATE BELOW IS STATUS: PASS.

---

## 1. Release Overview & Scope Lock

- **Deployment Target:** SurelyPlaced Knowledge OS (Preview Deployment)
- **Local Path:** `E:\SurelyPlacedOS\surelyplaced-knowledge-os`
- **Branch:** `feature/sales-copilot-mvp`
- **Phase 5A Freeze Commit:** `162d5ef9a43428abc0cebc9a877387996a801e97`
- **Phase 5B Release Candidate Commit:** `[TO BE FILLED DURING FINAL OPERATIONAL VERIFICATION]`
- **Target Pilot Population:** 5–10 Internal SurelyPlaced Sales Advisors
- **Access Boundary Architecture:** **Path A — Vercel Authentication** (Standard Vercel Deployment Protection on Preview; Automation Bypass for E2E testing).

---

## 2. Mandatory Release Gates

### Gate A: Git & Baseline Integrity
- [x] **A.1** Working tree clean on `feature/sales-copilot-mvp` branch (**STATUS: PASS**).
- [x] **A.2** Local `HEAD` matches `origin/feature/sales-copilot-mvp` (`0 0` count divergence) (**STATUS: PASS**).
- [x] **A.3** Phase 4 and Phase 5A freeze ancestry verified; Phase 5A freeze `162d5ef` remains the immutable Phase 5B implementation baseline and ancestor of the current release candidate (**STATUS: PASS**).

### Gate B: Preview Build Verification
- [ ] **B.1** Target Vercel Preview deployment builds successfully (**STATUS: PENDING — Preview Deployment**).
- [ ] **B.2** Preview artifact completes static/page generation without build errors (**STATUS: PENDING**).

### Gate C: Offline Test Suite Verification
- [x] **C.1** `pnpm lint` completes with 0 ESLint errors/warnings (**STATUS: PASS**).
- [x] **C.2** `npx tsc --noEmit` completes with 0 TypeScript errors (**STATUS: PASS**).
- [x] **C.3** `pnpm exec tsx scripts/test-copilot-phase3.mjs` PASSED (35/35 tests) (**STATUS: PASS**).
- [x] **C.4** `pnpm exec tsx scripts/test-copilot-phase4a.mjs` PASSED (37/37 static tests) (**STATUS: PASS**).
- [x] **C.5** `pnpm exec tsx scripts/test-copilot-phase5a.mjs` PASSED (13/13 assertions) (**STATUS: PASS**).

### Gate D: Live Non-Production DB Suite Verification
- [x] **D.1** Environment configured with `COPILOT_DB_ENV=development` and `COPILOT_DB_TEST_ALLOW_NON_PROD=true` (**STATUS: PASS**).
- [x] **D.2** `pnpm exec tsx scripts/test-copilot-phase4-live.mjs` PASSED (34/34 assertions against Neon non-prod DB) (**STATUS: PASS**).
- [x] **D.3** `pnpm exec tsx scripts/test-copilot-phase4b.mjs` PASSED (49/49 assertions against Neon non-prod DB) (**STATUS: PASS**).

### Gate E: Content Safety Audit & Human Triage
- [x] **E.1** `pnpm exec tsx scripts/audit-scripts-registry-claims.mjs` executed (376 scripts, 1698 fields audited, 14 findings) (**STATUS: PASS — Automated Audit Executed**).
- [ ] **E.2** All 14 automated findings manually reviewed and triaged by product owner (**STATUS: PENDING — Human Content Triage**).
- [ ] **E.3** Zero unresolved content remediation findings remaining (**STATUS: PENDING**).

### Gate F: Vercel Access Protection (Path A)
- [ ] **F.1** Vercel Deployment Protection enabled for target Preview deployment ("Vercel Authentication") (**STATUS: PENDING — Vercel Config**).
- [ ] **F.2** Target 5–10 internal advisors granted Vercel team/project access (**STATUS: PENDING**).
- [ ] **F.3** Protection Bypass for Automation enabled in Vercel project settings (**STATUS: PENDING**).
- [ ] **F.4** `VERCEL_AUTOMATION_BYPASS_SECRET` set securely in test/CI execution environment (**STATUS: PENDING**).

### Gate G: Anonymous API & Page Protection Gate
- [ ] **G.1** Direct unauthenticated HTTP GET to Preview root (`/`) returns Vercel Authentication challenge (**STATUS: PENDING — Anonymous Protection**).
- [ ] **G.2** Direct unauthenticated HTTP GET to `/docs/scripts` returns Vercel Authentication challenge (**STATUS: PENDING**).
- [ ] **G.3** Direct unauthenticated HTTP POST to `/api/copilot` returns Vercel Authentication challenge (**STATUS: PENDING**).
- [ ] **G.4** Direct unauthenticated HTTP POST to `/api/copilot/feedback` returns Vercel Authentication challenge (**STATUS: PENDING**).
- [ ] **G.5** Direct unauthenticated HTTP POST to `/api/copilot/outcome` returns Vercel Authentication challenge (**STATUS: PENDING**).

### Gate H: Environment & Database Separation Verification
- [ ] **H.1** Preview environment `DATABASE_URL` confirmed pointing strictly to Non-Production Neon Postgres instance (**STATUS: PENDING — Preview DB Separation**).
- [ ] **H.2** `COPILOT_DB_ENV` in Preview configured as `preview` or `development` (**STATUS: PENDING**).
- [ ] **H.3** Zero production databases or live CRM instances connected to pilot environment (**STATUS: PENDING**).

### Gate I: Playwright Local E2E Journeys
- [x] **I.1** `pnpm exec playwright test --project=local` executed against local app (**STATUS: PASS**).
- [x] **I.2** All 8 local E2E journeys PASSED (Journey A: Open & analyze, Journey B: Feedback persistence with primary class assertion, Journey C: Follow-up outcome, Journey D: Completion outcome, Journey E: Refresh session-ID continuity, Journey F: Start new conversation, Journey G: Network failure handling, Journey H: Not-persisted response disables controls) (**STATUS: PASS**).

### Gate J: Playwright Preview Smoke Suite
- [ ] **J.1** `PLAYWRIGHT_PREVIEW_URL` and `VERCEL_AUTOMATION_BYPASS_SECRET` configured in environment (**STATUS: PENDING — Preview Smoke**).
- [ ] **J.2** `pnpm exec playwright test --project=preview` executed against protected Preview deployment (**STATUS: PENDING**).
- [ ] **J.3** All 3 Preview smoke tests PASSED (Preview 1: Protected bypass access, Preview 2: Core persisted journey, Preview 3: Session-ID continuity smoke) (**STATUS: PENDING**).

### Gate K: Candidate Privacy & Data Trust
- [x] **K.1** Candidate PII Warning banner visible on `CopilotInput.tsx` (`"Do not include candidate names, email addresses, phone numbers..."`) (**STATUS: PASS — Implemented Behavior**).
- [ ] **K.2** Participating advisors briefed not to enter real candidate PII during pilot (**STATUS: PENDING — Operational Briefing**).

### Gate L: Scripts Library Client Exposure Stance
- [ ] **L.1** Confirmed `/docs/scripts` is protected under Vercel Authentication on Preview (**STATUS: PENDING — Preview Scripts-Route Protection**).
- [ ] **L.2** Accepted for Level B pilot: `components/scripts/ScriptsLibraryView.tsx` direct import of `SCRIPTS_REGISTRY` is acceptable behind internal Vercel Auth, but must be revisited for server-rendered streaming before Level C public release (**STATUS: PENDING Verification**).

### Gate M: Manual Two-Advisor Smoke Verification (Human Execution Gate)
- [ ] **M.1** **Advisor A Smoke:** Advisor logs into Preview, enters advisor name `phase5b-manual-advisor-a`, analyzes objection, submits feedback rating, records follow-up, refreshes page, verifies session continuity (**STATUS: PENDING — Pilot Launch**).
- [ ] **M.2** **Advisor B Smoke:** Advisor B logs into Preview on separate device/session, enters name `phase5b-manual-advisor-b`, analyzes objection, records enrolled outcome (**STATUS: PENDING — Pilot Launch**).
- [ ] **M.3** **Isolation Verification:** Read-only database query verifies distinct session records, distinct exchange IDs, and zero cross-advisor data contamination (**STATUS: PENDING — Pilot Launch**).

---

## 3. Operational Rollback Procedure

### Rollback Triggers
1. Vercel Authentication fails or unauthenticated requests reach application/API endpoints.
2. Copilot API error rate spike or Neon DB connection failure.
3. Advisor identity or session data cross-contamination detected.
4. Content safety violation identified by pilot advisors.
5. Critical browser crash or E2E failure on Preview deployment.

### Rollback Target
- **Rollback Target:** Phase 5A Freeze commit `162d5ef9a43428abc0cebc9a877387996a801e97` or verified approved Preview release candidate.

### Rollback Steps
1. **Stop Advisor Usage:** Request pilot advisors to cease using the failing Preview deployment URL.
2. **Identify Known-Good Target:** Identify the known-good Phase 5A baseline commit (`162d5ef`) or prior approved Preview release candidate.
3. **Restore Target Preview:** Provide advisors the known-good protected Preview URL or restore the relevant branch/preview alias using the verified Vercel dashboard mechanism.
4. **Database Impact Audit:** Run read-only cleanup query targeting pilot test rows:
   ```sql
   SELECT count(*) FROM copilot_sessions WHERE advisor_identifier LIKE 'phase5b-%';
   ```
   *(Note: Zero schema migrations exist in Phase 5B; database rollback requires no DDL reverts).*
5. **Post-Rollback Verification:** Verify Vercel Authentication remains enabled on the target Preview deployment before resuming pilot usage.

---

## 4. Final Pilot Authorization Gate Summary

| Gate Category | Status | Evaluated By | Date / Timestamp |
|---|---|---|---|
| Gate A (Git & Baseline Integrity) | **PASS** | Automated Verification | 2026-08-12 |
| Gate B (Preview Build Verification) | **PENDING** | Preview Deployment | [Pending Preview Deployment] |
| Gate C (Offline Test Suite) | **PASS** | Offline Test Matrix | 2026-08-12 |
| Gate D (Live Non-Prod DB Suite) | **PASS** | Neon Non-Prod DB Suite | 2026-08-12 |
| Gate E (Content Safety Audit & Triage) | **PENDING** | Human Content Triage | [Pending Product Owner Review] |
| Gate F (Vercel Authentication) | **PENDING** | DevOps / Admin | [Pending Vercel Config] |
| Gate G (Anonymous API Protection) | **PENDING** | Verification Curl | [Pending Preview Deployment] |
| Gate H (Preview DB Separation) | **PENDING** | Preview Neon DB Verification | [Pending Preview Deployment] |
| Gate I (Playwright Local E2E 8/8) | **PASS** | Playwright Local Suite | 2026-08-12 |
| Gate J (Playwright Preview Smoke 3/3) | **PENDING** | Playwright Preview Suite | [Pending Preview Deployment] |
| Gate K (Candidate Privacy Stance) | **PASS (Code) / PENDING (Operational)** | Code Banner / Pilot Briefing | 2026-08-12 |
| Gate L (Preview Scripts-Route Protection) | **PENDING** | Preview Verification | [Pending Preview Deployment] |
| Gate M (Manual 2-Advisor Smoke) | **PENDING** | Pilot Advisors | [Pending Pilot Launch] |

**FINAL LEVEL B PILOT AUTHORIZATION:**
`LEVEL B RELEASE PENDING MANDATORY PREVIEW DEPLOYMENT & MANUAL SMOKE GATES`
