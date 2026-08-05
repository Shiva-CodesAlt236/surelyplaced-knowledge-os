import './globals.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SearchProvider } from '@/components/providers/SearchProvider';
import { AIProvider } from '@/components/providers/AIProvider';

const inter = Inter({ subsets: ['latin'] });

/**
 * Sets the resolved `.dark` class on `<html>` before hydration, reading
 * the same `spk-os-theme` localStorage key `hooks/useTheme.ts` persists
 * to. Milestone 4E: without this, `ThemeProvider`'s `useEffect` only
 * applies the class after first paint, producing a flash of the wrong
 * theme for any learner whose stored or system preference is dark.
 * Kept intentionally tiny and defensive (wrapped in try/catch) since it
 * runs before React and any error here would blank the page.
 */
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var raw = localStorage.getItem('spk-os-theme');
    var preference = raw ? (JSON.parse(raw).state || {}).preference : 'system';
    var dark = preference === 'dark' || (preference !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export const metadata: Metadata = {
  title: {
    default: 'Surely Placed Knowledge OS',
    template: '%s | SPK OS',
  },
  description:
    'The knowledge operating system for structured documentation and organizational intelligence.',
};

/**
 * Root layout for every route in the application, including the
 * Academy shell mounted at "/" (app/page.tsx) and the existing
 * Fumadocs-powered documentation site under app/docs/. Kept
 * intentionally thin: it wraps children in the global providers named
 * in docs/APP_LAYOUT_SPEC.md's Global Application Shell entry (Theme,
 * Search, AI) plus the pre-existing fumadocs `RootProvider` that
 * app/docs/layout.tsx's `DocsLayout` depends on — it does not render
 * the Academy `AppShell` chrome (Header/Sidebar/Footer) itself, since
 * app/docs/ already supplies its own Fumadocs chrome and must not be
 * double-wrapped. `AppShell` is composed specifically in app/page.tsx,
 * the Academy entry point.
 *
 * Milestone 4E: Progress, Bookmark, Notes, and Assessment no longer
 * have dedicated Provider wrappers here. All four were pure pass-through
 * components (`return children`) whose Zustand stores had zero
 * remaining consumers after Milestone 4C — every component that reads
 * Progress/Bookmark/Notes/Assessment state now imports directly from
 * `lib/stores/*`, which needs no Provider (Zustand stores work without
 * a wrapping component). See MILESTONE_4E_STABILIZATION_REPORT.md's
 * Deletion Report for the full rationale.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          <ThemeProvider>
            <SearchProvider>
              <AIProvider>{children}</AIProvider>
            </SearchProvider>
          </ThemeProvider>
        </RootProvider>
      </body>
    </html>
  );
}
