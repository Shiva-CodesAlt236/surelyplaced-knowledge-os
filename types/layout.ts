/**
 * Layout-related types shared across the application shell, per
 * docs/APP_LAYOUT_SPEC.md.
 */

import type { ReactNode } from 'react';
import type { BreadcrumbSegment } from './navigation';

/**
 * The two layout modes the shell resolves to, per
 * docs/APP_LAYOUT_SPEC.md's Responsive Layout / Desktop Behaviour /
 * Mobile Behaviour sections. "Tablet" is treated as an intermediate
 * state between the two rather than a third mode, using Tailwind's
 * `md:` breakpoint as the tablet threshold and `lg:` as the desktop
 * threshold.
 */
export type LayoutBreakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * A resolved theme value. "system" is a user preference that resolves
 * to "light" or "dark" at render time; the applied value is what's
 * actually written to the document root's class list.
 */
export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

/**
 * Props accepted by the AppShell component, per
 * docs/APP_LAYOUT_SPEC.md's Global Application Shell entry and
 * docs/PAGE_TEMPLATES.md's per-template region composition.
 */
export interface AppShellProps {
  children: ReactNode;
  /**
   * Breadcrumb trail for the current page. Omitted (or empty) on a
   * root-level page that has no meaningful trail, per
   * docs/NAVIGATION_MANIFEST.md's Breadcrumbs section.
   */
  breadcrumbs?: BreadcrumbSegment[];
  /**
   * Heading data for the Right TOC, present only when the current
   * page is rendering a single article, per docs/APP_LAYOUT_SPEC.md's
   * Right TOC entry ("rendered only on the Lesson / Article Page").
   */
  tocHeadings?: TocHeading[];
}

/** A single heading extracted from an article for the Right TOC. */
export interface TocHeading {
  id: string;
  text: string;
  depth: 2 | 3;
}
