/**
 * Client-safe navigation data: the fixed Top Navigation entry set, per
 * docs/NAVIGATION_MANIFEST.md's Top Navigation table. Imported by the
 * Client Component `components/layout/TopNavigation.tsx`, so this
 * module must stay free of server-only imports (no `node:fs`, etc.) —
 * the content-tree read that powers the Sidebar lives in
 * `lib/content-navigation.ts` instead, which is imported only from the
 * Server Component `components/layout/AppShell.tsx`. Splitting these
 * keeps Node built-ins out of the browser bundle: bundling
 * `getContentNavigation`'s `node:fs` import into any module a Client
 * Component imports breaks the client build entirely, since there is
 * no browser polyfill for Node's `fs` module.
 */

import { ROUTES } from './routes';
import type { TopNavItem } from '@/types/navigation';

export const TOP_NAVIGATION: TopNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: ROUTES.dashboard, icon: 'dashboard' },
  { id: 'browse', label: 'Browse', href: ROUTES.browse.index, icon: 'browse' },
  { id: 'learning-paths', label: 'Learning Paths', href: ROUTES.learning.index, icon: 'learning-paths' },
  { id: 'search', label: 'Search', href: ROUTES.search.index, icon: 'search' },
  { id: 'ask-ai', label: 'Ask AI', href: ROUTES.ai.index, icon: 'ask-ai' },
];
