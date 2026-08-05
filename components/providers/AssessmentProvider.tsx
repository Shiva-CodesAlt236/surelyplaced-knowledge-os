'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Assessment result state, following the same shape and persistence
 * pattern as components/providers/ProgressProvider.tsx. Records real
 * outcomes from components/assessment/KnowledgeCheckCard.tsx and
 * QuizRunner.tsx as the learner actually completes them, so
 * components/dashboard/KnowledgeCheckSummaryCard.tsx can read genuine
 * numbers instead of the hardcoded `passedChecks`/`totalChecks`/
 * `averageScore`/`streakDays` Milestone 4B shipped (Milestone 4C,
 * Priority 2 and Priority 6). The store starts empty; there is no
 * streak concept here since nothing in this codebase tracks
 * day-over-day activity — inventing one to back a "streak" number
 * would itself be a fabrication, so that metric is removed rather
 * than replaced.
 */
export interface AssessmentResult {
  id: string;
  title: string;
  score: number;
  passed: boolean;
  completedAt: number;
}

interface AssessmentState {
  results: Record<string, AssessmentResult>;
  recordResult: (id: string, title: string, score: number, passed: boolean) => void;
  getResult: (id: string) => AssessmentResult | undefined;
  getSummary: () => { attempted: number; passed: number; averageScore: number } | null;
  getRecentResults: (limit?: number) => AssessmentResult[];
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      results: {},

      recordResult: (id, title, score, passed) =>
        set((state) => ({
          results: {
            ...state.results,
            [id]: { id, title, score, passed, completedAt: Date.now() },
          },
        })),

      getResult: (id) => get().results[id],

      getSummary: () => {
        const all = Object.values(get().results);
        if (all.length === 0) return null;
        const passed = all.filter((r) => r.passed).length;
        const averageScore = Math.round(
          all.reduce((sum, r) => sum + r.score, 0) / all.length,
        );
        return { attempted: all.length, passed, averageScore };
      },

      getRecentResults: (limit = 5) =>
        Object.values(get().results)
          .sort((a, b) => b.completedAt - a.completedAt)
          .slice(0, limit),
    }),
    { name: 'spk-os-assessments' },
  ),
);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  return children;
}
