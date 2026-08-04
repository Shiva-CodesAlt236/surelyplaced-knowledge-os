'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Route-level error boundary for the "/" segment, per
 * docs/APP_LAYOUT_SPEC.md's Error Boundaries requirement. Must be a
 * Client Component per the Next.js App Router error-boundary contract
 * — Next.js renders this in place of app/page.tsx when that segment
 * (or anything it renders) throws, and supplies `reset` to retry
 * rendering the segment.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle className="size-8 text-red-600" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-fd-foreground">Something went wrong</h1>
        <p className="max-w-sm text-sm text-fd-muted-foreground">
          The Knowledge OS ran into an unexpected error loading this page.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
