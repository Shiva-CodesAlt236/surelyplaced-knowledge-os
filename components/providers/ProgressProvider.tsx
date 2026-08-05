'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Progress state, per docs/STATE_MANAGEMENT.md's Progress domain —
 * the state Continue Learning, the Progress Bar, and Sidebar
 * completion indicators all read from. Genuinely account-level data
 * per that document, but persisted to localStorage for now rather
 * than synced through docs/API_CONTRACTS.md's Progress contract,
 * since that backend doesn't exist yet in this milestone. The store's
 * shape and actions match that future contract exactly, so wiring a
 * real API in a later milestone replaces this persistence layer
 * without changing any component that reads `useProgressStore`.
 *
 * The store starts empty — no module or article is marked complete
 * by default — consistent with docs/DASHBOARD_EXPERIENCE.md's Empty
 * States precedent: an honest empty state rather than fabricated
 * progress data.
 */
export type CompletionStatus = 'not-started' | 'in-progress' | 'complete';

interface ProgressState {
  /** Article ID (route path) -> completion status. */
  articleStatus: Record<string, CompletionStatus>;
  markArticleInProgress: (articleId: string) => void;
  markArticleComplete: (articleId: string) => void;
  /**
   * Reverts a completed article back to in-progress. Added in
   * Milestone 4C so components/learning/MarkCompleteControl.tsx can
   * let a learner undo an accidental "Mark as Complete" click — the
   * original Milestone 4A store only ever moved status forward.
   */
  markArticleIncomplete: (articleId: string) => void;
  getArticleStatus: (articleId: string) => CompletionStatus;
  getModuleCompletion: (articleIds: string[]) => { completed: number; total: number };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      articleStatus: {},

      markArticleInProgress: (articleId) =>
        set((state) => {
          if (state.articleStatus[articleId] === 'complete') return state;
          return { articleStatus: { ...state.articleStatus, [articleId]: 'in-progress' } };
        }),

      markArticleComplete: (articleId) =>
        set((state) => ({
          articleStatus: { ...state.articleStatus, [articleId]: 'complete' },
        })),

      markArticleIncomplete: (articleId) =>
        set((state) => ({
          articleStatus: { ...state.articleStatus, [articleId]: 'in-progress' },
        })),

      getArticleStatus: (articleId) => get().articleStatus[articleId] ?? 'not-started',

      getModuleCompletion: (articleIds) => {
        const { articleStatus } = get();
        const completed = articleIds.filter((id) => articleStatus[id] === 'complete').length;
        return { completed, total: articleIds.length };
      },
    }),
    { name: 'spk-os-progress' },
  ),
);

/**
 * Renders no markup of its own — Progress is pure client state with
 * no shell-level chrome to host (unlike Search or AI), so this
 * provider exists to establish the store and leaves room for a
 * future milestone to add hydration-from-server logic here once
 * docs/API_CONTRACTS.md's Progress contract is implemented.
 */
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  return children;
}
