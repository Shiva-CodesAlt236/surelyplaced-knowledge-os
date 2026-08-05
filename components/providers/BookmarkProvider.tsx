'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Bookmark state, following the same shape and persistence pattern as
 * components/providers/ProgressProvider.tsx (Milestone 4A): a
 * client-only Zustand store, persisted to localStorage since no
 * account-level backend exists yet, with the store starting empty —
 * no bookmark exists until the learner saves one — rather than
 * seeding fabricated bookmarks (Milestone 4C, Priority 6).
 */
export interface BookmarkEntry {
  /** Route path of the bookmarked article, e.g. "/docs/closing/asking-for-the-commitment". */
  href: string;
  title: string;
  savedAt: number;
}

interface BookmarkState {
  bookmarks: Record<string, BookmarkEntry>;
  toggleBookmark: (href: string, title: string) => boolean;
  isBookmarked: (href: string) => boolean;
  getBookmarks: () => BookmarkEntry[];
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: {},

      toggleBookmark: (href, title) => {
        const existing = get().bookmarks[href];
        if (existing) {
          set((state) => {
            const next = { ...state.bookmarks };
            delete next[href];
            return { bookmarks: next };
          });
          return false;
        }
        set((state) => ({
          bookmarks: {
            ...state.bookmarks,
            [href]: { href, title, savedAt: Date.now() },
          },
        }));
        return true;
      },

      isBookmarked: (href) => Boolean(get().bookmarks[href]),

      getBookmarks: () =>
        Object.values(get().bookmarks).sort((a, b) => b.savedAt - a.savedAt),
    }),
    { name: 'spk-os-bookmarks' },
  ),
);

/**
 * Renders no markup of its own, matching ProgressProvider's pattern —
 * pure client state with no shell-level chrome to host.
 */
export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  return children;
}
