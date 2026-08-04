'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Route, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchStore } from '@/components/providers/SearchProvider';
import { useAIStore } from '@/components/providers/AIProvider';
import { TOP_NAVIGATION } from '@/lib/navigation';
import type { TopNavItem } from '@/types/navigation';

const ICONS: Record<TopNavItem['icon'], typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  browse: BookOpen,
  'learning-paths': Route,
  search: Search,
  'ask-ai': Sparkles,
};

/**
 * The fixed Top Navigation entry set, per docs/NAVIGATION_MANIFEST.md's
 * Top Navigation section. Search and Ask AI open their respective
 * shell-level overlays instead of navigating, per
 * docs/APP_LAYOUT_SPEC.md's Global Application Shell.
 */
export function TopNavigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const openSearch = useSearchStore((state) => state.open);
  const openAI = useAIStore((state) => state.open);

  return (
    <nav className={cn('flex items-center gap-1', className)} aria-label="Primary">
      {TOP_NAVIGATION.map((item) => {
        const Icon = ICONS[item.icon];
        const isActive = pathname === item.href;

        if (item.id === 'search') {
          return (
            <button
              key={item.id}
              type="button"
              onClick={openSearch}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          );
        }

        if (item.id === 'ask-ai') {
          return (
            <button
              key={item.id}
              type="button"
              onClick={openAI}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-fd-accent text-fd-accent-foreground'
                : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
