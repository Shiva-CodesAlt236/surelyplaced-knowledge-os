// Sales Copilot — Phase 6B Correction Capture & Classifier-Version Audit Trail
// Regression Suite
//
// Four explicitly labeled test categories, matching this repository's
// established testing discipline (see scripts/test-copilot-phase6a.mjs):
//
// 1. PURE UNIT — validateCorrectionInput() (lib/copilot/correction-validation.ts),
//    no DB, no HTTP server. Extracted into its own pure function specifically
//    because the correction route has NO legacy-mode fallback (unlike the
//    other three Copilot routes), so every request must carry a real Auth.js
//    session before body validation ever runs — meaning this taxonomy/shape
//    validation logic would otherwise only be exercisable via a DB-backed
//    integration test if it stayed inline in the route handler.
//
// 2. HTTP INTEGRATION — real `next dev` server spawned by this script, for
//    anything that depends on route-level request handling: unauthenticated
//    denial, the Level-C-only kill-switch (no legacy fallback), spoofed-
//    identity rejection, sanitized error messages.
//
// 3. DB-BACKED — real, complete, executable integration tests against actual
//    persisted rows, gated behind the SAME safety guards this repository's
//    existing scripts/test-copilot-phase6a.mjs and
//    scripts/test-copilot-phase4-live.mjs already establish
//    (COPILOT_DB_TEST_ALLOW_NON_PROD + COPILOT_DB_ENV + DATABASE_URL), and
//    honestly reported as environment-blocked when unavailable rather than
//    silently skipped or faked. Unlike Phase 6A, Phase 6B's Product Owner
//    authorization explicitly requires this pass to actually execute against
//    a safe non-production database before formal closure — not merely be
//    written and left environment-blocked indefinitely.
//
// 4. STATIC SOURCE ASSERTION — grep-based proof of code/migration structure
//    (anti-spoofing call-site shape, append-only schema shape, the migration
//    file's historical-version-honesty steps, and classifier-file freeze).
//    Never described as "live" — these are source-text checks, not executed
//    behavior.

import { spawn } from 'node:child_process';
import http from 'node:http';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';

let passed = 0;
let total = 0;
const failures = [];

function assert(condition, label) {
  total += 1;
  if (condition) {
    passed += 1;
    console.log(`  \x1b[32m✓ PASS\x1b[0m: ${label}`);
  } else {
    failures.push(label);
    console.log(`  \x1b[31m✗ FAIL\x1b[0m: ${label}`);
  }
}

// ---------------------------------------------------------------------------
// Part A — PURE UNIT: validateCorrectionInput (no DB, no HTTP server)
// ---------------------------------------------------------------------------
async function runValidationUnitTests() {
  console.log('\n--- Part A: validateCorrectionInput (pure unit, no DB/HTTP required) ---');

  const { validateCorrectionInput } = await import('../lib/copilot/correction-validation.ts');
  const validExchangeId = crypto.randomUUID();

  const u1 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'price-objection',
  });
  assert(u1.valid === true, 'U1: valid taxonomy primary, no secondaries -> valid');

  const u2 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'price-objection',
    correctedSecondaryCategoryIds: ['need-time-to-think'],
  });
  assert(
    u2.valid === true && u2.data.correctedSecondaryCategoryIds.length === 1,
    'U2: valid taxonomy primary + valid secondaries -> valid'
  );

  const u3 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'not-a-real-category',
  });
  assert(
    u3.valid === false && u3.error.includes('correctedPrimaryCategoryId'),
    'U3: invalid primary category -> invalid'
  );

  const u4 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'unclassified',
  });
  assert(u4.valid === true, 'U4: "unclassified" is a valid corrected primary state');

  const u5 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'unclassified',
    correctedSecondaryCategoryIds: ['price-objection'],
  });
  assert(
    u5.valid === false && u5.error.includes('unclassified'),
    'U5: unclassified primary + non-empty secondaries -> invalid (unclassified semantics)'
  );

  const u6 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'explicit-refusal',
    correctedSecondaryCategoryIds: ['price-objection'],
  });
  assert(
    u6.valid === false && u6.error.includes('explicit-refusal'),
    'U6: explicit-refusal primary + non-empty secondaries -> invalid (explicit-refusal semantics)'
  );

  const u7 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'explicit-refusal',
  });
  assert(
    u7.valid === true,
    'U7: correcting FROM a substantive category TO explicit-refusal (empty secondaries) -> valid'
  );

  const u8 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'price-objection',
    correctedSecondaryCategoryIds: ['price-objection'],
  });
  assert(
    u8.valid === false && u8.error.includes('must not also appear'),
    'U8: correctedPrimaryCategoryId duplicated inside correctedSecondaryCategoryIds -> invalid'
  );

  const u9 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'price-objection',
    correctedSecondaryCategoryIds: ['need-time-to-think', 'need-time-to-think'],
  });
  assert(
    u9.valid === false && u9.error.includes('duplicate'),
    'U9: duplicate entries within correctedSecondaryCategoryIds -> invalid'
  );

  const u10 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'price-objection',
    correctedSecondaryCategoryIds: ['not-a-real-category'],
  });
  assert(
    u10.valid === false && u10.error.includes('not a recognized objection category'),
    'U10: invalid secondary category id -> invalid'
  );

  const tooMany = [
    'price-objection',
    'upfront-payment-resistance',
    'information-request-deferral',
    'trust-and-credibility',
    'need-time-to-think',
    'already-applying-myself',
  ];
  const u11 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'already-working-with-consultancy',
    correctedSecondaryCategoryIds: tooMany,
  });
  assert(
    u11.valid === false && u11.error.includes('at most'),
    'U11: correctedSecondaryCategoryIds exceeding the max count -> invalid'
  );

  const u12 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'price-objection',
  });
  assert(u12.valid === true && u12.data.correctionReason === undefined, 'U12: correctionReason is optional — absent is valid');

  const u13 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'price-objection',
    correctionReason: '  Advisor felt this was actually a timing concern.  ',
  });
  assert(
    u13.valid === true && u13.data.correctionReason === 'Advisor felt this was actually a timing concern.',
    'U13: correctionReason within limit is accepted and trimmed'
  );

  const u14 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'price-objection',
    correctionReason: 'x'.repeat(501),
  });
  assert(
    u14.valid === false && u14.error.includes('500 characters'),
    'U14: correctionReason exceeding 500 chars -> invalid'
  );

  const u15 = validateCorrectionInput({
    exchangeId: 'not-a-uuid',
    correctedPrimaryCategoryId: 'price-objection',
  });
  assert(u15.valid === false && u15.error.includes('exchangeId'), 'U15: invalid (non-UUID) exchangeId -> invalid');

  const u16 = validateCorrectionInput({
    correctedPrimaryCategoryId: 'price-objection',
  });
  assert(u16.valid === false, 'U16: missing exchangeId -> invalid');

  const u17 = validateCorrectionInput({
    exchangeId: validExchangeId,
    correctedPrimaryCategoryId: 'price-objection',
    correctedSecondaryCategoryIds: 'not-an-array',
  });
  assert(
    u17.valid === false && u17.error.includes('array'),
    'U17: correctedSecondaryCategoryIds not an array -> invalid'
  );
}

// ---------------------------------------------------------------------------
// Part B — STATIC SOURCE ASSERTION (grep-based, explicitly not "live")
// ---------------------------------------------------------------------------
function runStaticAssertions() {
  console.log('\n--- Part B (static source assertions — NOT live execution) ---');

  const routeSrc = readFileSync('app/api/copilot/correction/route.ts', 'utf8');
  assert(
    /isOwnerOrAdmin\(levelCActor,/.test(routeSrc),
    'S1: correction route\'s isOwnerOrAdmin call passes levelCActor (server-derived), never a body-sourced value'
  );
  assert(
    !/isOwnerOrAdmin\(\s*body/.test(routeSrc),
    'S2 (OWN10-equivalent): correction route never passes a body-sourced value as the isOwnerOrAdmin actor argument'
  );
  assert(
    !/body\??\.\s*(advisorId|advisorIdentifier|role|ownerAdvisorIdentifier|classifierVersion)/.test(routeSrc),
    'S3: correction route never reads advisorId/advisorIdentifier/role/ownerAdvisorIdentifier/classifierVersion from the request body'
  );
  assert(
    /if \(!isLevelCEnabled\(\)\)/.test(routeSrc) && !/isLegacyIdentityModeEnabled/.test(routeSrc),
    'S4: correction route has no legacy-mode fallback branch (Level-C-only by design)'
  );

  const schemaSrc = readFileSync('lib/db/schema.ts', 'utf8');
  const correctionsTableMatch = schemaSrc.match(/copilotCorrections = pgTable\(([\s\S]*?)\n\)/);
  assert(!!correctionsTableMatch, 'S5: copilot_corrections table definition found in schema.ts');
  assert(
    !!correctionsTableMatch && !/exchangeId:[\s\S]*?\.unique\(\)/.test(correctionsTableMatch[1]),
    'S6 (append-only verification): copilot_corrections.exchangeId has NO .unique() constraint (multiple correction rows per exchange are allowed)'
  );

  const persistenceSrc = readFileSync('lib/copilot/persistence.ts', 'utf8');
  assert(
    /classifierVersion:\s*CLASSIFIER_VERSION,/.test(persistenceSrc),
    'S7: recordCopilotExchange explicitly stamps classifierVersion: CLASSIFIER_VERSION on every new exchange insert'
  );

  const migrationFiles = readdirSync('drizzle')
    .filter((f) => f.endsWith('.sql') && f.includes('0002'))
    .map((f) => `drizzle/${f}`);
  assert(migrationFiles.length === 1, 'S8: exactly one Phase 6B migration file (0002_*) exists');
  if (migrationFiles.length === 1) {
    const migrationSrc = readFileSync(migrationFiles[0], 'utf8');
    const addIdx = migrationSrc.indexOf("ADD COLUMN \"classifier_version\" text DEFAULT 'legacy-unversioned'");
    const updateIdx = migrationSrc.indexOf("SET \"classifier_version\" = 'legacy-unversioned'");
    const notNullIdx = migrationSrc.indexOf('ALTER COLUMN "classifier_version" SET NOT NULL');
    const dropDefaultIdx = migrationSrc.indexOf('ALTER COLUMN "classifier_version" DROP DEFAULT');
    assert(
      addIdx !== -1 && updateIdx !== -1 && notNullIdx !== -1 && dropDefaultIdx !== -1,
      'S9: migration contains all 4 historical-version-honesty steps (legacy-unversioned backfill default, redundant UPDATE, SET NOT NULL, DROP DEFAULT)'
    );
    assert(
      addIdx < updateIdx && updateIdx < notNullIdx && notNullIdx < dropDefaultIdx,
      'S10: the 4 historical-version-honesty migration steps run in the correct order (backfill -> enforce NOT NULL -> drop default)'
    );
    assert(
      !migrationSrc.includes("DEFAULT 'phase5f.1'"),
      'S11: migration does NOT backfill historical rows with today\'s classifier version (no fabricated provenance)'
    );
    assert(
      !/DROP TABLE|DROP COLUMN/i.test(migrationSrc),
      'S12: migration is purely additive — no DROP TABLE or DROP COLUMN statements'
    );
  }

  // Classifier freeze: zero diff to the actual classifier engine files versus
  // the Phase 6A.1 freeze commit. Static source/diff check, not live pipeline
  // execution.
  let frozenDiff = '';
  try {
    frozenDiff = execSync(
      'git diff 758187b6456ba2ff7e891e763b71fb369a1b512a..HEAD -- lib/copilot/objection-categories.ts lib/copilot/pipeline.ts lib/copilot/confidence.ts lib/scripts-registry.ts content/docs/',
      { encoding: 'utf8' }
    );
  } catch {
    frozenDiff = '<git diff unavailable>';
  }
  assert(
    frozenDiff.trim() === '',
    'S13: zero diff to lib/copilot/objection-categories.ts, lib/copilot/pipeline.ts, lib/copilot/confidence.ts, lib/scripts-registry.ts, content/docs/ since the Phase 6A.1 freeze (classifier behavior untouched)'
  );

  const classifierVersionSrc = readFileSync('lib/copilot/classifier-version.ts', 'utf8');
  assert(
    /CLASSIFIER_VERSION = 'phase5f\.1'/.test(classifierVersionSrc),
    'S14: CLASSIFIER_VERSION constant lives in its own file, value is "phase5f.1" (the classifier engine version, not the app phase number)'
  );
}

// ---------------------------------------------------------------------------
// Part C — HTTP INTEGRATION (real next dev servers)
// ---------------------------------------------------------------------------
function waitForServer(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get({ host: 'localhost', port, path: '/', timeout: 2000 }, (res) => {
        res.resume();
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() > deadline) return reject(new Error('Server did not become ready in time'));
        setTimeout(attempt, 500);
      });
      req.on('timeout', () => {
        req.destroy();
        if (Date.now() > deadline) return reject(new Error('Server did not become ready in time'));
        setTimeout(attempt, 500);
      });
    };
    attempt();
  });
}

function postJson(port, path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        host: 'localhost',
        port,
        path,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(raw);
          } catch {
            json = null;
          }
          resolve({ status: res.statusCode, json });
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function postRaw(port, path, rawBody) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: 'localhost',
        port,
        path,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(rawBody) },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(raw);
          } catch {
            json = null;
          }
          resolve({ status: res.statusCode, json });
        });
      }
    );
    req.on('error', reject);
    req.write(rawBody);
    req.end();
  });
}

async function runLevelCServerTests(port) {
  console.log('\n--- Part C1: LEVEL_C_ENABLED=true, unauthenticated (no session cookie) ---');

  const r1 = await postJson(port, '/api/copilot/correction', {
    exchangeId: crypto.randomUUID(),
    correctedPrimaryCategoryId: 'price-objection',
  });
  assert(r1.status === 401, 'H1: unauthenticated POST /api/copilot/correction -> HTTP 401');
  assert(
    r1.json && typeof r1.json.error === 'string' && !/oauth|stack|at Object|node_modules/i.test(r1.json.error),
    'H2: 401 error message is sanitized (no OAuth/DB/stack-trace leakage)'
  );

  console.log('\n--- Part C2: server-derived identity ignores/rejects spoofed client identity ---');
  const r2 = await postJson(port, '/api/copilot/correction', {
    exchangeId: crypto.randomUUID(),
    correctedPrimaryCategoryId: 'price-objection',
    advisorId: 'spoofed@evil.example.com',
    advisorIdentifier: 'spoofed@evil.example.com',
    role: 'admin',
    ownerAdvisorIdentifier: 'victim@test-workspace.example.com',
    classifierVersion: 'fake-version',
  });
  assert(
    r2.status === 401,
    'H3: spoofed advisorId/advisorIdentifier/role/ownerAdvisorIdentifier/classifierVersion in body cannot substitute for a real session (still 401)'
  );

  console.log('\n--- Part C3: malformed JSON body ---');
  const r3 = await postRaw(port, '/api/copilot/correction', '{not valid json');
  assert(r3.status === 400, 'H4: malformed JSON body -> HTTP 400 (before any auth/DB work)');
}

async function runKillSwitchServerTests(port) {
  console.log('\n--- Part C4: Copilot corrections unavailable when Level C is not enabled ---');
  const r1 = await postJson(port, '/api/copilot/correction', {
    exchangeId: crypto.randomUUID(),
    correctedPrimaryCategoryId: 'price-objection',
  });
  assert(r1.status === 503, 'H5: LEVEL_C_ENABLED unset + nothing else set -> HTTP 503 (corrections unavailable)');
}

async function runLegacyModeIrrelevantServerTests(port) {
  console.log('\n--- Part C5: correction has NO legacy-mode fallback, even when legacy mode is enabled for other routes ---');
  const r1 = await postJson(port, '/api/copilot/correction', {
    exchangeId: crypto.randomUUID(),
    correctedPrimaryCategoryId: 'price-objection',
  });
  assert(
    r1.status === 503,
    'H6: LEVEL_C_ENABLED unset + COPILOT_LEGACY_IDENTITY_MODE=true -> correction route STILL returns 503 (Level-C-only, unlike the other 3 routes which accept legacy mode)'
  );
}

// ---------------------------------------------------------------------------
// Part D — DB-BACKED (real non-production database required)
// ---------------------------------------------------------------------------
async function runCorrectionDbIntegrationTests() {
  const {
    createCopilotSession,
    recordCopilotExchange,
    recordCopilotCorrection,
    getLatestCopilotCorrection,
    getCopilotExchangeOwnership,
  } = await import('../lib/copilot/persistence.ts');
  const { isOwnerOrAdmin } = await import('../lib/auth/ownership.ts');
  const { getDb } = await import('../lib/db/client.ts');
  const { copilotCorrections, copilotExchanges, copilotSessions } = await import('../lib/db/schema.ts');
  const { eq } = await import('drizzle-orm');

  const advisorA = { advisorIdentifier: 'phase6b-test-advisor-a@test-workspace.example.com', role: 'advisor' };
  const advisorB = { advisorIdentifier: 'phase6b-test-advisor-b@test-workspace.example.com', role: 'advisor' };
  const admin = { advisorIdentifier: 'phase6b-test-admin@test-workspace.example.com', role: 'admin' };

  const db = getDb();
  const sessionA = await createCopilotSession({ advisorIdentifier: advisorA.advisorIdentifier });
  const exchangeA = await recordCopilotExchange({
    sessionId: sessionA.id,
    objectionText: 'Phase 6B correction test exchange.',
    numericConfidence: 0.6,
    confidenceBand: 'medium',
    primaryObjectionId: 'trust-and-credibility',
    secondaryObjectionIds: ['need-time-to-think'],
    matchedScriptId: 'test-script-id',
  });

  try {
    // Snapshot the original exchange row before any corrections.
    const [beforeCorrection] = await db
      .select()
      .from(copilotExchanges)
      .where(eq(copilotExchanges.id, exchangeA.id))
      .limit(1);

    // D1: advisor A owns the exchange -> allowed to correct it.
    const ownership1 = await getCopilotExchangeOwnership(exchangeA.id);
    assert(
      ownership1.exists && isOwnerOrAdmin(advisorA, ownership1.advisorIdentifier),
      'CORR-D1 (DB-backed): advisor A correcting own exchange -> allowed'
    );
    const correctionByA = await recordCopilotCorrection({
      exchangeId: exchangeA.id,
      correctedPrimaryCategoryId: 'price-objection',
      correctedSecondaryCategoryIds: [],
      correctionReason: 'Actually a price concern, not trust.',
      advisorIdentifier: advisorA.advisorIdentifier,
    });
    assert(
      correctionByA && correctionByA.correctedPrimaryCategoryId === 'price-objection',
      'CORR-D1b (DB-backed): advisor A\'s correction persisted with the corrected primary category'
    );

    // D2: advisor B does not own the exchange -> denied.
    assert(
      ownership1.exists && !isOwnerOrAdmin(advisorB, ownership1.advisorIdentifier),
      'CORR-D2 (DB-backed): advisor B correcting advisor A\'s exchange -> denied'
    );

    // D3/D4: admin correcting advisor A's exchange -> allowed, actor attribution = admin (not advisor A).
    assert(
      ownership1.exists && isOwnerOrAdmin(admin, ownership1.advisorIdentifier),
      'CORR-D3 (DB-backed): admin correcting advisor A\'s exchange -> allowed'
    );
    const correctionByAdmin = await recordCopilotCorrection({
      exchangeId: exchangeA.id,
      correctedPrimaryCategoryId: 'need-time-to-think',
      correctedSecondaryCategoryIds: [],
      advisorIdentifier: admin.advisorIdentifier,
    });
    assert(
      correctionByAdmin.advisorIdentifier === admin.advisorIdentifier &&
        correctionByAdmin.advisorIdentifier !== advisorA.advisorIdentifier,
      'CORR-D4 (DB-backed): admin correction is attributed to the admin (ACTOR), never silently rewritten to the exchange OWNER (advisor A)'
    );

    // D5: append-only — two corrections now exist for this exchange, not one upserted row.
    const allCorrections = await db
      .select()
      .from(copilotCorrections)
      .where(eq(copilotCorrections.exchangeId, exchangeA.id));
    assert(
      allCorrections.length === 2,
      'CORR-D5 (DB-backed): a second correction APPENDS a new row rather than overwriting the first (append-only history, no UNIQUE(exchangeId) upsert)'
    );

    // D6: getLatestCopilotCorrection resolves to the most recent (admin's) correction.
    const latest = await getLatestCopilotCorrection(exchangeA.id);
    assert(
      latest && latest.correctedPrimaryCategoryId === 'need-time-to-think' && latest.advisorIdentifier === admin.advisorIdentifier,
      'CORR-D6 (DB-backed): getLatestCopilotCorrection resolves to the most recent correction (admin\'s), not the first (advisor A\'s)'
    );

    // D7: original exchange row's classifier output fields are byte-identical
    // after both corrections — the correction write path never touched them.
    const [afterCorrection] = await db
      .select()
      .from(copilotExchanges)
      .where(eq(copilotExchanges.id, exchangeA.id))
      .limit(1);
    assert(
      afterCorrection.primaryObjectionId === beforeCorrection.primaryObjectionId &&
        JSON.stringify(afterCorrection.secondaryObjectionIds) === JSON.stringify(beforeCorrection.secondaryObjectionIds) &&
        afterCorrection.numericConfidence === beforeCorrection.numericConfidence &&
        afterCorrection.confidenceBand === beforeCorrection.confidenceBand &&
        afterCorrection.matchedScriptId === beforeCorrection.matchedScriptId &&
        afterCorrection.objectionText === beforeCorrection.objectionText &&
        afterCorrection.sessionId === beforeCorrection.sessionId,
      'CORR-D7 (DB-backed): original exchange row (classification, confidence, script, text, session ownership) remains byte-identical after two corrections'
    );

    // D8: new exchange's classifierVersion is stamped with the current engine version.
    assert(
      afterCorrection.classifierVersion === 'phase5f.1',
      'CORR-D8 (DB-backed): newly created exchange persists classifierVersion = "phase5f.1"'
    );

    // D9: correcting an unknown exchange fails with the expected error, not a raw FK violation.
    let threw = false;
    try {
      await recordCopilotCorrection({
        exchangeId: crypto.randomUUID(),
        correctedPrimaryCategoryId: 'price-objection',
        correctedSecondaryCategoryIds: [],
        advisorIdentifier: advisorA.advisorIdentifier,
      });
    } catch (err) {
      threw = /Exchange not found/.test(err.message);
    }
    assert(threw, 'CORR-D9 (DB-backed): recordCopilotCorrection on an unknown exchangeId throws "Exchange not found" (preserves 404 semantics)');
  } finally {
    // Cleanup: delete the test session (ON DELETE CASCADE removes the
    // exchange and both correction rows with it).
    await db.delete(copilotSessions).where(eq(copilotSessions.id, sessionA.id));
  }
}

function spawnServer(port, env) {
  const isWindows = process.platform === 'win32';
  const child = spawn(
    isWindows ? 'node_modules\\.bin\\next.cmd' : 'node_modules/.bin/next',
    ['dev', '-p', String(port)],
    {
      cwd: process.cwd(),
      env: { ...process.env, ...env },
      stdio: 'ignore',
      detached: !isWindows,
      shell: isWindows,
    }
  );
  return child;
}

function killServer(child) {
  try {
    if (process.platform === 'win32') {
      // On Windows, use taskkill /T to kill the process tree since process groups don't work
      try { execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' }); } catch { /* ignore */ }
    } else {
      try { process.kill(-child.pid, 'SIGTERM'); } catch { child.kill('SIGTERM'); }
    }
  } catch { /* ignore cleanup errors */ }
}

async function main() {
  await runValidationUnitTests();
  runStaticAssertions();

  console.log('\n--- Part C: HTTP integration tests (spawning real next dev servers) ---');

  const port1 = 3521;
  const server1 = spawnServer(port1, {
    LEVEL_C_ENABLED: 'true',
    ALLOWED_GOOGLE_WORKSPACE_DOMAIN: 'test-workspace.example.com',
    AUTH_SECRET: 'test-only-secret-not-real-0000000000000000',
  });
  try {
    await waitForServer(port1, 30000);
    await runLevelCServerTests(port1);
  } finally {
    killServer(server1);
  }

  const port2 = 3522;
  const server2 = spawnServer(port2, { LEVEL_C_ENABLED: '', COPILOT_LEGACY_IDENTITY_MODE: '' });
  try {
    await waitForServer(port2, 30000);
    await runKillSwitchServerTests(port2);
  } finally {
    killServer(server2);
  }

  const port3 = 3523;
  const server3 = spawnServer(port3, { LEVEL_C_ENABLED: '', COPILOT_LEGACY_IDENTITY_MODE: 'true' });
  try {
    await waitForServer(port3, 30000);
    await runLegacyModeIrrelevantServerTests(port3);
  } finally {
    killServer(server3);
  }

  console.log('\n--- Part D: DB-dependent tests (require non-production Neon) ---');
  const dbEnv = process.env.COPILOT_DB_ENV;
  const allowNonProd = process.env.COPILOT_DB_TEST_ALLOW_NON_PROD;
  if (allowNonProd === 'true' && (dbEnv === 'development' || dbEnv === 'preview') && process.env.DATABASE_URL) {
    console.log('  Running Part D correction DB-backed integration tests against the configured non-production database...');
    await runCorrectionDbIntegrationTests();
  } else {
    console.log(
      '  ENVIRONMENT-BLOCKED: DB-dependent correction scenarios (CORR-D1 through CORR-D9: advisor-own-correction, ' +
        'cross-advisor-denial, admin-correction, admin-actor-attribution, append-only-history, latest-correction-' +
        'resolution, original-exchange-immutability, classifierVersion-persistence, unknown-exchange-handling) ' +
        'require COPILOT_DB_TEST_ALLOW_NON_PROD=true, COPILOT_DB_ENV=development|preview, and a reachable ' +
        'DATABASE_URL, none of which are available in this execution environment. Not counted as pass or fail. ' +
        'The Part D test code above is real, executable, and ready to run against a real non-production database ' +
        '— it did not run here. Per Phase 6B\'s Product Owner authorization, this pass must actually execute ' +
        'against a safe non-production database before Phase 6B may be formally closed — unlike Phase 6A, source ' +
        'inspection alone is not sufficient closure evidence for this phase\'s database behavior.'
    );
  }

  console.log('\n=====================================================');
  console.log(`RESULTS: Passed ${passed}/${total} Phase 6B assertions`);
  console.log('=====================================================\n');

  if (passed !== total) {
    process.exitCode = 1;
  }

  process.exit(process.exitCode || 0);
}

main().catch((err) => {
  console.error('FATAL TEST ERROR:', err);
  process.exitCode = 1;
  process.exit(1);
});
