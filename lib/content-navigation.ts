/**
 * Server-only content-tree navigation source.
 *
 * `getContentNavigation` reads the real `content/docs/` tree from disk
 * (via `meta.json` files, the same source Fumadocs itself renders
 * from) rather than hard-coding a module list, so the Sidebar always
 * reflects the live repository per docs/AI_CONTEXT_PACK.md §3's
 * standing instruction to inspect the live tree rather than trust a
 * static description of it.
 *
 * Kept in its own module, separate from `lib/navigation.ts`'s
 * client-safe `TOP_NAVIGATION`, because this file's top-level
 * `node:fs`/`node:fs/promises` imports have no browser equivalent —
 * importing this module from anywhere in a Client Component's module
 * graph breaks the client bundle. Import it only from a Server
 * Component (see `components/layout/AppShell.tsx`'s usage).
 */

import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { ROUTES } from './routes';
import type { SidebarModuleNode } from '@/types/navigation';

const CONTENT_DOCS_DIR = path.join(process.cwd(), 'content', 'docs');

interface MetaJson {
  title?: string;
  pages?: string[];
}

async function readMetaJson(dir: string): Promise<MetaJson | null> {
  const metaPath = path.join(dir, 'meta.json');
  if (!existsSync(metaPath)) return null;
  try {
    const raw = await readFile(metaPath, 'utf-8');
    return JSON.parse(raw) as MetaJson;
  } catch {
    return null;
  }
}

function isDirectory(fullPath: string): boolean {
  return existsSync(fullPath) && statSync(fullPath).isDirectory();
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function getRoleCollectionChildren(): Promise<SidebarModuleNode[]> {
  const candidateIntelligenceDir = path.join(CONTENT_DOCS_DIR, 'candidate-intelligence');
  const meta = await readMetaJson(candidateIntelligenceDir);
  if (!meta?.pages) return [];

  const children: SidebarModuleNode[] = [];

  for (const pageId of meta.pages) {
    const childDir = path.join(candidateIntelligenceDir, pageId);
    if (!isDirectory(childDir)) continue; // skip schema files (README, PROFILE_SCHEMA, and the rest)

    const childMeta = await readMetaJson(childDir);
    children.push({
      id: `candidate-intelligence/${pageId}`,
      name: childMeta?.title ?? titleCase(pageId),
      href: ROUTES.browse.roleCollection(pageId),
    });
  }

  return children;
}

/**
 * Builds the Sidebar's Browse-mode tree from the live `content/docs/`
 * folder structure, per docs/CONTENT_MANIFEST.md's manifest record
 * shape and docs/NAVIGATION_MANIFEST.md's Sidebar section.
 */
export async function getContentNavigation(): Promise<SidebarModuleNode[]> {
  const rootMeta = await readMetaJson(CONTENT_DOCS_DIR);
  if (!rootMeta?.pages) return [];

  const nodes: SidebarModuleNode[] = [];

  for (const pageId of rootMeta.pages) {
    const moduleDir = path.join(CONTENT_DOCS_DIR, pageId);
    if (!isDirectory(moduleDir)) continue; // skip single-file pages such as index.mdx

    if (pageId === 'candidate-intelligence') {
      const moduleMeta = await readMetaJson(moduleDir);
      nodes.push({
        id: pageId,
        name: moduleMeta?.title ?? titleCase(pageId),
        href: ROUTES.browse.candidateIntelligence,
        children: await getRoleCollectionChildren(),
      });
      continue;
    }

    const moduleMeta = await readMetaJson(moduleDir);
    nodes.push({
      id: pageId,
      name: moduleMeta?.title ?? titleCase(pageId),
      href: ROUTES.browse.module(pageId),
    });
  }

  return nodes;
}
