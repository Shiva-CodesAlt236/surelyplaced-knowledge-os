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
import { getLessonDuration } from '@/lib/academy-duration';
import { ACADEMY_LESSON_SEQUENCE } from '@/lib/academy-sequence';

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
import { ManagerTip } from '@/components/learning/ManagerTip';
import { DecisionTree } from '@/components/learning/DecisionTree';
import { AcademyHomeHeader } from '@/components/learning/AcademyHomeHeader';
import { LearningJourneyStepper } from '@/components/learning/LearningJourneyStepper';
import { ModuleProgressSummary } from '@/components/learning/ModuleProgressSummary';

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
  ManagerTip,
  DecisionTree,
  AcademyHomeHeader,
  LearningJourneyStepper,
  ModuleProgressSummary,
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

/**
 * Reference heuristic for lesson difficulty bucketing by stepNumber.
 * Retained uninvoked per Fix 3 specification until an explicit per-lesson
 * difficulty taxonomy is product-approved.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDifficultyForLesson(slug: string): "Foundational" | "Intermediate" | "Advanced" | "Expert" {
  const item = ACADEMY_LESSON_SEQUENCE.find((i) => i.slug === slug);
  if (!item) return "Intermediate";
  if (item.stepNumber <= 1) return "Foundational";
  if (item.stepNumber <= 3) return "Intermediate";
  if (item.stepNumber <= 5) return "Advanced";
  return "Expert";
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  let page = source.getPage(params.slug);
  if (!page && params.slug && params.slug.length > 0) {
    // Attempt fallback to overview or index page when requesting a module directory
    page = source.getPage([...params.slug, 'overview']);
    if (!page) {
      const folderKey = params.slug.join('/');
      const fallbacks: Record<string, string[]> = {
        'candidate-intelligence': ['business-analysis', 'overview'],
        'industry-playbooks': ['industry-discovery-framework'],
        'sales-operations': ['sales-workflow-overview'],
        'visa-playbooks': ['visa-discovery-framework'],
      };
      if (fallbacks[folderKey]) {
        page = source.getPage(fallbacks[folderKey]);
      }
    }
  }
  if (!page) notFound();

  const MDX = page.data.body;
  const segments = params.slug ?? [];
  const articleSlug = `/docs${segments.length > 0 ? `/${segments.join('/')}` : ''}`;
  const moduleName = segments[0] ? titleCase(segments[0]) : undefined;
  const readingTimeMinutes = getLessonDuration(articleSlug);

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <LessonViewer
        title={page.data.title}
        description={page.data.description}
        articleSlug={articleSlug}
        moduleName={moduleName}
        readingTimeMinutes={readingTimeMinutes}
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
