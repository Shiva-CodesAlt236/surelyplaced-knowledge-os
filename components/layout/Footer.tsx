import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

/**
 * The shell's persistent footer, per docs/APP_LAYOUT_SPEC.md's Footer
 * entry and docs/NAVIGATION_MANIFEST.md's Footer section: a settings
 * link and a build/version indicator. `buildVersion` renders nothing
 * when unavailable rather than a placeholder value, per this
 * component's own spec.
 */
export function Footer({ buildVersion }: { buildVersion?: string }) {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 border-t border-fd-border px-4 py-4 text-xs text-fd-muted-foreground sm:flex-row">
      <p>Surely Placed Knowledge OS — internal use only.</p>
      <div className="flex items-center gap-4">
        <Link href={ROUTES.settings} className="hover:text-fd-foreground">
          Settings
        </Link>
        {buildVersion && <span>v{buildVersion}</span>}
      </div>
    </footer>
  );
}
