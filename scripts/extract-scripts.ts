/**
 * TypeScript wrapper for the extraction script.
 *
 * The primary extraction logic lives in extract-scripts.mjs (ESM, runs with `node`).
 * This file exists as the canonical TypeScript entry point per sprint spec.
 *
 * Usage:
 *   node scripts/extract-scripts.mjs          (direct, no dependencies)
 *   npx tsx scripts/extract-scripts.ts         (via tsx, if available)
 */

// Re-export the extraction by running the .mjs script
// This file primarily serves as documentation and the canonical .ts reference
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

execSync(`node "${join(__dirname, 'extract-scripts.mjs')}"`, {
  stdio: 'inherit',
  cwd: join(__dirname, '..'),
});
