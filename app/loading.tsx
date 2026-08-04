import { Loader2 } from 'lucide-react';

/**
 * Route-level loading state for the "/" segment, per
 * docs/APP_LAYOUT_SPEC.md's Loading States requirement. Next.js
 * renders this automatically while app/page.tsx's data (the Sidebar's
 * `getContentNavigation()` read, via AppShell) is being fetched, using
 * the App Router's built-in Suspense boundary — no manual loading
 * state wiring needed in the page itself.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center" role="status">
      <Loader2 className="size-6 animate-spin text-fd-muted-foreground" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
