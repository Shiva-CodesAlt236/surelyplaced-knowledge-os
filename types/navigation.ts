/**
 * Navigation-related types shared across the application shell.
 *
 * These types back the structures defined in docs/NAVIGATION_MANIFEST.md
 * (Top Navigation, Sidebar, Breadcrumbs, Module Navigation) and
 * docs/ROUTE_REGISTRY.md (route paths and auth requirements).
 */

/**
 * A persona/role the shell renders navigation differently for, per
 * docs/NAVIGATION_MANIFEST.md's "Navigation State by Persona" table.
 */
export type Persona =
  | 'career-advisor'
  | 'sales-manager'
  | 'trainer'
  | 'admin';

/**
 * A single Top Navigation entry, per docs/NAVIGATION_MANIFEST.md's
 * Top Navigation table.
 */
export interface TopNavItem {
  /** Stable identifier, also used as the React key. */
  id: string;
  /** Visible label. */
  label: string;
  /** Route path this item navigates to. */
  href: string;
  /** Lucide icon name rendered alongside the label. */
  icon: 'dashboard' | 'browse' | 'learning-paths' | 'search' | 'ask-ai';
  /** Personas this item is visible to. Omitted means "all personas". */
  visibleTo?: Persona[];
}

/**
 * The two Sidebar modes defined in docs/NAVIGATION_MANIFEST.md's
 * Sidebar section: the full content tree, or a single active
 * Learning Path's scoped module list.
 */
export type SidebarMode = 'browse' | 'path';

/**
 * A learner-facing completion state for a Sidebar entry, per
 * docs/MODULE_INDEX_STANDARD.md's proposed Completion Status field.
 */
export type CompletionStatus = 'not-started' | 'in-progress' | 'complete';

/**
 * A single node in the Sidebar's content tree, corresponding to either
 * a top-level module, a Role Collection, or the Candidate Intelligence
 * Framework's schema-file group, per docs/CONTENT_MANIFEST.md.
 */
export interface SidebarModuleNode {
  /** Module ID, per docs/CONTENT_MANIFEST.md (the folder name). */
  id: string;
  /** Display name, per docs/CONTENT_MANIFEST.md's Module Name field. */
  name: string;
  /** Route this node navigates to. */
  href: string;
  /** Child modules (Role Collections nested under candidate-intelligence). */
  children?: SidebarModuleNode[];
  /** Completion state, where known. Undefined means not yet tracked. */
  completionStatus?: CompletionStatus;
}

/**
 * One segment of a Breadcrumbs trail, per docs/NAVIGATION_MANIFEST.md's
 * Breadcrumbs section and docs/LEARNING_COMPONENT_SPEC.md's Breadcrumbs
 * component contract (an ordered list of {label, route} pairs).
 */
export interface BreadcrumbSegment {
  label: string;
  href: string;
}

/**
 * The context a page supplies to compute its Breadcrumbs trail, per
 * lib/breadcrumbs.ts and the four patterns named in
 * docs/NAVIGATION_MANIFEST.md's Breadcrumbs table.
 */
export type BreadcrumbContext =
  | { kind: 'module-article'; moduleName: string; moduleHref: string; articleTitle: string; articleHref: string }
  | {
      kind: 'role-collection-article';
      collectionName: string;
      collectionHref: string;
      articleTitle: string;
      articleHref: string;
    }
  | { kind: 'schema-file'; fileTitle: string; fileHref: string }
  | { kind: 'learning-path'; pathName: string; pathHref: string }
  | { kind: 'assessment'; originName: string; originHref: string; assessmentName: string; assessmentHref: string };

/**
 * Previous/Next adjacency for Module Navigation, per
 * docs/NAVIGATION_MANIFEST.md's Module Navigation section.
 */
export interface AdjacentArticle {
  title: string;
  href: string;
}
