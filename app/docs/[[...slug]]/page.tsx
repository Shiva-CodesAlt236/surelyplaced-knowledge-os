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

/* ── Interactive Learning Widgets (Milestone 5) ────────────────── */
import { ConversationViewer } from '@/components/learning/ConversationViewer';
import { RoleplayCard } from '@/components/learning/RoleplayCard';
import { DecisionPoint } from '@/components/learning/DecisionPoint';
import { CoachingNotes } from '@/components/learning/CoachingNotes';
import { ConversationTimeline } from '@/components/learning/ConversationTimeline';
import { QuickReferencePanel } from '@/components/learning/QuickReferencePanel';
import { MistakesPanel } from '@/components/learning/MistakesPanel';
import { PracticeBox } from '@/components/learning/PracticeBox';
import { CallScorecard } from '@/components/learning/CallScorecard';
import { EstimatedTime } from '@/components/learning/EstimatedTime';
import { ModuleCompletion } from '@/components/learning/ModuleCompletion';

/**
 * MDX-available interactive learning components.
 * Content authors (Claude) use these tag names directly inside .mdx files.
 */
const learningComponents = {
  ConversationViewer,
  RoleplayCard,
  DecisionPoint,
  CoachingNotes,
  ConversationTimeline,
  QuickReferencePanel,
  MistakesPanel,
  PracticeBox,
  CallScorecard,
  EstimatedTime,
  ModuleCompletion,
};

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
      <LessonViewer
        title={page.data.title}
        articleSlug={articleSlug}
        moduleName={moduleName}
        showTitle={false}
      >
        <DocsBody>
          <MDX components={{ ...defaultMdxComponents, ...learningComponents }} />
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
