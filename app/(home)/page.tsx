import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <div className="max-w-3xl space-y-8 py-20">
        {/* Hero */}
        <div className="space-y-4">
          <p className="text-fd-muted-foreground text-sm font-medium uppercase tracking-widest">
            Knowledge Operating System
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-fd-primary to-fd-primary/60 bg-clip-text text-transparent">
              Surely Placed
            </span>{' '}
            Knowledge
          </h1>
          <p className="text-fd-muted-foreground mx-auto max-w-xl text-lg">
            A structured documentation platform for organizing, discovering, and
            sharing knowledge across your organization.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/docs"
            className="bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90 inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium transition-colors"
          >
            Get Started
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <a
            href="https://github.com/placeholder/spk-os"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fd-muted-foreground hover:text-fd-foreground border-fd-border inline-flex items-center rounded-lg border px-6 py-3 text-sm font-medium transition-colors"
          >
            View on GitHub
          </a>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 pt-12 sm:grid-cols-3">
          <div className="bg-fd-card text-fd-card-foreground border-fd-border rounded-lg border p-6 text-left transition-shadow hover:shadow-lg">
            <div className="bg-fd-primary/10 text-fd-primary mb-3 inline-flex rounded-md p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="mb-1 font-semibold">Full-Text Search</h3>
            <p className="text-fd-muted-foreground text-sm">
              Instantly find any document with built-in Orama search.
            </p>
          </div>

          <div className="bg-fd-card text-fd-card-foreground border-fd-border rounded-lg border p-6 text-left transition-shadow hover:shadow-lg">
            <div className="bg-fd-primary/10 text-fd-primary mb-3 inline-flex rounded-md p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="mb-1 font-semibold">MDX Powered</h3>
            <p className="text-fd-muted-foreground text-sm">
              Write content in MDX with full React component support.
            </p>
          </div>

          <div className="bg-fd-card text-fd-card-foreground border-fd-border rounded-lg border p-6 text-left transition-shadow hover:shadow-lg">
            <div className="bg-fd-primary/10 text-fd-primary mb-3 inline-flex rounded-md p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h3 className="mb-1 font-semibold">Smart Navigation</h3>
            <p className="text-fd-muted-foreground text-sm">
              Auto-generated sidebar, breadcrumbs, and table of contents.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
