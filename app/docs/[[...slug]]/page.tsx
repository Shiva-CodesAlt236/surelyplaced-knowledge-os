import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from 'fumadocs-ui/page';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { LessonViewer } from '@/components/learning/LessonViewer';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const segments = params.slug ?? [];
  const articleSlug = `/docs${segments.length > 0 ? `/${segments.join('/')}` : ''}`;
  const moduleName = segments[0] ? titleCase(segments[0]) : undefined;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      {/*
        Extends fumadocs' own DocsPage with the Academy-specific
        chrome it doesn't provide — bookmark/completion controls and
        a personal notes panel — rather than duplicating it
        (Milestone 4C, Priority 7). `showTitle={false}` because
        DocsTitle/DocsDescription above already render the title;
        readingTimeMinutes/difficulty are intentionally omitted since
        this codebase doesn't compute real values for either, and a
        fixed placeholder shown identically on every one of the 341
        articles would itself be fabricated per-article metadata.
      */}
      <LessonViewer
        title={page.data.title}
        articleSlug={articleSlug}
        moduleName={moduleName}
        showTitle={false}
      >
        <DocsBody>
          <MDX components={{ ...defaultMdxComponents }} />
        </DocsBody>
      </LessonViewer>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
