/**
 * Pure breadcrumb-segment computation, per docs/NAVIGATION_MANIFEST.md's
 * Breadcrumbs section and docs/LEARNING_COMPONENT_SPEC.md's Breadcrumbs
 * component contract: "an ordered list of {label, route} pairs,
 * computed by the parent page from route and manifest data — this
 * component itself performs no resolution." This module is that
 * computation step; components/layout/Breadcrumbs.tsx only renders
 * the result.
 */

import { ROUTES } from './routes';
import type { BreadcrumbContext, BreadcrumbSegment } from '@/types/navigation';

/**
 * Resolves a BreadcrumbContext into the ordered segment list to render,
 * following the four patterns docs/NAVIGATION_MANIFEST.md's Breadcrumbs
 * table defines.
 */
export function getBreadcrumbs(context: BreadcrumbContext): BreadcrumbSegment[] {
  const browse: BreadcrumbSegment = { label: 'Browse', href: ROUTES.browse.index };

  switch (context.kind) {
    case 'module-article':
      return [
        browse,
        { label: context.moduleName, href: context.moduleHref },
        { label: context.articleTitle, href: context.articleHref },
      ];

    case 'role-collection-article':
      return [
        browse,
        { label: 'Candidate Intelligence', href: ROUTES.browse.candidateIntelligence },
        { label: context.collectionName, href: context.collectionHref },
        { label: context.articleTitle, href: context.articleHref },
      ];

    case 'schema-file':
      return [
        browse,
        { label: 'Candidate Intelligence', href: ROUTES.browse.candidateIntelligence },
        { label: context.fileTitle, href: context.fileHref },
      ];

    case 'learning-path':
      return [
        { label: 'Learning Paths', href: ROUTES.learning.index },
        { label: context.pathName, href: context.pathHref },
      ];

    case 'assessment':
      return [
        { label: context.originName, href: context.originHref },
        { label: context.assessmentName, href: context.assessmentHref },
      ];

    default: {
      const exhaustiveCheck: never = context;
      return exhaustiveCheck;
    }
  }
}
