import './globals.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SearchProvider } from '@/components/providers/SearchProvider';
import { ProgressProvider } from '@/components/providers/ProgressProvider';
import { AIProvider } from '@/components/providers/AIProvider';

const inter = Inter({ subsets: ['latin'] });

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
 * Search, Progress, AI) plus the pre-existing fumadocs `RootProvider`
 * that app/docs/layout.tsx's `DocsLayout` depends on — it does not
 * render the Academy `AppShell` chrome (Header/Sidebar/Footer) itself,
 * since app/docs/ already supplies its own Fumadocs chrome and must
 * not be double-wrapped. `AppShell` is composed specifically in
 * app/page.tsx, the Academy entry point.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          <ThemeProvider>
            <ProgressProvider>
              <SearchProvider>
                <AIProvider>{children}</AIProvider>
              </SearchProvider>
            </ProgressProvider>
          </ThemeProvider>
        </RootProvider>
      </body>
    </html>
  );
}
