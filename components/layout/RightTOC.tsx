'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TocHeading } from '@/types/layout';

/**
 * Scroll-synced table of contents for the current article, per
 * docs/APP_LAYOUT_SPEC.md's Right TOC entry: "rendered only on the
 * Lesson / Article Page," generated from that article's own headings.
 * A parent page that isn't rendering an article simply doesn't pass
 * `headings`, per docs/APP_LAYOUT_SPEC.md's AppShellProps.
 */
export function RightTOC({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-96px 0px -70% 0px' },
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-56 shrink-0 overflow-y-auto py-6 pr-2 xl:block"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
        On this page
      </p>
      <ul className="flex flex-col gap-1 border-l border-fd-border">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={activeId === heading.id ? 'true' : undefined}
              className={cn(
                '-ml-px block border-l-2 py-1 pl-3 text-sm transition-colors',
                heading.depth === 3 && 'pl-6',
                activeId === heading.id
                  ? 'border-fd-primary font-medium text-fd-foreground'
                  : 'border-transparent text-fd-muted-foreground hover:text-fd-foreground',
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
