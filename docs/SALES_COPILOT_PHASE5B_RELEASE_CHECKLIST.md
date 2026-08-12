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
- **Phase 5B Release Candidate Commit:** `[TO BE FILLED AFTER COMMIT]`
- **Target Pilot Population:** 5–10 Internal SurelyPlaced Sales Advisors
- **Access Boundary Architecture:** **Path A — Vercel Authentication** (Standard Vercel Deployment Protection on Preview; Automation Bypass for E2E testing).

---

## 2. Mandatory Release Gates

### Gate A: Git & Baseline Integrity
- [ ] **A.1** Working tree clean on `feature/sales-copilot-mvp` branch.
- [ ] **A.2** Local `HEAD` matches `origin/feature/sales-copilot-mvp` (`0 0` count divergence).
- [ ] **A.3** Phase 4 and Phase 5A freeze ancestry verified (`162d5ef` is direct parent).

### Gate B: Production Build Verification
- [ ] **B.1** `pnpm build` completes with exit code 0 (`✓ Compiled successfully`).
- [ ] **B.2** Zero static page generation errors (360+ pages rendered).

### Gate C: Regression Test Suite Verification (Offline)
- [ ] **C.1** `pnpm lint` completes with 0 ESLint errors/warnings.
- [ ] **C.2** `npx tsc --noEmit` completes with 0 TypeScript errors.
- [ ] **C.3** `pnpm exec tsx scripts/test-copilot-phase3.mjs` PASSED (35/35 tests).
- [ ] **C.4** `pnpm exec tsx scripts/test-copilot-phase4a.mjs` PASSED (37/37 static tests).
- [ ] **C.5** `pnpm exec tsx scripts/test-copilot-phase5a.mjs` PASSED (13/13 assertions: 1 unit, 3 real route, 9 static source).

### Gate D: Live Non-Production DB Suite Verification
- [ ] **D.1** Environment configured with `COPILOT_DB_ENV=development` (or `preview`) and `COPILOT_DB_TEST_ALLOW_NON_PROD=true`.
- [ ] **D.2** `pnpm exec tsx scripts/test-copilot-phase4-live.mjs` PASSED (34/34 assertions against Neon non-prod DB).
- [ ] **D.3** `pnpm exec tsx scripts/test-copilot-phase4b.mjs` PASSED (49/49 assertions against Neon non-prod DB).

### Gate E: Content Safety Audit & Human Triage
- [ ] **E.1** `pnpm exec tsx scripts/audit-scripts-registry-claims.mjs` executed (376 scripts, 804 fields audited).
- [ ] **E.2** All 10 automated findings manually reviewed and classified:
  - Findings [1]-[10]: All 10 findings relate to training scripts on handling candidate discount requests without inventing or promising discounts.
  - Classification: **FALSE POSITIVE / ACCEPTABLE CONTEXT** (Instructional training content).
- [ ] **E.3** ZERO unresolved `CONTENT REMEDIATION REQUIRED` findings remaining.

### Gate F: Vercel Access Protection (Path A)
- [ ] **F.1** Vercel Deployment Protection enabled for target Preview deployment ("Vercel Authentication").
- [ ] **F.2** Target 5–10 internal advisors granted Vercel team/project access or SSO privileges.
- [ ] **F.3** Protection Bypass for Automation enabled in Vercel project settings.
- [ ] **F.4** `VERCEL_AUTOMATION_BYPASS_SECRET` set securely in test/CI execution environment (never printed/hardcoded).

### Gate G: Anonymous API & Page Protection Gate
- [ ] **G.1** Direct unauthenticated HTTP GET to Preview root (`/`) returns Vercel Authentication challenge (HTTP 401/403/redirect) rather than application page.
- [ ] **G.2** Direct unauthenticated HTTP GET to `/docs/scripts` returns Vercel Authentication challenge.
- [ ] **G.3** Direct unauthenticated HTTP POST to `/api/copilot` returns Vercel Authentication challenge (does NOT reach application or DB).
- [ ] **G.4** Direct unauthenticated HTTP POST to `/api/copilot/feedback` returns Vercel Authentication challenge.
- [ ] **G.5** Direct unauthenticated HTTP POST to `/api/copilot/outcome` returns Vercel Authentication challenge.

### Gate H: Environment & Database Separation Verification
- [ ] **H.1** Preview environment `DATABASE_URL` confirmed pointing strictly to Non-Production Neon Postgres instance.
- [ ] **H.2** `COPILOT_DB_ENV` in Preview configured as `preview` or `development` (never `production`).
- [ ] **H.3** Zero production databases or live CRM instances connected to pilot environment.

### Gate I: Playwright Local E2E Journeys
- [ ] **I.1** `pnpm exec playwright test --project=local` executed against local dev app.
- [ ] **I.2** All 7 local E2E journeys PASSED (Journey A: Open & analyze, Journey B: Feedback persistence, Journey C: Follow-up outcome, Journey D: Completion outcome, Journey E: Refresh continuity, Journey F: Start new conversation, Journey G: Network failure handling).

### Gate J: Playwright Preview Smoke Suite
- [ ] **J.1** `PLAYWRIGHT_PREVIEW_URL` and `VERCEL_AUTOMATION_BYPASS_SECRET` configured in environment.
- [ ] **J.2** `pnpm exec playwright test --project=preview` executed against protected Preview deployment.
- [ ] **J.3** All 3 Preview smoke tests PASSED (Preview 1: Protected bypass access, Preview 2: Core persisted journey, Preview 3: Session continuity smoke).

### Gate K: Candidate Privacy & Data Trust
- [ ] **K.1** Candidate PII Warning banner visible on `CopilotInput.tsx` (`"Do not include candidate names, email addresses, phone numbers, or other personal information."`).
- [ ] **K.2** Participating advisors briefed not to enter real candidate PII during pilot.

### Gate L: Scripts Library Client Exposure Stance
- [ ] **L.1** Confirmed `/docs/scripts` is protected under Vercel Authentication on Preview.
- [ ] **L.2** Accepted for Level B pilot: `components/scripts/ScriptsLibraryView.tsx` direct import of `SCRIPTS_REGISTRY` is acceptable behind internal Vercel Auth, but must be revisited for server-rendered streaming before Level C public release.

### Gate M: Manual Two-Advisor Smoke Verification (Human Execution Gate)
- [ ] **M.1** **Advisor A Smoke:** Advisor logs into Preview, enters advisor name `phase5b-manual-advisor-a`, analyzes objection, submits feedback rating, records follow-up, refreshes page, verifies session continuity.
- [ ] **M.2** **Advisor B Smoke:** Advisor B logs into Preview on separate device/session, enters name `phase5b-manual-advisor-b`, analyzes objection, records enrolled outcome.
- [ ] **M.3** **Isolation Verification:** Read-only database query verifies distinct session records, distinct exchange IDs, and zero cross-advisor data contamination.

---

## 3. Operational Rollback Procedure

### Rollback Triggers
1. Vercel Authentication fails or unauthenticated requests reach application/API endpoints.
2. Copilot API error rate spike or Neon DB connection failure.
3. Advisor identity or session data cross-contamination detected.
4. Content safety violation identified by pilot advisors.
5. Critical browser crash or E2E failure on Preview deployment.

### Rollback Target
- **Rollback Commit:** `162d5ef9a43428abc0cebc9a877387996a801e97` (Phase 5A Frozen Baseline).
- **Rollback Deployment:** Redeploy known-good commit `162d5ef` to Vercel Preview or point advisors to prior stable Preview deployment URL.

### Rollback Steps
1. **Notify Pilot Advisors:** Request pilot advisors to cease using current Preview URL.
2. **Promote Rollback Deployment:** In Vercel Dashboard, promote previous known-good deployment (`162d5ef`) to the active Preview domain.
3. **Database Impact Audit:** Run read-only cleanup query targeting pilot test rows:
   ```sql
   SELECT count(*) FROM copilot_sessions WHERE advisor_identifier LIKE 'phase5b-%';
   ```
   *(Note: Zero schema migrations exist in Phase 5B; database rollback requires no DDL reverts).*
4. **Post-Rollback Verification:** Verify previous deployment is active and protected under Vercel Authentication.

---

## 4. Final Pilot Authorization Gate

| Gate Category | Status (PASS / PENDING / FAIL) | Evaluated By | Date / Timestamp |
|---|---|---|---|
| Gates A–E (Code & Offline Tests) | **PASS** | Automated Suite | 2026-08-11 |
| Gate F (Vercel Authentication) | **PASS / PENDING** | DevOps / Admin | [Pending Vercel Config] |
| Gate G (Anonymous API Protection) | **PASS / PENDING** | Verification Curl | [Pending Preview URL] |
| Gate H (Environment Separation) | **PASS** | Neon DB Audit | 2026-08-11 |
| Gate I (Playwright Local E2E) | **PASS** | Playwright Local | 2026-08-11 |
| Gate J (Playwright Preview Smoke) | **PASS / PENDING** | Playwright Preview | [Pending Preview URL] |
| Gate K–L (Privacy & IP Stance) | **PASS** | Architecture Review | 2026-08-11 |
| Gate M (Manual 2-Advisor Smoke) | **PENDING** | Pilot Advisors | [Pending Pilot Launch] |

**FINAL LEVEL B PILOT AUTHORIZATION:**
`LEVEL B RELEASE PENDING MANDATORY PREVIEW DEPLOYMENT & MANUAL SMOKE GATES`
