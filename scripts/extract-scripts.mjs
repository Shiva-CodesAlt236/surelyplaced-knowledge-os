#!/usr/bin/env node
/**
 * Premium Scripts Library — Content Extraction Pipeline
 *
 * Walks all MDX lesson files across the 7 Sales Academy modules,
 * extracts every RoleplayCard, PracticeBox, and QuickReferencePanel
 * instance with all props, and regenerates lib/scripts-registry.ts.
 *
 * Usage:   node scripts/extract-scripts.mjs
 * Trigger: Run after any MDX content change to keep the registry in sync.
 *
 * Architecture note: This script reads raw MDX source files and uses a
 * character-level state-machine parser for JSX prop extraction rather
 * than a full MDX AST parser. This is deliberate — the component usage
 * patterns across the 54-lesson corpus are highly consistent, and a
 * lightweight parser avoids introducing @mdx-js/mdx as a build dependency.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const CONTENT_ROOT = join(ROOT, 'content', 'docs');
const OUTPUT = join(ROOT, 'lib', 'scripts-registry.ts');

/** Academy module definitions matching lib/academy-sequence.ts */
const MODULES = [
  { dir: 'discovery',          id: 'discovery',          name: 'Discovery Calls' },
  { dir: 'discussion',         id: 'discussion',         name: 'Discussion Calls' },
  { dir: 'closing',            id: 'closing',            name: 'Closing Calls' },
  { dir: 'objections',         id: 'objections',         name: 'Objection Handling' },
  { dir: 'pricing',            id: 'pricing',            name: 'Pricing & Value' },
  { dir: 'sales-coaching',     id: 'sales-coaching',     name: 'Sales Coaching' },
  { dir: 'sales-constitution', id: 'sales-constitution', name: 'Sales Constitution' },
];

// ─── Frontmatter Parser ──────────────────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const yaml = match[1];
  const result = {};
  let currentKey = null;

  for (const rawLine of yaml.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Array item (indented "- value")
    if (/^\s+-\s/.test(line) && currentKey) {
      if (!Array.isArray(result[currentKey])) result[currentKey] = [];
      const val = trimmed.slice(2).trim().replace(/^["']|["']$/g, '');
      result[currentKey].push(val);
      continue;
    }

    // Key: value
    const kvMatch = trimmed.match(/^([\w_]+):\s*(.*)/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      let value = kvMatch[2].trim();

      if (value === '' || value === '[]') {
        result[currentKey] = value === '[]' ? [] : undefined;
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Inline YAML array: [a, b, c]
        result[currentKey] = value
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      } else {
        result[currentKey] = value.replace(/^["']|["']$/g, '');
      }
    }
  }
  return result;
}

// ─── JSX Component Block Extractor ───────────────────────────────

/**
 * Finds all self-closing JSX blocks for a given component name.
 * Uses a character-level scanner to correctly handle nested braces,
 * multi-line strings, and template literals.
 */
function findComponentBlocks(content, componentName) {
  const blocks = [];
  const openTag = `<${componentName}`;
  let pos = 0;

  while (pos < content.length) {
    const start = content.indexOf(openTag, pos);
    if (start === -1) break;

    // Ensure it's a tag boundary (next char is whitespace or />)
    const afterTag = content[start + openTag.length];
    if (afterTag && !/[\s/>]/.test(afterTag)) {
      pos = start + openTag.length;
      continue;
    }

    // Scan forward for /> at brace depth 0
    let i = start + openTag.length;
    let braceDepth = 0;
    let inString = false;
    let stringChar = '';

    while (i < content.length - 1) {
      const ch = content[i];

      if (inString) {
        if (ch === '\\') { i += 2; continue; }
        if (ch === stringChar) inString = false;
        i++;
        continue;
      }

      if (ch === '"' || ch === "'") {
        inString = true;
        stringChar = ch;
        i++;
        continue;
      }

      if (ch === '`') {
        // Template literal — scan to closing backtick
        i++;
        while (i < content.length && content[i] !== '`') {
          if (content[i] === '\\') i++;
          i++;
        }
        if (i < content.length) i++; // skip closing backtick
        continue;
      }

      if (ch === '{') { braceDepth++; i++; continue; }
      if (ch === '}') { braceDepth--; i++; continue; }

      if (ch === '/' && content[i + 1] === '>' && braceDepth === 0) {
        blocks.push(content.slice(start, i + 2));
        pos = i + 2;
        break;
      }

      i++;
    }

    if (i >= content.length - 1) {
      // Didn't find closing — skip to avoid infinite loop
      pos = start + openTag.length;
    }
  }

  return blocks;
}

// ─── JSX Prop Parser ─────────────────────────────────────────────

/**
 * Extracts key-value props from a JSX component block string.
 * Returns an object mapping prop names to their raw string values.
 * Expression props (e.g. hints={[...]}) are returned as raw JS strings.
 */
function parseProps(block, componentName) {
  const props = {};
  // Strip opening <Tag and closing />
  const inner = block
    .replace(new RegExp(`^<${componentName}\\s*`), '')
    .replace(/\s*\/>$/, '');

  let i = 0;
  while (i < inner.length) {
    // Skip whitespace
    while (i < inner.length && /\s/.test(inner[i])) i++;
    if (i >= inner.length) break;

    // Read prop name (alphanumeric + underscore)
    const nameStart = i;
    while (i < inner.length && /[a-zA-Z0-9_]/.test(inner[i])) i++;
    const propName = inner.slice(nameStart, i);
    if (!propName) { i++; continue; }

    // Skip whitespace
    while (i < inner.length && /\s/.test(inner[i])) i++;
    // Expect '='
    if (inner[i] !== '=') continue;
    i++; // skip '='
    while (i < inner.length && /\s/.test(inner[i])) i++;

    if (inner[i] === '"') {
      // String prop: prop="value"
      i++; // skip opening quote
      const valueStart = i;
      while (i < inner.length) {
        if (inner[i] === '\\') { i += 2; continue; }
        if (inner[i] === '"') break;
        i++;
      }
      props[propName] = inner.slice(valueStart, i);
      i++; // skip closing quote
    } else if (inner[i] === '{') {
      // Expression prop: prop={expression}
      i++; // skip opening brace
      let depth = 1;
      const valueStart = i;
      let inStr = false;
      let strCh = '';

      while (i < inner.length && depth > 0) {
        const ch = inner[i];
        if (inStr) {
          if (ch === '\\') { i += 2; continue; }
          if (ch === strCh) inStr = false;
        } else {
          if (ch === '"' || ch === "'" || ch === '`') {
            inStr = true;
            strCh = ch;
          } else if (ch === '{') depth++;
          else if (ch === '}') {
            depth--;
            if (depth === 0) break;
          }
        }
        i++;
      }
      props[propName] = inner.slice(valueStart, i).trim();
      i++; // skip closing brace
    }
  }

  return props;
}

/**
 * Attempts to safely evaluate a JS expression string (array/object literal)
 * into a real JavaScript value. Falls back to null on failure.
 */
function safeEval(expr) {
  if (!expr) return null;
  try {
    return new Function(`return (${expr})`)();
  } catch {
    return null;
  }
}

// ─── Title Case Helper ───────────────────────────────────────────

function titleCase(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─── Main Extraction ─────────────────────────────────────────────

function extractAll() {
  const entries = [];
  const stats = { roleplay: 0, practice: 0, quickref: 0, objectionResponse: 0 };

  for (const mod of MODULES) {
    const moduleDir = join(CONTENT_ROOT, mod.dir);
    if (!existsSync(moduleDir)) {
      console.warn(`  ⚠ Module directory not found: ${moduleDir}`);
      continue;
    }

    const files = readdirSync(moduleDir)
      .filter((f) => f.endsWith('.mdx') && f !== 'overview.mdx' && f !== '_template.mdx')
      .sort();

    for (const file of files) {
      const filePath = join(moduleDir, file);
      const content = readFileSync(filePath, 'utf-8');
      const fm = parseFrontmatter(content);
      const slug = basename(file, '.mdx');
      const lessonSlug = `/docs/${mod.dir}/${slug}`;
      const lessonTitle = fm.title || titleCase(slug);
      const tags = Array.isArray(fm.tags) ? fm.tags : [];
      const related = Array.isArray(fm.related) ? fm.related : [];
      const funnelStage = fm.funnel_stage || null;

      // Taxonomy overrides
      const moduleId = slug === 'complete-sales-call-walkthrough' ? 'complete-call' : mod.id;
      const moduleName = slug === 'complete-sales-call-walkthrough' ? 'Sales Academy Graduation' : mod.name;

      // ── RoleplayCards ──
      const rcBlocks = findComponentBlocks(content, 'RoleplayCard');
      rcBlocks.forEach((block, idx) => {
        const p = parseProps(block, 'RoleplayCard');
        const isObjection =
          mod.id === 'objections' &&
          fm.type === 'objection' &&
          slug !== 'objection-handling-framework' &&
          slug !== 'objection-handling-checklist';
        const type = isObjection ? 'objection-response' : 'roleplay';
        if (isObjection) stats.objectionResponse++;
        else stats.roleplay++;

        entries.push({
          id: `${lessonSlug}#roleplay-${idx + 1}`,
          type,
          lessonSlug,
          lessonTitle,
          moduleId,
          moduleName,
          scenario: p.scenario || null,
          prompt: null,
          recommendedAnswer: p.recommendedAnswer || null,
          difficulty: p.difficulty || null,
          estimatedMinutes: p.estimatedMinutes ? parseInt(p.estimatedMinutes, 10) : null,
          context: p.context || null,
          objective: p.objective || null,
          successCriteria: p.successCriteria || null,
          yourRole: p.yourRole || null,
          theirRole: p.theirRole || null,
          hints: safeEval(p.hints) || [],
          managerTip: p.managerTip || null,
          whyThisWorks: null,
          commonMistake: null,
          placeholder: null,
          quickRefTitle: null,
          quickRefItems: null,
          tags,
          funnelStage,
          related,
        });
      });

      // ── PracticeBoxes ──
      const pbBlocks = findComponentBlocks(content, 'PracticeBox');
      pbBlocks.forEach((block, idx) => {
        const p = parseProps(block, 'PracticeBox');
        stats.practice++;

        entries.push({
          id: `${lessonSlug}#practice-${idx + 1}`,
          type: 'practice',
          lessonSlug,
          lessonTitle,
          moduleId,
          moduleName,
          scenario: null,
          prompt: p.prompt || null,
          recommendedAnswer: p.recommendedAnswer || null,
          difficulty: null,
          estimatedMinutes: null,
          context: null,
          objective: null,
          successCriteria: null,
          yourRole: null,
          theirRole: null,
          hints: [],
          managerTip: null,
          whyThisWorks: p.whyThisWorks || null,
          commonMistake: p.commonMistake || null,
          placeholder: p.placeholder || null,
          quickRefTitle: null,
          quickRefItems: null,
          tags,
          funnelStage,
          related,
        });
      });

      // ── QuickReferencePanels ──
      const qrBlocks = findComponentBlocks(content, 'QuickReferencePanel');
      qrBlocks.forEach((block, idx) => {
        const p = parseProps(block, 'QuickReferencePanel');
        stats.quickref++;

        entries.push({
          id: `${lessonSlug}#quickref-${idx + 1}`,
          type: 'quickref',
          lessonSlug,
          lessonTitle,
          moduleId,
          moduleName,
          scenario: null,
          prompt: null,
          recommendedAnswer: null,
          difficulty: null,
          estimatedMinutes: null,
          context: null,
          objective: null,
          successCriteria: null,
          yourRole: null,
          theirRole: null,
          hints: [],
          managerTip: null,
          whyThisWorks: null,
          commonMistake: null,
          placeholder: null,
          quickRefTitle: p.title || 'Quick Reference',
          quickRefItems: safeEval(p.items) || null,
          tags,
          funnelStage,
          related,
        });
      });
    }
  }

  return { entries, stats };
}

// ─── TypeScript Code Generator ───────────────────────────────────

function generateTS(entries) {
  const lines = [];

  lines.push(`/**`);
  lines.push(` * Scripts Registry — Single Source of Truth for Scripts Library`);
  lines.push(` *`);
  lines.push(` * Auto-generated by scripts/extract-scripts.mjs`);
  lines.push(` * DO NOT EDIT MANUALLY — regenerate with: node scripts/extract-scripts.mjs`);
  lines.push(` * Generated: ${new Date().toISOString()}`);
  lines.push(` * Entries: ${entries.length}`);
  lines.push(` */`);
  lines.push(``);
  lines.push(`// ─── Types ───────────────────────────────────────────────────────`);
  lines.push(``);
  lines.push(`export type ScriptType = 'roleplay' | 'practice' | 'quickref' | 'objection-response'`);
  lines.push(``);
  lines.push(`export interface QuickRefItem {`);
  lines.push(`  label: string`);
  lines.push(`  value: string`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export interface ScriptEntry {`);
  lines.push(`  /** Canonical ID: {lessonSlug}#roleplay-{n} | #practice-{n} | #quickref-{n} */`);
  lines.push(`  id: string`);
  lines.push(`  type: ScriptType`);
  lines.push(`  lessonSlug: string`);
  lines.push(`  lessonTitle: string`);
  lines.push(`  moduleId: string`);
  lines.push(`  moduleName: string`);
  lines.push(``);
  lines.push(`  // Primary content`);
  lines.push(`  scenario: string | null`);
  lines.push(`  prompt: string | null`);
  lines.push(`  recommendedAnswer: string | null`);
  lines.push(``);
  lines.push(`  // Roleplay-specific`);
  lines.push(`  difficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert' | null`);
  lines.push(`  estimatedMinutes: number | null`);
  lines.push(`  context: string | null`);
  lines.push(`  objective: string | null`);
  lines.push(`  successCriteria: string | null`);
  lines.push(`  yourRole: string | null`);
  lines.push(`  theirRole: string | null`);
  lines.push(`  hints: string[]`);
  lines.push(`  managerTip: string | null`);
  lines.push(``);
  lines.push(`  // Practice-specific`);
  lines.push(`  whyThisWorks: string | null`);
  lines.push(`  commonMistake: string | null`);
  lines.push(`  placeholder: string | null`);
  lines.push(``);
  lines.push(`  // QuickRef-specific`);
  lines.push(`  quickRefTitle: string | null`);
  lines.push(`  quickRefItems: QuickRefItem[] | null`);
  lines.push(``);
  lines.push(`  // Lesson metadata (from frontmatter)`);
  lines.push(`  tags: string[]`);
  lines.push(`  funnelStage: string | null`);
  lines.push(`  related: string[]`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`// ─── Registry ────────────────────────────────────────────────────`);
  lines.push(``);
  lines.push(`export const SCRIPTS_REGISTRY: ScriptEntry[] = ${JSON.stringify(entries, null, 2)} as const satisfies readonly ScriptEntry[]`);
  lines.push(``);
  lines.push(`// ─── Helpers ─────────────────────────────────────────────────────`);
  lines.push(``);
  lines.push(`/** Look up a script by its canonical ID */`);
  lines.push(`export function getScriptById(id: string): ScriptEntry | undefined {`);
  lines.push(`  return SCRIPTS_REGISTRY.find((s) => s.id === id)`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`/** All scripts belonging to a given module */`);
  lines.push(`export function getScriptsByModule(moduleId: string): ScriptEntry[] {`);
  lines.push(`  return SCRIPTS_REGISTRY.filter((s) => s.moduleId === moduleId)`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`/** All scripts of a given type */`);
  lines.push(`export function getScriptsByType(type: ScriptType): ScriptEntry[] {`);
  lines.push(`  return SCRIPTS_REGISTRY.filter((s) => s.type === type)`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`/** All objection-response scripts (the 7 named objections) */`);
  lines.push(`export function getObjectionScripts(): ScriptEntry[] {`);
  lines.push(`  return SCRIPTS_REGISTRY.filter((s) => s.type === 'objection-response')`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`/** Unique module IDs present in the registry */`);
  lines.push(`export function getModuleIds(): string[] {`);
  lines.push(`  return [...new Set(SCRIPTS_REGISTRY.map((s) => s.moduleId))]`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`/** Count of scripts per module */`);
  lines.push(`export function getModuleScriptCounts(): Record<string, number> {`);
  lines.push(`  const counts: Record<string, number> = {}`);
  lines.push(`  for (const s of SCRIPTS_REGISTRY) {`);
  lines.push(`    counts[s.moduleId] = (counts[s.moduleId] || 0) + 1`);
  lines.push(`  }`);
  lines.push(`  return counts`);
  lines.push(`}`);
  lines.push(``);

  // Fix: replace "as const satisfies" which doesn't work with JSON.stringify output
  // Use a simpler approach
  let content = lines.join('\n');
  content = content.replace(
    /as const satisfies readonly ScriptEntry\[\]/,
    ''
  );

  return content;
}

// ─── Main ────────────────────────────────────────────────────────

function main() {
  console.log('🔍 Premium Scripts Library — Content Extraction Pipeline');
  console.log(`   Content root: ${CONTENT_ROOT}`);
  console.log(`   Output:       ${OUTPUT}`);
  console.log('');

  const { entries, stats } = extractAll();

  console.log(`✅ Extraction complete`);
  console.log(`   Total entries: ${entries.length}`);
  console.log(`   Roleplay:          ${stats.roleplay}`);
  console.log(`   Objection Response: ${stats.objectionResponse}`);
  console.log(`   Practice:          ${stats.practice}`);
  console.log(`   Quick Reference:   ${stats.quickref}`);
  console.log('');

  // Verify identifier uniqueness
  const ids = entries.map((e) => e.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length > 0) {
    console.error(`❌ Duplicate IDs found: ${dupes.join(', ')}`);
    process.exit(1);
  }
  console.log(`✅ All ${ids.length} IDs are unique`);

  // Check estimatedMinutes coverage
  const roleplays = entries.filter((e) => e.type === 'roleplay' || e.type === 'objection-response');
  const withTime = roleplays.filter((e) => e.estimatedMinutes !== null);
  console.log(`📊 estimatedMinutes coverage: ${withTime.length}/${roleplays.length} (${Math.round((withTime.length / roleplays.length) * 100)}%)`);

  // Generate TypeScript file
  const tsContent = generateTS(entries);
  writeFileSync(OUTPUT, tsContent, 'utf-8');
  console.log(`\n📝 Generated ${OUTPUT}`);
  console.log(`   File size: ${(Buffer.byteLength(tsContent, 'utf-8') / 1024).toFixed(1)} KB`);
}

main();
