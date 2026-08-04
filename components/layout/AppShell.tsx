import { getContentNavigation } from '@/lib/content-navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Breadcrumbs } from './Breadcrumbs';
import { RightTOC } from './RightTOC';
import type { AppShellProps } from '@/types/layout';

/**
 * The persistent application shell every Academy route renders
 * inside, per docs/APP_LAYOUT_SPEC.md's Global Application Shell
 * entry. A Server Component so the Sidebar's content tree (per
 * docs/NAVIGATION_MANIFEST.md's Sidebar section) is fetched from the
 * live `content/docs/` structure once, server-side, rather than
 * requested from the client.
 */
export async function AppShell({ children, breadcrumbs = [], tocHeadings = [] }: AppShellProps) {
  const sidebarTree = await getContentNavigation();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar tree={sidebarTree} />

        <div className="flex min-w-0 flex-1 justify-center">
          <main className="flex min-w-0 flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
            {breadcrumbs.length > 0 && <Breadcrumbs segments={breadcrumbs} />}
            {children}
          </main>

          {tocHeadings.length > 0 && (
            <div className="hidden xl:block xl:px-6">
              <RightTOC headings={tocHeadings} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
