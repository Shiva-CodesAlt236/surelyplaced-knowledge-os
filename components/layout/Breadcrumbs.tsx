import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BreadcrumbSegment } from '@/types/navigation';

/**
 * Renders an already-computed breadcrumb trail, per
 * docs/NAVIGATION_MANIFEST.md's Breadcrumbs section and
 * docs/LEARNING_COMPONENT_SPEC.md's Breadcrumbs component contract —
 * this component performs no resolution itself; `lib/breadcrumbs.ts`
 * is what computes `segments`. On narrow viewports, middle segments
 * collapse to an ellipsis rather than wrapping to a second line, per
 * docs/APP_LAYOUT_SPEC.md's Breadcrumbs entry.
 */
export function Breadcrumbs({ segments }: { segments: BreadcrumbSegment[] }) {
  if (segments.length === 0) return null;

  const first = segments[0];
  const last = segments[segments.length - 1];
  const middle = segments.slice(1, -1);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-fd-muted-foreground">
      <ol className="flex items-center">
        <BreadcrumbItem segment={first} isLast={segments.length === 1} />

        {middle.map((segment) => (
          <BreadcrumbItem key={segment.href} segment={segment} isLast={false} className="hidden sm:flex" />
        ))}

        {middle.length > 0 && (
          <li className="flex items-center sm:hidden" aria-hidden="true">
            <ChevronRight className="mx-1 size-3.5 shrink-0" />
            <span>…</span>
          </li>
        )}

        {segments.length > 1 && <BreadcrumbItem segment={last} isLast />}
      </ol>
    </nav>
  );
}

function BreadcrumbItem({
  segment,
  isLast,
  className,
}: {
  segment: BreadcrumbSegment;
  isLast: boolean;
  className?: string;
}) {
  return (
    <li className={cn('flex items-center', className)}>
      {isLast ? (
        <span aria-current="page" className="font-medium text-fd-foreground">
          {segment.label}
        </span>
      ) : (
        <>
          <Link href={segment.href} className="transition-colors hover:text-fd-foreground">
            {segment.label}
          </Link>
          <ChevronRight className="mx-1 size-3.5 shrink-0" aria-hidden="true" />
        </>
      )}
    </li>
  );
}
