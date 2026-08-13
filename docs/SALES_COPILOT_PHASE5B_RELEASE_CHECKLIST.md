# Sales Copilot — Phase 5B Release Checklist & Rollback Procedure

> [!NOTE]
> **PHASE 5B IMPLEMENTATION & OPERATIONAL GATES COMPLETE.**
> **LEVEL B (CONTROLLED INTERNAL ADVISOR PILOT)** IS AUTHORIZED UNDER PROTECTED VERCEL PREVIEW.
> **LEVEL C / PRODUCTION DEPLOYMENT IS NOT AUTHORIZED.**

---

## 1. Release Overview & Scope Lock

- **Deployment Target:** SurelyPlaced Knowledge OS (Preview Deployment)
- **Local Path:** `E:\SurelyPlacedOS\surelyplaced-knowledge-os`
- **Branch:** `feature/sales-copilot-mvp`
- **Phase 5A Freeze Commit:** `162d5ef9a43428abc0cebc9a877387996a801e97`
- **Phase 5B Release Candidate Commit:** `1dc48ae48ce086ca0e5793fee96cfa4071d210f9`
- **Target Pilot Population:** 5–10 Internal SurelyPlaced Sales Advisors
- **Access Boundary Architecture:** **Path A — Vercel Authentication** (Standard Vercel Deployment Protection on Preview; Automation Bypass for E2E testing).
- **Security Incident Record:** During initial operational setup, an Automation Bypass Secret was temporarily exposed in a local prompt. The credential was immediately revoked/invalidated in Vercel project settings, and a replacement secret was generated. All 3/3 Preview Playwright tests executed successfully using the regenerated credential. No secret values are committed to the repository.

---

## 2. Mandatory Release Gates

### Gate A: Git & Baseline Integrity
- [x] **A.1** Working tree clean on `feature/sales-copilot-mvp` branch (**STATUS: PASS**).
- [x] **A.2** Local `HEAD` matches `origin/feature/sales-copilot-mvp` (`0 0` count divergence) (**STATUS: PASS**).
- [x] **A.3** Phase 4 and Phase 5A freeze ancestry verified; Phase 5A freeze `162d5ef` remains the immutable Phase 5B implementation baseline and ancestor of current release candidate `1dc48ae` (**STATUS: PASS**).

### Gate B: Preview Build Verification
- [x] **B.1** Target Vercel Preview deployment builds successfully (`dpl_GR7zUFyFac3PxuQwXDzK6pwwx9xh`, deployment Ready) (**STATUS: PASS**).
- [x] **B.2** Preview artifact completes static/page generation without build errors; exact `githubCommitSha=1dc48ae48ce086ca0e5793fee96cfa4071d210f9` metadata matched (**STATUS: PASS**).

### Gate C: Offline Test Suite Verification
- [x] **C.1** `pnpm lint` completes with 0 ESLint errors/warnings (**STATUS: PASS**).
- [x] **C.2** `npx tsc --noEmit` completes with 0 TypeScript errors (**STATUS: PASS**).
- [x] **C.3** `pnpm exec tsx scripts/test-copilot-phase3.mjs` PASSED (35/35 tests) (**STATUS: PASS**).
- [x] **C.4** `pnpm exec tsx scripts/test-copilot-phase4a.mjs` PASSED (37/37 static tests) (**STATUS: PASS**).
- [x] **C.5** `pnpm exec tsx scripts/test-copilot-phase5a.mjs` PASSED (13/13 assertions) (**STATUS: PASS**).

### Gate D: Live Non-Production DB Suite Verification
- [x] **D.1** Environment configured with `COPILOT_DB_ENV=development` and `COPILOT_DB_TEST_ALLOW_NON_PROD=true` (**STATUS: PASS**).
- [x] **D.2** `pnpm exec tsx scripts/test-copilot-phase4-live.mjs` PASSED (34/34 assertions against Neon non-prod DB `sweet-sun-06918856`) (**STATUS: PASS**).
- [x] **D.3** `pnpm exec tsx scripts/test-copilot-phase4b.mjs` PASSED (49/49 assertions against Neon non-prod DB `sweet-sun-06918856`) (**STATUS: PASS**).

### Gate E: Content Safety Audit & Human Triage
- [x] **E.1** `pnpm exec tsx scripts/audit-scripts-registry-claims.mjs` executed (376 scripts, 1698 fields audited, 14 findings, 320 hints) (**STATUS: PASS**).
- [x] **E.2** All 14 automated findings manually reviewed and triaged by product owner (**STATUS: PASS**).
- [x] **E.3** All 14 findings triaged as acceptable context (instructional/coaching references to handling discount requests safely; not unauthorized discount promises); 0 content remediation required (**STATUS: PASS**).

### Gate F: Vercel Access Protection (Path A)
- [x] **F.1** Vercel Deployment Protection enabled for target Preview deployment ("Vercel Authentication") (**STATUS: PASS**).
- [x] **F.2** Target internal advisors granted Vercel team/project access; authorized human login verified (**STATUS: PASS**).
- [x] **F.3** Protection Bypass for Automation enabled in Vercel project settings (**STATUS: PASS**).
- [x] **F.4** `VERCEL_AUTOMATION_BYPASS_SECRET` verified working for test execution (transient process environment variable; zero secret values committed) (**STATUS: PASS**).

### Gate G: Anonymous API & Page Protection Gate
- [x] **G.1** Direct unauthenticated HTTP GET to Preview root (`/`) returns Vercel Authentication challenge (302 redirect) (**STATUS: PASS**).
- [x] **G.2** Direct unauthenticated HTTP GET to `/docs/scripts` returns Vercel Authentication challenge (302 redirect) (**STATUS: PASS**).
- [x] **G.3** Direct unauthenticated HTTP POST to `/api/copilot` returns Vercel Authentication challenge (302 redirect) (**STATUS: PASS**).
- [x] **G.4** Direct unauthenticated HTTP POST to `/api/copilot/feedback` returns Vercel Authentication challenge (302 redirect) (**STATUS: PASS**).
- [x] **G.5** Direct unauthenticated HTTP POST to `/api/copilot/outcome` returns Vercel Authentication challenge (302 redirect) (**STATUS: PASS**).

### Gate H: Environment & Database Separation Verification
- [x] **H.1** Preview environment `DATABASE_URL` confirmed pointing strictly to Non-Production Neon Postgres instance (`sweet-sun-06918856`) (**STATUS: PASS**).
- [x] **H.2** `COPILOT_DB_ENV` in Preview configured as `preview` (**STATUS: PASS**).
- [x] **H.3** Zero production databases or live CRM instances connected to pilot environment (**STATUS: PASS**).

### Gate I: Playwright Local E2E Journeys
- [x] **I.1** `pnpm exec playwright test --project=local` executed against local app (**STATUS: PASS**).
- [x] **I.2** All 8 local E2E journeys PASSED (Journey A: Open & analyze, Journey B: Feedback persistence with primary class assertion, Journey C: Follow-up outcome, Journey D: Completion outcome, Journey E: Refresh session-ID continuity, Journey F: Start new conversation, Journey G: Network failure handling, Journey H: Not-persisted response disables controls) (**STATUS: PASS**).

### Gate J: Playwright Preview Smoke Suite
- [x] **J.1** `PLAYWRIGHT_PREVIEW_URL` and `VERCEL_AUTOMATION_BYPASS_SECRET` configured in test execution environment (**STATUS: PASS**).
- [x] **J.2** `pnpm exec playwright test --project=preview` executed against protected Preview deployment (**STATUS: PASS**).
- [x] **J.3** All 3 Preview smoke tests PASSED (3 passed, 0 failed, 0 flaky, 0 skipped: Preview 1: Protected bypass access, Preview 2: Core persisted journey, Preview 3: Session-ID continuity smoke) (**STATUS: PASS**).

### Gate K: Candidate Privacy & Data Trust
- [x] **K.1** Candidate PII Warning banner visible on `CopilotInput.tsx` (`"Do not include candidate names, email addresses, phone numbers..."`) (**STATUS: PASS**).
- [x] **K.2** Participating advisors briefed not to enter real candidate PII during pilot; briefing delivered and acknowledged by both pilot advisors (**STATUS: PASS**).

### Gate L: Scripts Library Client Exposure Stance
- [x] **L.1** Confirmed `/docs/scripts` is protected under Vercel Authentication on Preview (**STATUS: PASS**).
- [x] **L.2** Accepted for Level B pilot: `components/scripts/ScriptsLibraryView.tsx` direct import of `SCRIPTS_REGISTRY` is acceptable behind internal Vercel Auth, but must be revisited for server-rendered streaming before Level C public release (**STATUS: PASS**).

### Gate M: Manual Two-Advisor Smoke Verification (Human Execution Gate)
- [x] **M.1** **Advisor A Smoke:** Advisor logged into Preview (`phase5b-manual-advisor-a`), analyzed objection, submitted feedback rating, recorded follow-up; session `ef26b969-34d3-4e9f-8268-8738aef0fef8` status `active` (**STATUS: PASS**).
- [x] **M.2** **Advisor B Smoke:** Advisor logged into Preview (`phase5b-manual-advisor-b`), analyzed objection, submitted feedback rating, recorded enrolled/lost outcome; session `2e3326aa-2aac-4755-a7c8-378e51144d5f` status `completed` (**STATUS: PASS**).
- [x] **M.3** **Isolation Verification:** Database query verified distinct sessions (`ef26b969...` !== `2e3326aa...`), distinct exchanges (`b328d0c9...` !== `41a7b423...`), distinct feedback records (`78669d48...` !== `7fc142ff...`), and zero cross-advisor data contamination (**STATUS: PASS**).

---

## 3. Operational Rollback Procedure

### Rollback Triggers
1. Vercel Authentication fails or unauthenticated requests reach application/API endpoints.
2. Copilot API error rate spike or Neon DB connection failure.
3. Advisor identity or session data cross-contamination detected.
4. Content safety violation identified by pilot advisors.
5. Critical browser crash or E2E failure on Preview deployment.

### Rollback Target
- **Rollback Target:** Phase 5A Freeze commit `162d5ef9a43428abc0cebc9a877387996a801e97` (Verified Preview deployment `dpl_GsScHE89QGJ48QpNEBJ9LncWkGPm`, status Ready, protected by Vercel Authentication).

### Rollback Steps
1. **Stop Advisor Usage:** Request pilot advisors to cease using the failing Preview deployment URL.
2. **Identify Known-Good Target:** Identify the known-good Phase 5A baseline commit (`162d5ef`) or approved rollback Preview deployment (`dpl_GsScHE89QGJ48QpNEBJ9LncWkGPm`).
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
| Gate B (Preview Build Verification) | **PASS** | Vercel CLI | 2026-08-12 |
| Gate C (Offline Test Suite) | **PASS** | Offline Test Matrix | 2026-08-12 |
| Gate D (Live Non-Prod DB Suite) | **PASS** | Neon Non-Prod DB Suite | 2026-08-12 |
| Gate E (Content Safety Audit & Triage) | **PASS** | Product Owner Triage | 2026-08-12 |
| Gate F (Vercel Authentication) | **PASS** | DevOps / Admin | 2026-08-12 |
| Gate G (Anonymous API Protection) | **PASS** | Verification Curl | 2026-08-12 |
| Gate H (Preview DB Separation) | **PASS** | Preview Neon DB Verification | 2026-08-12 |
| Gate I (Playwright Local E2E 8/8) | **PASS** | Playwright Local Suite | 2026-08-12 |
| Gate J (Playwright Preview Smoke 3/3) | **PASS** | Playwright Preview Suite | 2026-08-12 |
| Gate K (Candidate Privacy Stance) | **PASS** | Code Banner / Pilot Briefing | 2026-08-12 |
| Gate L (Preview Scripts-Route Protection) | **PASS** | Preview Verification | 2026-08-12 |
| Gate M (Manual 2-Advisor Smoke) | **PASS** | Pilot Advisors & DB Audit | 2026-08-12 |

**FINAL LEVEL B PILOT AUTHORIZATION:**
`LEVEL B — CONTROLLED INTERNAL ADVISOR PILOT AUTHORIZED`

*(Note: LEVEL C / PRODUCTION IS NOT AUTHORIZED).*
