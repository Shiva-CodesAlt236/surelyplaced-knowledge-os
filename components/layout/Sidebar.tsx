'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Route as RouteIcon, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import { useProgressStore } from '@/lib/stores/useProgressStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { SidebarModuleNode } from '@/types/navigation';

interface SidebarProps {
  tree: SidebarModuleNode[];
}

/**
 * Milestone 4E: reads from `lib/stores/useProgressStore.ts` — the one
 * Progress store that survived state-management consolidation — instead
 * of the now-deleted `components/providers/ProgressProvider.tsx`, whose
 * `articleStatus` map nothing ever wrote to, leaving every completion
 * dot permanently blank. That store also only tracks a binary
 * completed/not-completed set (`completedSlugs`), with no separate
 * "in-progress" state, so this dot now renders only for completed
 * articles rather than distinguishing complete from in-progress.
 */
function CompletionDot({ articleId }: { articleId: string }) {
  const completed = useProgressStore((state) => state.isCompleted(articleId));
  if (!completed) return null;

  return <span aria-label="Complete" className="ml-auto size-1.5 shrink-0 rounded-full bg-fd-primary" />;
}

function SidebarNode({ node, depth = 0 }: { node: SidebarModuleNode; depth?: number }) {
  const pathname = usePathname();
  const { isExpanded, toggleExpanded } = useSidebar();
  const hasChildren = Boolean(node.children?.length);
  const expanded = isExpanded(node.id);
  const isActive = pathname === node.href;

  return (
    <li>
      <div className="flex items-center">
        {hasChildren && (
          <button
            type="button"
            onClick={() => toggleExpanded(node.id)}
            aria-expanded={expanded}
            aria-label={expanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
            className="flex size-7 shrink-0 items-center justify-center text-fd-muted-foreground"
          >
            <ChevronRight className={cn('size-3.5 transition-transform', expanded && 'rotate-90')} />
          </button>
        )}
        <Link
          href={node.href}
          aria-current={isActive ? 'page' : undefined}
          style={{ paddingLeft: hasChildren ? undefined : `${depth * 1.25 + 0.5}rem` }}
          className={cn(
            'flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
            isActive
              ? 'bg-fd-accent font-medium text-fd-accent-foreground'
              : 'text-fd-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
          )}
        >
          <span className="truncate">{node.name}</span>
          <CompletionDot articleId={node.href} />
        </Link>
      </div>

      {hasChildren && expanded && (
        <ul className="mt-0.5 flex flex-col gap-0.5">
          {node.children!.map((child) => (
            <SidebarNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function SidebarNav({ tree }: SidebarProps) {
  const { mode, toggleMode } = useSidebar();

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-3">
      <button
        type="button"
        onClick={toggleMode}
        className="flex items-center gap-2 self-start rounded-md px-2 py-1 text-xs font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
      >
        {mode === 'browse' ? <BookOpen className="size-3.5" /> : <RouteIcon className="size-3.5" />}
        {mode === 'browse' ? 'Browsing all modules' : 'Following your Learning Path'}
      </button>

      {mode === 'browse' ? (
        <ul className="flex flex-col gap-0.5">
          {tree.map((node) => (
            <SidebarNode key={node.id} node={node} />
          ))}
        </ul>
      ) : (
        <p className="px-2 py-4 text-sm text-fd-muted-foreground">
          You don&apos;t have an active Learning Path yet. Switch back to browsing all modules, or
          enroll in a path from the Learning Paths page.
        </p>
      )}
    </div>
  );
}

/**
 * Composes the desktop persistent Sidebar column and the mobile
 * slide-in drawer variant from one shared tree renderer, per
 * docs/APP_LAYOUT_SPEC.md's Desktop Behaviour and Mobile Behaviour
 * sections.
 */
export function Sidebar({ tree }: SidebarProps) {
  const { isMobileOpen, closeMobile } = useSidebar();

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-fd-border lg:block">
        <SidebarNav tree={tree} />
      </aside>

      <Sheet open={isMobileOpen} onOpenChange={(open) => !open && closeMobile()}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader>
            <SheetTitle>Browse</SheetTitle>
          </SheetHeader>
          <SidebarNav tree={tree} />
        </SheetContent>
      </Sheet>
    </>
  );
}
