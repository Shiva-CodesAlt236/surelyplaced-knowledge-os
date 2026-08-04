import Link from 'next/link';
import { Compass, GraduationCap, Search, Sparkles } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ROUTES } from '@/lib/routes';

/**
 * The Academy entry point, rendered at "/" per the "Replace the app
 * root" decision governing this milestone. Composes `AppShell` here
 * rather than in app/layout.tsx, so app/docs/ (which supplies its own
 * Fumadocs `DocsLayout` chrome) isn't double-wrapped in the Academy
 * Header/Sidebar/Footer.
 *
 * docs/ROUTE_REGISTRY.md places the authenticated Dashboard at
 * `/dashboard`, and its widgets (Continue Learning, progress rings,
 * recent activity) are specified in docs/DASHBOARD_COMPONENT_SPEC.md —
 * a future milestone, not this one. Rendering those widgets here
 * without that spec's real data pipeline would be exactly the kind of
 * fake implementation this build excludes, so this page instead hosts
 * an honest, shell-scoped landing view: real navigation into the four
 * top-level destinations named in docs/APP_LAYOUT_SPEC.md's Top
 * Navigation entry, using this codebase's real `ROUTES` constants.
 */
export default function HomePage() {
  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 py-12 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-fd-foreground">
            Surely Placed Knowledge OS
          </h1>
          <p className="text-fd-muted-foreground">
            The Career Advisor Academy for Admissions Advisors — discovery, discussion, closing,
            objection handling, and candidate intelligence, all in one place.
          </p>
        </div>

        <nav aria-label="Primary destinations" className="grid w-full gap-3 sm:grid-cols-2">
          <Link
            href={ROUTES.browse.index}
            className="flex flex-col items-start gap-2 rounded-lg border border-fd-border p-4 text-left transition-colors hover:bg-fd-accent"
          >
            <Compass className="size-5 text-fd-primary" />
            <span className="font-medium text-fd-foreground">Browse</span>
            <span className="text-sm text-fd-muted-foreground">
              Explore every module in the Knowledge OS.
            </span>
          </Link>

          <Link
            href={ROUTES.learning.index}
            className="flex flex-col items-start gap-2 rounded-lg border border-fd-border p-4 text-left transition-colors hover:bg-fd-accent"
          >
            <GraduationCap className="size-5 text-fd-primary" />
            <span className="font-medium text-fd-foreground">Learning Paths</span>
            <span className="text-sm text-fd-muted-foreground">
              Guided sequences through the curriculum.
            </span>
          </Link>

          <Link
            href={ROUTES.search.index}
            className="flex flex-col items-start gap-2 rounded-lg border border-fd-border p-4 text-left transition-colors hover:bg-fd-accent"
          >
            <Search className="size-5 text-fd-primary" />
            <span className="font-medium text-fd-foreground">Search</span>
            <span className="text-sm text-fd-muted-foreground">
              Find anything in the Knowledge OS. Press ⌘K anywhere.
            </span>
          </Link>

          <Link
            href={ROUTES.ai.index}
            className="flex flex-col items-start gap-2 rounded-lg border border-fd-border p-4 text-left transition-colors hover:bg-fd-accent"
          >
            <Sparkles className="size-5 text-fd-primary" />
            <span className="font-medium text-fd-foreground">Ask AI</span>
            <span className="text-sm text-fd-muted-foreground">
              Ask a question grounded in the Knowledge OS. Press ⌘J anywhere.
            </span>
          </Link>
        </nav>
      </div>
    </AppShell>
  );
}
